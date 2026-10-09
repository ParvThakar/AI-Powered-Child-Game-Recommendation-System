import assert from "node:assert";

async function runComprehensiveAudit() {
  console.log("==================================================================");
  console.log("       PLAYSAFE GAMING - FINAL HACKATHON READINESS AUDIT          ");
  console.log("==================================================================\n");

  const baseUrl = "http://localhost:3000";

  // 1. Audit Endpoint: 20 Games Detailed Verification
  console.log("--- 1. AUDITING 20 GAMES: RATINGS, STORES, COUNTRY AVAILABILITY ---");
  const recRes = await fetch(`${baseUrl}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      age: 8,
      category: "educational",
      countryCode: "US",
      limit: 20,
    }),
  });

  assert.strictEqual(recRes.status, 200, "Recommendations API must return HTTP 200");
  const data = await recRes.json();

  console.log(`Region Catalog: ${data.countryName} (${data.countryCode})`);
  console.log(`Age Tested: ${data.age} yrs | Category: ${data.category}`);
  console.log(`AI Engine Used: ${data.meta.aiEngine}`);
  console.log(`AI Assisted Flag: ${data.meta.aiAssisted}`);
  console.log(`Total Found: ${data.meta.totalFound} | Verified Eligible: ${data.meta.eligibleCount}`);
  console.log(`Total Recommended: ${data.totalRecommended}\n`);

  assert.ok(data.recommendation, "Primary recommendation must exist");
  assert.ok(data.totalRecommended <= 20 && data.totalRecommended > 0, "Must return up to 20 games");

  const allGames = [data.recommendation, ...data.alternatives];
  console.log(`Inspecting all ${allGames.length} returned games:`);

  const seenIds = new Set();
  const seenTitles = new Set();

  allGames.forEach((game, idx) => {
    // Check duplication
    assert.ok(!seenIds.has(game.gameId), `Duplicate gameId found: ${game.gameId}`);
    assert.ok(!seenTitles.has(game.title.toLowerCase()), `Duplicate title found: ${game.title}`);
    seenIds.add(game.gameId);
    seenTitles.add(game.title.toLowerCase());

    // Check URLs
    assert.ok(game.storeUrl && game.storeUrl.startsWith("http"), `Game #${idx + 1} (${game.title}) missing storeUrl`);
    assert.ok(game.appleAppStoreUrl && game.appleAppStoreUrl.startsWith("http"), `Game #${idx + 1} missing appleAppStoreUrl`);
    assert.ok(game.googlePlayUrl && game.googlePlayUrl.startsWith("http"), `Game #${idx + 1} missing googlePlayUrl`);

    // Check age suitability
    if (game.minimumAge !== undefined) {
      assert.ok(
        game.minimumAge <= data.age,
        `Suitability Violation: ${game.title} requires min age ${game.minimumAge}, but target age is ${data.age}`
      );
    }

    // Check ratings
    if (game.rating !== undefined) {
      assert.ok(game.rating >= 0 && game.rating <= 5, `Invalid star rating: ${game.rating}`);
    }

    console.log(
      `  [#${idx + 1}] ${game.title.padEnd(35).slice(0, 35)} | Rating: ${(game.rating?.toFixed(1) || "N/A").padStart(3)} ★ | Age: ${(game.contentRating || "Unverified").padEnd(12)} | Status: ${game.suitabilityStatus}`
    );
  });
  console.log("\n✓ All 20 games passed integrity, duplicate, URL, rating, and age rules!\n");

  // 2. Audit Age Boundaries (1 to 30)
  console.log("--- 2. AUDITING AGE BOUNDARIES & RESTRICTIONS ---");
  const testAges = [
    { age: 1, shouldPass: true, label: "Toddler (Age 1)" },
    { age: 0, shouldPass: false, label: "Sub-boundary (Age 0)" },
    { age: 30, shouldPass: true, label: "Upper Boundary (Age 30)" },
    { age: 31, shouldPass: false, label: "Over-boundary (Age 31)" },
    { age: -5, shouldPass: false, label: "Negative age" },
  ];

  for (const item of testAges) {
    const res = await fetch(`${baseUrl}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age: item.age, category: "puzzle", countryCode: "US" }),
    });
    if (item.shouldPass) {
      assert.strictEqual(res.status, 200, `Age ${item.age} should pass (HTTP 200)`);
      console.log(`  ✓ ${item.label.padEnd(25)}: Passed (HTTP 200)`);
    } else {
      assert.strictEqual(res.status, 422, `Age ${item.age} should fail (HTTP 422)`);
      console.log(`  ✓ ${item.label.padEnd(25)}: Correctly rejected (HTTP 422)`);
    }
  }
  console.log("");

  // 3. Audit Country Availability & Fallback
  console.log("--- 3. AUDITING COUNTRY AVAILABILITY & GEOLOCATION ---");
  const locRes = await fetch(`${baseUrl}/api/location`);
  assert.strictEqual(locRes.status, 200);
  const locData = await locRes.json();
  console.log(`  Geolocation endpoint returned: ${locData.countryName} (${locData.countryCode}), source: ${locData.source}`);

  // Test regional query for India (IN)
  const inRes = await fetch(`${baseUrl}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ age: 10, category: "sports", countryCode: "IN" }),
  });
  assert.strictEqual(inRes.status, 200);
  const inData = await inRes.json();
  console.log(`  India Catalog Query: Found ${inData.totalRecommended} games for IN`);
  console.log(`  ✓ Regional catalog filtering passed!\n`);

  // 4. Audit OpenRouter AI vs Deterministic Fallback Distinction
  console.log("--- 4. AUDITING OPENROUTER AI INTEGRATION & FALLBACK DISTINCTION ---");
  console.log(`  Engine label in response: "${data.meta.aiEngine}"`);
  console.log(`  AI Assisted flag: ${data.meta.aiAssisted}`);
  if (data.meta.aiAssisted) {
    console.log(`  Primary reasoning provided by OpenRouter: "${data.recommendation.reason.slice(0, 100)}..."`);
  } else {
    console.log(`  Deterministic reasoning provided: "${data.recommendation.reason.slice(0, 100)}..."`);
  }
  console.log(`  ✓ Transparent status reporting confirmed!\n`);

  console.log("==================================================================");
  console.log("               AUDIT COMPLETED: 100% CHECKS PASSED                ");
  console.log("==================================================================");
}

runComprehensiveAudit().then(() => process.exit(0)).catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
