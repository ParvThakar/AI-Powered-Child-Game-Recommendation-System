import { LocationResponse } from "./schemas";

export const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  IN: "India",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  BR: "Brazil",
  MX: "Mexico",
  SG: "Singapore",
  NZ: "New Zealand",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  CH: "Switzerland",
  AT: "Austria",
  PL: "Poland",
  ZA: "South Africa",
  AE: "United Arab Emirates",
  KR: "South Korea",
  ID: "Indonesia",
  MY: "Malaysia",
  PH: "Philippines",
  TH: "Thailand",
  VN: "Vietnam",
};

export function getCountryName(code: string): string {
  const upper = code.toUpperCase();
  return COUNTRY_NAMES[upper] || upper;
}

export async function detectLocation(request?: Request): Promise<LocationResponse> {
  // 1. Try Vercel / Cloudflare edge geo headers if present
  if (request) {
    const vercelCountry = request.headers.get("x-vercel-ip-country");
    if (vercelCountry && vercelCountry.length === 2) {
      const code = vercelCountry.toUpperCase();
      return {
        countryCode: code,
        countryName: getCountryName(code),
        source: "header",
        needsConfirmation: false,
      };
    }

    const cfCountry = request.headers.get("cf-ipcountry");
    if (cfCountry && cfCountry.length === 2 && cfCountry !== "XX") {
      const code = cfCountry.toUpperCase();
      return {
        countryCode: code,
        countryName: getCountryName(code),
        source: "header",
        needsConfirmation: false,
      };
    }
  }

  // 2. Extract client IP if available
  let clientIp: string | null = null;
  if (request) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      const first = forwarded.split(",")[0].trim();
      if (
        first &&
        first !== "::1" &&
        first !== "127.0.0.1" &&
        !first.startsWith("192.168.") &&
        !first.startsWith("10.") &&
        !first.startsWith("172.16.")
      ) {
        clientIp = first;
      }
    }
  }

  // 3. Query IP geolocation service (with short 2.5s timeout)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const baseUrl = process.env.GEOLOCATION_API_URL?.replace(/\/+$/, "") || "https://ipapi.co";
    const endpoint = clientIp
      ? `${baseUrl}/${encodeURIComponent(clientIp)}/json/`
      : `${baseUrl}/json/`;

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { "User-Agent": "ChildGameRecommender/1.0" },
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.country_code && data.country_code.length === 2) {
        const code = data.country_code.toUpperCase();
        return {
          countryCode: code,
          countryName: data.country_name || getCountryName(code),
          source: "ip",
          needsConfirmation: true, // Plan: "Show the detected country as a suggestion, not an unquestionable fact"
        };
      }
    }
  } catch {
    // Geolocation network failure, rate limit, or timeout -> continue gracefully
  }

  // 4. Safe fallback
  return {
    countryCode: "US",
    countryName: "United States (Default)",
    source: "fallback",
    needsConfirmation: true,
  };
}
