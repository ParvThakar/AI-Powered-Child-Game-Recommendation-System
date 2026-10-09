import { EvaluatedCandidate } from "./ranking";
import {
  AiRecommendationOutput,
  AiRecommendationOutputSchema,
  SupportedCategory,
} from "./schemas";

export interface AiRecommendationResult {
  selectedGameId: string;
  reason: string;
  caveats: string[];
}

export async function getAiRecommendation(
  candidates: EvaluatedCandidate[],
  age: number,
  category: SupportedCategory,
  countryName: string
): Promise<AiRecommendationResult | null> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    // Graceful fallback to deterministic ranking when key is not set
    return null;
  }

  // We only send the top eligible candidates (up to 4)
  const topCandidates = candidates.slice(0, 4);
  if (topCandidates.length === 0) {
    return null;
  }

  const validIds = new Set(topCandidates.map((c) => c.candidate.id));

  // Prepare minimal candidate summaries strictly from verified metadata
  const candidateSummaries = topCandidates.map((c) => ({
    id: c.candidate.id,
    title: c.candidate.title,
    description: c.candidate.description
      ? c.candidate.description.slice(0, 120) + "..."
      : "No description provided",
    rating: c.candidate.rating ?? "No rating",
    ratingCount: c.candidate.ratingCount ?? 0,
    contentRating: c.candidate.contentRating || "Unverified",
    minimumAge: c.candidate.minimumAge ?? "Unknown",
    containsAds: c.candidate.containsAds,
    hasInAppPurchases: c.candidate.hasInAppPurchases,
    suitabilityStatus: c.suitabilityStatus,
  }));

  const systemPrompt = `You are a safety-conscious AI child gaming recommendation assistant.
Your task is to select the single best game from the PROVIDED CANDIDATE LIST for a ${age}-year-old child in ${countryName} interested in "${category}" games.

STRICT SAFETY AND VALIDITY RULES:
1. You MUST select ONLY a gameId from the provided candidate list. Never invent or hallucinate a game ID or title.
2. Base your reasoning ONLY on verified metadata. Do NOT claim an unverified game is guaranteed safe.
3. If a candidate contains ads or in-app purchases, note these in the "caveats" array.
4. Output ONLY a valid JSON object matching this schema:
{
  "gameId": string,
  "reason": string,
  "caveats": string[]
}`;

  const userPrompt = `Child Age: ${age}
Category: ${category}
Country: ${countryName}

Eligible Candidate Games:
${JSON.stringify(candidateSummaries, null, 2)}

Select the most developmentally suitable game from this list and explain why it fits a ${age}-year-old. Include parental caveats (ads, in-app purchases, screen time). Return JSON only.`;

  const primaryModel =
    process.env.OPENROUTER_MODEL?.trim() || "nvidia/nemotron-3.5-lightning:free";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(6000), // 6s timeout for fast responsive fallback
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "PlaySafe AI Child Game Recommender",
      },
      body: JSON.stringify({
        model: primaryModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[OpenRouter Notice] API call returned HTTP ${response.status}: ${errText}. Falling back cleanly to deterministic ranking.`);
      return null;
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) {
      console.warn("[OpenRouter Notice] No message content in completion. Falling back to deterministic ranking.");
      return null;
    }

    // Strip potential markdown code fences (e.g. ```json ... ```)
    let cleaned = rawContent.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(cleaned);
    } catch {
      console.warn("[OpenRouter Notice] Malformed JSON from model. Falling back to deterministic ranking:", cleaned);
      return null;
    }

    const parsed: AiRecommendationOutput = AiRecommendationOutputSchema.parse(parsedJson);

    // Validate server-side that the selected ID exists in the candidate list
    if (!validIds.has(parsed.gameId)) {
      console.warn(
        `[OpenRouter Warning] Model returned an unknown gameId: "${parsed.gameId}". Falling back to deterministic score.`
      );
      return null;
    }

    return {
      selectedGameId: parsed.gameId,
      reason: parsed.reason,
      caveats: parsed.caveats || [],
    };
  } catch (err) {
    console.warn(
      "[OpenRouter Notice] Request error or timeout. Falling back cleanly to deterministic ranking.",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
