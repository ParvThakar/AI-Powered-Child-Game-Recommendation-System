import { NextRequest, NextResponse } from "next/server";
import {
  RecommendationRequestSchema,
  RecommendationResponse,
  SupportedCategory,
} from "@/lib/schemas";
import { getCountryName } from "@/lib/geolocation";
import { searchStoreGames } from "@/lib/game-provider";
import { rankCandidates, toRecommendedGame } from "@/lib/ranking";
import { getAiRecommendation } from "@/lib/ai-recommendation";

export async function POST(request: NextRequest) {
  try {
    let rawBody;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const parseResult = RecommendationRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { age, category, countryCode, platform = "all", limit = 20 } = parseResult.data;
    const countryName = getCountryName(countryCode);

    // 1. Fetch store games from provider (Apple App Store / Google Play / verified dataset)
    const rawCandidates = await searchStoreGames(
      category as SupportedCategory,
      countryCode,
      age,
      platform
    );

    // 2. Rank and apply hard age & content suitability filters
    const rankedCandidates = rankCandidates(
      rawCandidates,
      age,
      category as SupportedCategory
    );

    // If no candidate passed the filters
    if (rankedCandidates.length === 0) {
      const response: RecommendationResponse = {
        countryCode,
        countryName,
        category: category as SupportedCategory,
        age,
        platform,
        recommendation: null,
        alternatives: [],
        totalRecommended: 0,
        disclaimer:
          "No games met the strict age and content suitability filters for this category and region. Check store listings or try another category.",
        meta: {
          totalFound: rawCandidates.length,
          eligibleCount: 0,
          dataSource: rawCandidates[0]?.metadataSource || "None",
          aiAssisted: false,
          aiEngine: "Deterministic Rule-Based Ranking",
          timestamp: new Date().toISOString(),
        },
      };
      return NextResponse.json(response);
    }

    // 3. Attempt AI-powered recommendation with grounded validation
    let aiResult = null;
    let aiAssisted = false;

    try {
      aiResult = await getAiRecommendation(
        rankedCandidates,
        age,
        category as SupportedCategory,
        countryName
      );
      if (aiResult) {
        aiAssisted = true;
      }
    } catch (err) {
      console.warn("AI recommendation failed, falling back to deterministic score:", err);
    }

    // 4. Select top recommendation
    let topEval = rankedCandidates[0];
    let overrideReason: string | undefined = undefined;
    let extraCaveats: string[] | undefined = undefined;

    if (aiResult) {
      const matched = rankedCandidates.find(
        (c) => c.candidate.id === aiResult?.selectedGameId
      );
      if (matched) {
        topEval = matched;
        overrideReason = aiResult.reason;
        extraCaveats = aiResult.caveats;
      }
    }

    const primaryRecommendation = toRecommendedGame(
      topEval,
      overrideReason,
      extraCaveats
    );

    // 5. Build up to 19 alternatives (for up to 20 total recommendations)
    const alternativesLimit = Math.max(0, limit - 1);
    const alternatives = rankedCandidates
      .filter((c) => c.candidate.id !== primaryRecommendation.gameId)
      .slice(0, alternativesLimit)
      .map((c) => toRecommendedGame(c));

    const totalRecommended = 1 + alternatives.length;

    const response: RecommendationResponse = {
      countryCode,
      countryName,
      category: category as SupportedCategory,
      age,
      platform,
      recommendation: primaryRecommendation,
      alternatives,
      totalRecommended,
      disclaimer:
        "Information is based on available public listing metadata and does not guarantee safety. Parents and gamers should review in-app purchases, advertisements, and community guidelines.",
      meta: {
        totalFound: rawCandidates.length,
        eligibleCount: rankedCandidates.length,
        dataSource: primaryRecommendation.metadataSource,
        aiAssisted,
        aiEngine: aiAssisted
          ? `OpenRouter (${process.env.OPENROUTER_MODEL || "nvidia/nemotron-3.5-lightning:free"})`
          : "Deterministic Rule-Based Ranking",
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Recommendations route error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while generating recommendations.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
