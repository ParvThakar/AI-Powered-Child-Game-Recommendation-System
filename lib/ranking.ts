import { GameCandidate, RecommendedGame, SupportedCategory } from "./schemas";

export interface EvaluatedCandidate {
  candidate: GameCandidate;
  isEligible: boolean;
  filterReason?: string;
  suitabilityStatus: "verified" | "unverified" | "restricted";
  suitabilityExplanation: string;
  deterministicScore: number;
  caveats: string[];
}

// Inappropriate keyword blacklist for safety filtering
const INAPPROPRIATE_KEYWORDS = [
  "casino",
  "slots",
  "gambling",
  "dating",
  "erotic",
  "sexy",
  "betting",
];

export function evaluateSuitability(
  candidate: GameCandidate,
  targetAge: number,
  targetCategory: SupportedCategory
): EvaluatedCandidate {
  const caveats: string[] = [];

  // Check 1: Inappropriate title/description content
  const combinedText = `${candidate.title} ${candidate.description || ""}`.toLowerCase();
  for (const word of INAPPROPRIATE_KEYWORDS) {
    if (combinedText.includes(word)) {
      return {
        candidate,
        isEligible: false,
        filterReason: `Filtered out due to flagged content keyword: "${word}"`,
        suitabilityStatus: "restricted",
        suitabilityExplanation: "Contains themes not suitable for general gaming.",
        deterministicScore: 0,
        caveats: ["Flagged inappropriate themes"],
      };
    }
  }

  // Check 2: Country availability
  if (candidate.availableInCountry === false) {
    return {
      candidate,
      isEligible: false,
      filterReason: "Not available in the selected country",
      suitabilityStatus: "restricted",
      suitabilityExplanation: "Listing is unavailable in your selected region.",
      deterministicScore: 0,
      caveats: ["Regional restriction"],
    };
  }

  // Check 3: Content Rating / Minimum Age Hard Rule
  let suitabilityStatus: "verified" | "unverified" | "restricted" = "unverified";
  let suitabilityExplanation = "Listing does not provide a verified store age rating.";

  if (candidate.minimumAge !== undefined) {
    // If the game has a strict age rating above the user's age
    if (candidate.minimumAge > targetAge) {
      return {
        candidate,
        isEligible: false,
        filterReason: `Age rating (${candidate.contentRating || candidate.minimumAge + "+"}) exceeds target age (${targetAge})`,
        suitabilityStatus: "restricted",
        suitabilityExplanation: `Restricted: requires age ${candidate.minimumAge}+, exceeding user age ${targetAge}.`,
        deterministicScore: 0,
        caveats: ["Age restriction exceeded"],
      };
    }

    // Hard block mature content (17+/18+) for minors under 17
    if (candidate.minimumAge >= 17 && targetAge < 17) {
      return {
        candidate,
        isEligible: false,
        filterReason: "Mature 17+/18+ content rating is never eligible for minors under 17",
        suitabilityStatus: "restricted",
        suitabilityExplanation: "Rated for mature audiences (17+) only.",
        deterministicScore: 0,
        caveats: ["Mature rating"],
      };
    }

    suitabilityStatus = "verified";
    suitabilityExplanation = `Verified store rating: ${candidate.contentRating || `${candidate.minimumAge}+`} (suitable for age ${targetAge}).`;
  } else {
    // Missing age info
    caveats.push("Safety rating is unverified by store provider. Review advised.");
  }

  // Add ad / in-app purchase caveats
  if (candidate.containsAds) {
    caveats.push("Contains in-app advertisements.");
  }
  if (candidate.hasInAppPurchases) {
    caveats.push("Offers optional in-app purchases.");
  }

  // Calculate Deterministic Score
  // 1. Age/Suitability Confidence (35%)
  let ageScore = 10; // Base unverified
  if (suitabilityStatus === "verified" && candidate.minimumAge !== undefined) {
    ageScore = 25;
    // Developmentally optimal sweet spot bonus
    if (targetAge - candidate.minimumAge <= 4) {
      ageScore = 35;
    } else {
      ageScore = 30;
    }
  }

  // 2. Category Match (25%)
  let categoryScore = 15;
  const candCat = (candidate.category || "").toLowerCase();
  if (candCat.includes(targetCategory)) {
    categoryScore = 25;
  } else if (combinedText.includes(targetCategory)) {
    categoryScore = 20;
  }

  // 3. User Rating (20%)
  const rating = candidate.rating || 3.5;
  const ratingScore = Math.min(20, Math.max(0, (rating / 5) * 20));

  // 4. Rating Count Confidence (10%)
  // Dampens high star ratings with only 1 or 2 reviews
  const count = candidate.ratingCount || 0;
  let countScore = 2;
  if (count >= 100000) countScore = 10;
  else if (count >= 10000) countScore = 8;
  else if (count >= 1000) countScore = 6;
  else if (count >= 100) countScore = 4;

  // 5. Metadata Completeness & Freshness (10%)
  let metaScore = 2;
  if (candidate.description && candidate.description.length > 50) metaScore += 3;
  if (candidate.iconUrl) metaScore += 3;
  if (candidate.contentRating) metaScore += 2;

  const totalScore = Math.round((ageScore + categoryScore + ratingScore + countScore + metaScore) * 10) / 10;

  return {
    candidate,
    isEligible: true,
    suitabilityStatus,
    suitabilityExplanation,
    deterministicScore: totalScore,
    caveats,
  };
}

