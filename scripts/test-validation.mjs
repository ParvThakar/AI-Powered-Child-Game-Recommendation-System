import assert from "node:assert";

async function runValidationTests() {
  console.log("=== VERIFYING API EDGE CASES & VALIDATION ON LIVE DEV SERVER ===\n");

  // Case 1: Invalid age (too old)
  const res1 = await fetch("http://localhost:3000/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ age: 35, category: "educational", countryCode: "US" }),
  });
  console.log("Case 1 (Age 35): HTTP", res1.status);
  assert.strictEqual(res1.status, 422, "Should return 422 for age > 30");
  const data1 = await res1.json();
  console.log("Details:", data1.details?.age?.[0]);

  // Case 2: Invalid category ("gambling")
  const res2 = await fetch("http://localhost:3000/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ age: 8, category: "gambling", countryCode: "US" }),
  });
  console.log("\nCase 2 (Category 'gambling'): HTTP", res2.status);
  assert.strictEqual(res2.status, 422, "Should return 422 for unsupported category");

  // Case 3: Invalid JSON body
  const res3 = await fetch("http://localhost:3000/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "Not a valid JSON",
  });
  console.log("\nCase 3 (Malformed body): HTTP", res3.status);
  assert.strictEqual(res3.status, 400, "Should return 400 for malformed JSON");

  // Case 4: Location endpoint
  const res4 = await fetch("http://localhost:3000/api/location");
  console.log("\nCase 4 (Location endpoint): HTTP", res4.status);
  assert.strictEqual(res4.status, 200);
  const data4 = await res4.json();
  console.log("Location:", `${data4.countryName} (${data4.countryCode})`);

  console.log("\n✓ ALL EDGE CASE & ERROR HANDLING TESTS PASSED!");
}

runValidationTests().then(() => process.exit(0)).catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
