import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { searchStoreGames } from "../lib/game-provider";
import { rankCandidates, toRecommendedGame } from "../lib/ranking";
import { detectLocation } from "../lib/geolocation";
import { getAiRecommendation } from "../lib/ai-recommendation";

// Load .env.local if present
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

async function runLiveFlowTests() {
  console.log("=== RUNNING LIVE FLOW & INTEGRATION TESTS ===\n");

  // 1. Geolocation test
  console.log("1. Testing Geolocation detection...");
  const geo = await detectLocation();
  console.log(`Detected country: ${geo.countryName} (${geo.countryCode}), source: ${geo.source}`);
  assert.ok(geo.countryCode.length === 2, "Should return a 2-letter ISO country code");
  assert.ok(geo.countryName.length > 0, "Should return a country name");
  console.log("✓ Geolocation test passed!\n");

  // 2. Real Store Provider Search
  console.log("2. Testing Store Provider Search (Educational in US)...");
  const candidatesUS = await searchStoreGames("educational", "US");
  console.log(`Retrieved ${candidatesUS.length} candidates from provider (Source: ${candidatesUS[0]?.metadataSource})`);
  assert.ok(candidatesUS.length > 0, "Should return candidates");
  assert.ok(candidatesUS[0].storeUrl.startsWith("http"), "Store URL must be a valid link");
  console.log(`Sample game: "${candidatesUS[0].title}", Rating: ${candidatesUS[0].rating}, ContentRating: ${candidatesUS[0].contentRating}`);
  console.log("✓ Store Provider search passed!\n");

  // 3. Country-specific search test (India: IN)
  console.log("3. Testing Store Provider Search (Puzzle in IN)...");
  const candidatesIN = await searchStoreGames("puzzle", "IN");
  console.log(`Retrieved ${candidatesIN.length} candidates for India`);
  assert.ok(candidatesIN.length > 0, "Should return candidates for IN");
  console.log("✓ Country-specific search passed!\n");

  // 4. Age suitability filtering and ranking
  console.log("4. Testing Ranking for an 8-year-old in Educational category...");
  const ranked8yo = rankCandidates(candidatesUS, 8, "educational");
  console.log(`Eligible candidates after hard filters: ${ranked8yo.length}`);
  assert.ok(ranked8yo.length > 0, "Must have eligible candidates");
  
  // Verify that no eligible candidate exceeds age 8
  for (const r of ranked8yo) {
    if (r.candidate.minimumAge !== undefined) {
      assert.ok(
        r.candidate.minimumAge <= 8,
        `Candidate ${r.candidate.title} has minimumAge ${r.candidate.minimumAge} which exceeds target age 8!`
      );
    }
  }
  const topPick = toRecommendedGame(ranked8yo[0]);
  console.log(`Top deterministic pick: "${topPick.title}"`);
  console.log(`Suitability Status: ${topPick.suitabilityStatus}`);
  console.log(`Score: ${topPick.score}/100`);
  console.log("✓ Age suitability filtering and ranking passed!\n");

  // 5. Test OpenRouter Live AI Recommendation
  console.log("5. Testing OpenRouter Live AI Recommendation...");
  const aiResult = await getAiRecommendation(ranked8yo, 8, "educational", "United States");
  if (aiResult) {
    console.log(`✓ OpenRouter returned recommendation: Game ID "${aiResult.selectedGameId}"`);
    console.log(`Reason: ${aiResult.reason}`);
    console.log(`Caveats: ${JSON.stringify(aiResult.caveats)}`);
    const validIds = new Set(ranked8yo.map((c) => c.candidate.id));
    assert.ok(validIds.has(aiResult.selectedGameId), "AI selected gameId must belong to eligible candidates!");
  } else {
    console.log("AI returned null (deterministic fallback active).");
  }
  console.log("✓ AI recommendation & validation passed!\n");

  // 6. Test deterministic fallback when key is removed
  console.log("6. Testing AI Graceful Fallback when API key is unset...");
  const savedKey = process.env.OPENROUTER_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  const fallbackResult = await getAiRecommendation(ranked8yo, 8, "educational", "United States");
  assert.strictEqual(fallbackResult, null, "Should return null when key is absent");
  process.env.OPENROUTER_API_KEY = savedKey;
  console.log("✓ Graceful deterministic fallback passed!\n");

  console.log("=== ALL LIVE INTEGRATION TESTS PASSED SUCCESSFULLY! ===");
}

runLiveFlowTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
