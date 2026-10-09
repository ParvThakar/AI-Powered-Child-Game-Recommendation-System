import { z } from "zod";

export const SUPPORTED_CATEGORIES = [
  "educational",
  "puzzle",
  "creativity",
  "adventure",
  "sports",
  "action",
  "strategy",
] as const;

export type SupportedCategory = (typeof SUPPORTED_CATEGORIES)[number];

export const CATEGORY_DETAILS: {
  id: SupportedCategory;
  name: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "educational",
    name: "Educational",
    description: "Learning, reading, math, science & vocabulary",
    icon: "GraduationCap",
  },
  {
    id: "puzzle",
    name: "Puzzle",
    description: "Brain teasers, logic, pattern matching & problem solving",
    icon: "Puzzle",
  },
  {
    id: "creativity",
    name: "Creativity",
    description: "Art, drawing, music creation & imaginative building",
    icon: "Palette",
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Rich exploration, narrative quests & discovery worlds",
    icon: "Compass",
  },
  {
    id: "sports",
    name: "Sports",
    description: "Athletics, competitive matches, racing & coordination",
    icon: "Trophy",
  },
  {
    id: "action",
    name: "Action",
    description: "Fast-paced platformers, reflex tests & arcade gaming",
    icon: "Flame",
  },
  {
    id: "strategy",
    name: "Strategy",
    description: "Tactical planning, resource management & puzzle chess",
    icon: "Boxes",
  },
];

export const STORE_PLATFORMS = ["all", "apple", "google"] as const;
export type StorePlatform = (typeof STORE_PLATFORMS)[number];

// Input schema for recommendation request
export const RecommendationRequestSchema = z.object({
  age: z
    .number()
    .int("Age must be an integer")
    .min(1, "Age must be at least 1")
    .max(30, "Age must be 30 or under"),
  category: z
    .string()
    .toLowerCase()
    .refine(
      (val): val is SupportedCategory =>
        SUPPORTED_CATEGORIES.includes(val as SupportedCategory),
      {
        message: `Category must be one of: ${SUPPORTED_CATEGORIES.join(", ")}`,
      }
    ),
  countryCode: z
    .string()
    .length(2, "Country code must be a 2-letter ISO code")
    .toUpperCase()
    .default("US"),
  platform: z
    .enum(STORE_PLATFORMS)
    .default("all")
    .optional(),
  limit: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(20)
    .optional(),
});

export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;

// Internal normalized game candidate structure
export interface GameCandidate {
  id: string;
  title: string;
  description?: string;
  storeUrl: string;
  storePlatform?: "apple" | "google" | "both";
  appleAppStoreUrl?: string;
  googlePlayUrl?: string;
  iconUrl?: string;
  category?: string;
  rating?: number;
  ratingCount?: number;
  contentRating?: string;
  minimumAge?: number;
  availableInCountry?: boolean;
  containsAds?: boolean;
  hasInAppPurchases?: boolean;
  lastUpdated?: string;
  metadataSource: string;
  isDemoData?: boolean;
}

// Recommended game presentation item
export interface RecommendedGame {
  gameId: string;
  title: string;
  description?: string;
  reason: string;
  caveats: string[];
  rating?: number;
  ratingCount?: number;
  contentRating?: string;
  minimumAge?: number;
  suitabilityStatus: "verified" | "unverified" | "restricted";
  suitabilityExplanation?: string;
  storeUrl: string;
  storePlatform: "apple" | "google" | "both";
  appleAppStoreUrl?: string;
  googlePlayUrl?: string;
  iconUrl?: string;
  category?: string;
  containsAds?: boolean;
  hasInAppPurchases?: boolean;
  isDemoData: boolean;
  metadataSource: string;
  score?: number;
}

// Full response for POST /api/recommendations
export interface RecommendationResponse {
  countryCode: string;
  countryName: string;
  category: SupportedCategory;
  age: number;
  platform: StorePlatform;
  recommendation: RecommendedGame | null;
  alternatives: RecommendedGame[];
  totalRecommended: number;
  disclaimer: string;
  meta: {
    totalFound: number;
    eligibleCount: number;
    dataSource: string;
    aiAssisted: boolean;
    aiEngine?: string;
    timestamp: string;
  };
}

// Location response schema
export interface LocationResponse {
  countryCode: string;
  countryName: string;
  source: "ip" | "header" | "fallback";
  needsConfirmation: boolean;
}

// OpenAI / OpenRouter structured output schema
export const AiRecommendationOutputSchema = z.object({
  gameId: z.string().min(1, "gameId is required"),
  reason: z.string().min(10, "A clear explanation is required"),
  caveats: z.array(z.string()).default([]),
});

export type AiRecommendationOutput = z.infer<typeof AiRecommendationOutputSchema>;