export function rankCandidates(
  candidates: GameCandidate[],
  targetAge: number,
  targetCategory: SupportedCategory
): EvaluatedCandidate[] {
  const evaluated = candidates.map((c) =>
    evaluateSuitability(c, targetAge, targetCategory)
  );

  // Keep only eligible candidates
  const eligible = evaluated.filter((e) => e.isEligible);

  // Stable sort:
  // 1. Verified suitability status precedes unverified
  // 2. Deterministic score descending
  // 3. Rating count descending
  // 4. Rating descending
  // 5. Title alphabetical
  return eligible.sort((a, b) => {
    if (a.suitabilityStatus === "verified" && b.suitabilityStatus !== "verified") return -1;
    if (b.suitabilityStatus === "verified" && a.suitabilityStatus !== "verified") return 1;

    if (b.deterministicScore !== a.deterministicScore) {
      return b.deterministicScore - a.deterministicScore;
    }

    const countA = a.candidate.ratingCount || 0;
    const countB = b.candidate.ratingCount || 0;
    if (countB !== countA) return countB - countA;

    const ratingA = a.candidate.rating || 0;
    const ratingB = b.candidate.rating || 0;
    if (ratingB !== ratingA) return ratingB - ratingA;

    return a.candidate.title.localeCompare(b.candidate.title);
  });
}

export function toRecommendedGame(
  evalResult: EvaluatedCandidate,
  overrideReason?: string,
  extraCaveats?: string[]
): RecommendedGame {
  const { candidate, suitabilityStatus, suitabilityExplanation, deterministicScore, caveats } = evalResult;

  const combinedCaveats = Array.from(new Set([...caveats, ...(extraCaveats || [])]));

  return {
    gameId: candidate.id,
    title: candidate.title,
    description: candidate.description,
    reason:
      overrideReason ||
      `Top deterministic match: Scored ${deterministicScore}/100 based on verified age suitability, category alignment, and strong community reviews.`,
    caveats: combinedCaveats,
    rating: candidate.rating,
    ratingCount: candidate.ratingCount,
    contentRating: candidate.contentRating,
    minimumAge: candidate.minimumAge,
    suitabilityStatus,
    suitabilityExplanation,
    storeUrl: candidate.storeUrl,
    storePlatform: candidate.storePlatform || "both",
    appleAppStoreUrl: candidate.appleAppStoreUrl || candidate.storeUrl,
    googlePlayUrl:
      candidate.googlePlayUrl ||
      `https://play.google.com/store/search?q=${encodeURIComponent(candidate.title)}&c=apps`,
    iconUrl: candidate.iconUrl,
    category: candidate.category,
    containsAds: candidate.containsAds,
    hasInAppPurchases: candidate.hasInAppPurchases,
    isDemoData: Boolean(candidate.isDemoData),
    metadataSource: candidate.metadataSource,
    score: deterministicScore,
  };
}
