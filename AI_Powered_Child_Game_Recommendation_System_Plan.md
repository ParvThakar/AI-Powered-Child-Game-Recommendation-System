# AI-Powered Child Game Recommendation System
## Fastest Hackathon MVP — Implementation Plan

## Decision: Build One Next.js App

Optimize for a working end-to-end demo, not a large architecture. Use one repository and one deployment. Do not build a separate Express server, database, authentication, or admin dashboard for the MVP.

### Locked-in stack

- **Framework:** Next.js (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Game data:** A Google Play search provider with country support (prefer a provider/API your team can access immediately)
- **Country detection:** `ipapi.co` from a server route, with a manual country selector and fallback
- **AI:** OpenAI API called only from the server
- **Validation:** Zod
- **Deployment:** Vercel
- **Persistence:** None for MVP; no database needed

**Important:** Verify access, cost, terms, rate limits, and fields for the chosen game-data provider before coding against it. Google Play does not offer a simple unrestricted public API for arbitrary game search. Do not build an unapproved scraper. If API access is unavailable during the event, use a small, verified dataset and clearly label results as **Demo data** rather than pretending they are live.

## 1. Product Goal

Help parents find a game that matches a child's age, selected category, and country. The app detects a likely country from the user's IP, searches available game listings, applies explicit age/content checks, ranks the eligible results, and uses AI to explain the strongest recommendation.

The system must not claim a game is safe based on star ratings alone. Missing age/content information must be shown as **Not verified**.

## 2. User Journey

1. Parent enters the child's age.
2. Parent chooses a category: Educational, Puzzle, Creativity, Adventure, or Sports.
3. App detects the likely country and lets the parent change it.
4. Backend searches the selected game provider by country and category.
5. Backend normalizes, deduplicates, and filters candidate games.
6. Backend ranks candidates using category match, age/content suitability, ratings, rating count, and metadata completeness.
7. OpenAI receives only the eligible candidate list and returns a structured recommendation with an explanation and caveats.
8. Backend validates the AI response and ensures it refers to a real candidate.
9. UI shows the recommended game, reason, rating, available content/age information, country, and official store link.

## 3. Architecture

```text
Next.js page
  |
  | POST /api/recommendations
  v
Next.js Route Handler
  |-- Validate age/category/country with Zod
  |-- Detect country if not supplied
  |-- Search GameProvider for country + category
  |-- Normalize and deduplicate results
  |-- Apply age/content hard filters
  |-- Rank eligible candidates
  |-- Ask OpenAI to explain/select from candidate IDs
  |-- Validate AI output; deterministic fallback if needed
  v
Recommendation UI
```

All API keys and provider calls stay on the server. Never expose secrets in browser code or commit `.env.local`.

## 4. Data Model

Normalize every provider result into a consistent shape:

```ts
type GameCandidate = {
  id: string;
  title: string;
  description?: string;
  storeUrl: string;
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
};
```

Only populate fields supported by the data source. Keep missing values unknown; never invent a minimum age, content rating, rating count, or availability claim.

## 5. Recommendation Rules

### Hard filters first

- Keep candidates available in the selected country only when the provider can verify availability.
- Require a reasonable match to the selected category.
- Apply the team's defined age/content policy to provider-supplied content ratings.
- Exclude games that violate the policy.
- Treat missing age/content information as **Not verified**. For the safest MVP, do not make an unverified candidate the primary recommendation.

Rating is not a child-safety signal. Different rating systems are not automatically equivalent, so do not compare their labels without an explicit mapping.

### Rank the eligible candidates

Start with a simple deterministic score:

- 35% age/content suitability confidence
- 25% category match
- 20% normalized user rating
- 10% rating-count confidence
- 10% metadata completeness/freshness

These are initial product weights, not scientifically validated measures. Avoid letting a 5.0 rating from only a handful of reviews automatically beat a well-reviewed option.

### Use AI for selection and explanation

Send the model:
- child's age, chosen category, and country
- the explicit eligibility rules
- a small list of eligible candidates and their actual metadata

Require JSON containing `gameId`, `reason`, and `caveats`. The model may select only a provided candidate ID. Validate the result server-side. If the model times out, returns invalid JSON, chooses an unknown ID, or makes unsupported claims, fall back to the highest deterministic score.

## 6. Routes to Implement

### `GET /api/location`

Detect the likely country from the request IP using the chosen geolocation service. Return a country code and name. Support local-development failures, VPNs, proxies, and API outages. Always let the user manually choose a country.

Example response:

```json
{
  "countryCode": "IN",
  "countryName": "India",
  "source": "ip",
  "needsConfirmation": true
}
```

### `GET /api/categories`

Return the fixed list of supported categories.

### `POST /api/recommendations`

Request:

```json
{
  "age": 8,
  "category": "educational",
  "countryCode": "IN"
}
```

Response shape:

```json
{
  "countryCode": "IN",
  "category": "educational",
  "recommendation": {
    "gameId": "provider-game-id",
    "title": "Example Game",
    "reason": "Matches the category and passes the configured checks.",
    "rating": 4.6,
    "ratingCount": 12000,
    "contentRating": "Provider value",
    "suitabilityStatus": "verified",
    "storeUrl": "https://example.com/store-listing"
  },
  "alternatives": [],
  "disclaimer": "Check the current store listing and play together before deciding."
}
```

These JSON snippets illustrate the schema only; they are not live game data. Omit unavailable optional fields rather than fabricating them. Use clear errors for invalid inputs, rate limits, and unavailable providers.

## 7. Suggested File Structure

```text
child-game-recommender/
├── app/
│   ├── page.tsx
│   ├── api/
│   │   ├── location/route.ts
│   │   └── recommendations/route.ts
│   └── globals.css
├── components/
│   ├── recommendation-form.tsx
│   ├── game-card.tsx
│   ├── safety-status.tsx
│   └── loading-state.tsx
├── lib/
│   ├── schemas.ts
│   ├── geolocation.ts
│   ├── game-provider.ts
│   ├── ranking.ts
│   └── ai-recommendation.ts
├── data/
│   └── demo-games.ts
├── .env.example
└── README.md
```

Keep it smaller if time is very limited; do not create files or abstractions that are not needed yet.

## 8. Build in This Exact Order

### Phase 1 — Confirm APIs before coding

- [ ] Choose a game provider and confirm it can search by category/country and return store URLs, ratings, rating counts, and content ratings.
- [ ] Confirm you can access an OpenAI API key and the geolocation service.
- [ ] Define the supported categories and the age/content policy.
- [ ] Prepare a few verified fallback examples, with their source URLs.

**Done when:** You have working sample responses or a clearly labelled demo dataset. Do not lose hackathon time to an API that you cannot access.

### Phase 2 — Create the Next.js app

- [ ] Scaffold Next.js with TypeScript and Tailwind.
- [ ] Add shadcn/ui components only as needed.
- [ ] Add Zod schemas for all request inputs.
- [ ] Add `.env.example` and ignore `.env.local`.
- [ ] Add `GET /api/health` if useful for quick deployment checks.

**Done when:** The page loads and can call a route handler.

### Phase 3 — Build the whole UI with demo data

- [ ] Age input with required/range validation.
- [ ] Category selector.
- [ ] Detected country display and manual override.
- [ ] Find Games button, loading state, empty state, and error state.
- [ ] Recommendation card with icon, title, rating, review count, content/age status, explanation, and store link when those fields exist.
- [ ] Mobile-responsive layout.

**Done when:** You can submit inputs and see a realistic but explicitly labelled demo result.

### Phase 4 — Add game data and filtering

- [ ] Implement one `GameProvider` function.
- [ ] Normalize and deduplicate its results.
- [ ] Apply country/category/age-content rules.
- [ ] Implement deterministic scoring and stable tie-breaking.
- [ ] Handle empty results, missing metadata, and provider failures.

**Done when:** The app can show traceable candidates from the provider or transparently switch to demo data.

### Phase 5 — Add IP country detection

- [ ] Call the geolocation provider from the server.
- [ ] Show the detected country as a suggestion, not an unquestionable fact.
- [ ] Let the user override it.
- [ ] Continue working if geolocation fails.

**Done when:** Country detection improves convenience but never blocks the main flow.

### Phase 6 — Add AI

- [ ] Send only eligible, ranked candidates to OpenAI.
- [ ] Request structured JSON with a candidate ID, reason, and caveats.
- [ ] Validate that the returned ID exists in the filtered list.
- [ ] Reject unsupported claims and use deterministic fallback on failure.
- [ ] Keep the API key server-side.

**Done when:** AI produces a grounded explanation and the app still works if AI is unavailable.

### Phase 7 — Test and deploy

- [ ] Reject invalid ages, categories, and country codes.
- [ ] Test geolocation failure and manual override.
- [ ] Test no results, missing content ratings, provider timeout, and rate limits.
- [ ] Test AI timeout, malformed JSON, and unknown game IDs.
- [ ] Check all store links and factual fields.
- [ ] Deploy to Vercel and configure production environment variables.
- [ ] Test the live deployment from a fresh browser session.

## 9. Hackathon Priority

**Must-have:** one complete input-to-recommendation flow, age/content filters, traceable game information, and a polished recommendation card.

**Next:** country detection, AI explanation, alternative recommendations, robust error states.

**Skip until the MVP works:** authentication, database, saved history, admin dashboard, elaborate animations, and analytics.

If API credentials or access become a blocker, finish the full flow using a small verified dataset marked **Demo data**, then integrate live search only if time permits. Never present fixture data as live results.

## 10. Test Checklist

- [ ] Age and category are required and validated.
- [ ] Country can be changed manually.
- [ ] IP detection failure does not block recommendations.
- [ ] A high star rating cannot bypass the age/content rules.
- [ ] Missing age/content data is shown as unverified.
- [ ] AI cannot return a game ID outside the eligible candidate list.
- [ ] AI failure triggers deterministic fallback.
- [ ] Empty search results have a helpful message.
- [ ] Displayed ratings, content ratings, availability, and store links are traceable to a source.
- [ ] API keys are absent from client bundles and source control.

## 11. Privacy and Child Safety

- Ask only for the child's age, not their name or birth date.
- Avoid storing searches for the MVP.
- Use IP geolocation only to estimate the country and avoid retaining raw IP addresses unnecessarily.
- Tell parents that store information may be incomplete or outdated.
- Encourage parents to check content ratings, ads, in-app purchases, chat/social features, and privacy information.
- Say **“appears suitable based on available listing information,”** not “guaranteed safe.”

## 12. Short Judge Demo

1. Enter age **8**, choose **Educational**, and confirm the country.
2. Click **Find games**.
3. Explain that the backend retrieves candidates and applies age/content checks before AI runs.
4. Show the recommendation, rating and review count, suitability status, explanation, and official listing.
5. Demonstrate that missing safety data is marked clearly and that AI failure has a fallback.

Use verified live data if available. If the demo uses fixtures, show the **Demo data** label.

## Definition of Done

The project is ready to present when a parent can enter age, category, and country; receive a recommendation from traceable game data or explicitly labelled demo data; see why it was chosen and what safety information is missing; and use the app successfully even when geolocation or AI fails.

**Core rule:** Apply child-suitability checks before AI selection. AI explains and ranks; it does not invent facts or override safety filters.
