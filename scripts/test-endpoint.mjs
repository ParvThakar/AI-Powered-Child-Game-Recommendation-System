async function testRecommendationsEndpoint() {
  console.log("Testing POST http://localhost:3000/api/recommendations (Ages 1-30, up to 20 games)...");
  const t0 = Date.now();
  const res = await fetch("http://localhost:3000/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      age: 15,
      category: "adventure",
      countryCode: "US",
      platform: "all",
      limit: 20,
    }),
  });

  const duration = Date.now() - t0;
  console.log(`HTTP ${res.status} in ${duration}ms`);
  const data = await res.json();
  console.log("Response Summary:");
  console.log("- Status:", res.status);
  console.log("- Country:", data.countryName, `(${data.countryCode})`);
  console.log("- Category:", data.category);
  console.log("- Age:", data.age);
  console.log("- Total Recommended:", data.totalRecommended);
  console.log("- #1 Pick:", data.recommendation?.title);
  console.log("- #1 Apple App Store URL:", data.recommendation?.appleAppStoreUrl);
  console.log("- #1 Google Play Store URL:", data.recommendation?.googlePlayUrl);
  console.log("- Alternatives Count:", data.alternatives?.length);
  console.log("- Sample Alternative #2:", data.alternatives?.[0]?.title);
  console.log("- Sample Alternative #20:", data.alternatives?.[data.alternatives.length - 1]?.title);
}

testRecommendationsEndpoint().then(() => process.exit(0)).catch((e) => {
  console.error("Endpoint test error:", e);
  process.exit(1);
});
