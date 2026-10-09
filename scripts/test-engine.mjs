import assert from "node:assert";
import {
  evaluateSuitability,
  rankCandidates,
} from "../lib/ranking.ts";
import { RecommendationRequestSchema } from "../lib/schemas.ts";

console.log("=== RUNNING SUITABILITY & RANKING VERIFICATION TESTS ===\n");

// Test 1: Schema validation
console.log("Test 1: Schema Validation Rules...");
const validReq = RecommendationRequestSchema.safeParse({
  age: 8,
  category: "educational",
  countryCode: "US",
});
assert.strictEqual(validReq.success, true, "Valid request should pass");

const validAge1 = RecommendationRequestSchema.safeParse({
  age: 1,
  category: "educational",
  countryCode: "US",
});
assert.strictEqual(validAge1.success, true, "Age 1 (toddler) should pass validation");

const invalidAgeLow = RecommendationRequestSchema.safeParse({
  age: 0,
  category: "educational",
  countryCode: "US",
});
assert.strictEqual(invalidAgeLow.success, false, "Age < 1 must fail validation");

const validAge30 = RecommendationRequestSchema.safeParse({
  age: 30,
  category: "strategy",
  countryCode: "US",
});
assert.strictEqual(validAge30.success, true, "Age 30 should pass validation");

const invalidAgeHigh = RecommendationRequestSchema.safeParse({
  age: 31,
  category: "educational",
  countryCode: "US",
});
assert.strictEqual(invalidAgeHigh.success, false, "Age > 30 must fail validation");

const invalidCat = RecommendationRequestSchema.safeParse({
  age: 8,
  category: "gambling",
  countryCode: "US",
});
assert.strictEqual(invalidCat.success, false, "Unsupported category must fail validation");

const invalidCountry = RecommendationRequestSchema.safeParse({
  age: 8,
  category: "educational",
  countryCode: "USA",
});
assert.strictEqual(invalidCountry.success, false, "Non-2-letter country code must fail");
console.log("✓ Schema validation tests passed!\n");

// Test 2: Star rating CANNOT bypass age suitability rule
console.log("Test 2: Star rating CANNOT bypass age suitability rule...");
const violentGameWith5Stars = {
  id: "test-mature-shooter",
  title: "Hyper Shooter 5000",
  description: "Tactical multiplayer shooter for teens",
  storeUrl: "https://example.com/shooter",
  rating: 5.0,
  ratingCount: 1000000,
  contentRating: "12+",
  minimumAge: 12,
  availableInCountry: true,
  metadataSource: "Test Provider",
};

// Evaluate for 7 year old child
const evalFor7yo = evaluateSuitability(violentGameWith5Stars, 7, "sports");
assert.strictEqual(
  evalFor7yo.isEligible,
  false,
  "Game rated 12+ must NEVER be eligible for a 7-year-old child, regardless of 5.0 star rating"
);
assert.strictEqual(evalFor7yo.suitabilityStatus, "restricted");
console.log("✓ Safety rule passed: 5.0 rating 12+ game successfully blocked for 7-year-old!\n");

// Test 3: Unverified metadata handling
console.log("Test 3: Missing age/content rating is marked unverified and cannot beat verified candidate...");
const unverifiedGame = {
  id: "test-unverified",
  title: "Indie Math Puzzle",
  description: "A fun puzzle game",
  storeUrl: "https://example.com/unverified",
  rating: 4.9,
  ratingCount: 500,
  contentRating: undefined,
  minimumAge: undefined,
  availableInCountry: true,
  metadataSource: "Test Provider",
};

const verifiedGame = {
  id: "test-verified",
  title: "Certified Toddler Math",
  description: "Official early learning certified program",
  storeUrl: "https://example.com/verified",
  rating: 4.7,
  ratingCount: 15000,
  contentRating: "4+",
  minimumAge: 4,
  availableInCountry: true,
  metadataSource: "Test Provider",
};

const ranked = rankCandidates([unverifiedGame, verifiedGame], 6, "educational");
assert.strictEqual(ranked[0].candidate.id, "test-verified", "Verified game must rank above unverified candidate");
assert.strictEqual(ranked[1].suitabilityStatus, "unverified", "Unverified candidate must be flagged unverified");
console.log("✓ Unverified handling passed: Certified game ranked first, missing rating marked unverified!\n");

// Test 4: Rating count dampening (preventing 5.0 with 2 reviews beating 4.7 with 50,000 reviews)
console.log("Test 4: Rating count dampening...");
const twoReviewFiveStarGame = {
  id: "fake-5-star",
  title: "New Kid Game",
  description: "Great game",
  storeUrl: "https://example.com/fake",
  rating: 5.0,
  ratingCount: 2,
  contentRating: "4+",
  minimumAge: 4,
  availableInCountry: true,
  metadataSource: "Test Provider",
};

const wellReviewedGame = {
  id: "real-4-7-star",
  title: "Beloved Kid Academy",
  description: "Thoroughly tested and trusted by parents worldwide",
  storeUrl: "https://example.com/real",
  rating: 4.7,
  ratingCount: 80000,
  contentRating: "4+",
  minimumAge: 4,
  availableInCountry: true,
  metadataSource: "Test Provider",
};

const rankedReviews = rankCandidates([twoReviewFiveStarGame, wellReviewedGame], 6, "educational");
assert.strictEqual(
  rankedReviews[0].candidate.id,
  "real-4-7-star",
  "Well-reviewed game with 80k reviews must beat 2-review 5.0 game"
);
console.log("✓ Rating count dampening passed: Well-reviewed game correctly outranked low-volume 5.0 game!\n");

console.log("ALL TEST CASES PASSED SUCCESSFULLY!");
