# AI-Powered Child Game Recommendation System (PlaySafe AI)

A safety-first child game recommendation engine built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **OpenAI**. 

Built strictly following the architecture specified in [`AI_Powered_Child_Game_Recommendation_System_Plan.md`](./AI_Powered_Child_Game_Recommendation_System_Plan.md).

---

## 🌟 Key Features & Safety Guarantees

1. **Child-Suitability Checks Before AI**:
   - Explicit hard filters check official store age ratings (`4+`, `9+`, `12+`, `ESRB Everyone`, `Pegi 3/7`, etc.) before any game is considered eligible.
   - High star ratings (e.g. 5.0) **cannot** bypass age suitability checks.
   - Games with missing age/content ratings are transparently marked **"Not verified"** and cannot outrank verified games.
   - Games with mature ratings (`17+`, `18+`, `Mature`) are permanently blocked.

2. **IP-Based Regional Country Detection with Manual Override**:
   - Detects the parent's country catalog via IP (`ipapi.co`) and edge geo headers (`x-vercel-ip-country`).
   - Treated strictly as a suggestion with full manual country override support.
   - Geolocation failure or network outage **never blocks** the user flow.

3. **Grounded AI Recommendations & Robust Fallback**:
   - OpenAI (`gpt-4o-mini`) is restricted via structured JSON output to choose **only** from verified candidate IDs.
   - Server validates the model output against the candidate ID set to prevent hallucinations.
   - If OpenAI times out, returns malformed JSON, or lacks an API key, the system automatically uses **deterministic ranking** with 100% uptime.

4. **Privacy-Preserving**:
   - Asks only for the child's age (never collects names, birthdays, or personal identifiers).
   - Searches are stateless and not persisted to a database.
   - IP addresses are used solely for real-time country detection and are not retained.

5. **Traceable Store Data**:
   - Returns official store links (Apple App Store / Google Play).
   - Explicitly flags when curated verified demo data is used via the **"Demo data"** pill.

---

## 🏗️ Architecture & Technology Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Data Validation**: Zod
- **Game Search Provider**: Official Apple App Store Search API with country filter + Verified Curated Fallback
- **AI Engine**: OpenAI Node SDK (`gpt-4o-mini`) with schema-enforced JSON completion
- **Deployment**: Vercel

```text
Next.js UI (app/page.tsx)
   │
   │ POST /api/recommendations { age, category, countryCode }
   ▼
Route Handler (app/api/recommendations/route.ts)
   ├── 1. Zod input validation (age 2–17, category, 2-letter ISO)
   ├── 2. Regional Store Search (lib/game-provider.ts)
   ├── 3. Deduplication & Content Filtering (lib/ranking.ts)
   │      - Enforce age suitability (block >=17+ and >childAge)
   │      - Flag unverified listings
   ├── 4. Deterministic Ranking (35% age, 25% category, 20% rating, 10% volume, 10% freshness)
   ├── 5. Server-side OpenAI selection (lib/ai-recommendation.ts)
   │      - Structured JSON with candidateId validation
   │      - Deterministic fallback on timeout / error / no API key
   ▼
UI Response
   ├── Primary Recommended Game with AI explanation & safety status
   ├── Alternatives grid
   └── Official store listings & parental caveats
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 & Node 24)
- npm or pnpm

### 2. Installation
```bash
git clone <repository-url>
cd child-game-recommender
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:
```env
# Optional: OpenAI API Key (leave empty for automatic deterministic ranking fallback)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Game search data provider: "auto" | "itunes" | "demo"
DATA_PROVIDER=auto
```

> **Note:** The application functions completely end-to-end even without an `OPENAI_API_KEY` by utilizing deterministic ranking.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running the Automated Safety & Integration Tests
```bash
# Test hard filters, rating dampening, and unverified data handling
npx tsx scripts/test-engine.mjs

# Test live geolocation, store search, and end-to-end flow
npx tsx scripts/test-live-flow.ts
```

### 6. Production Build
```bash
npm run build
npm start
```

---

## 📡 API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Service health status and timestamp |
| `/api/categories` | `GET` | Supported game categories with descriptions |
| `/api/location` | `GET` | Detected IP country and manual confirmation flag |
| `/api/recommendations` | `POST` | Primary recommendation engine with safety checks |


## ⚖️ Safety & Disclaimer

All recommendations and listing details are based on publicly available digital store metadata. Star ratings alone do not represent a guarantee of child safety. Parents are always advised to review in-app purchases, advertisements, chat settings, and play together before allowing independent play.
