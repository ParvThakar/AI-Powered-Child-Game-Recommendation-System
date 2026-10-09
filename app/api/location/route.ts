import { NextRequest, NextResponse } from "next/server";
import { detectLocation } from "@/lib/geolocation";

export async function GET(request: NextRequest) {
  try {
    const location = await detectLocation(request);
    return NextResponse.json(location);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Location detection error:", error);
    return NextResponse.json({
      countryCode: "US",
      countryName: "United States (Default)",
      source: "fallback",
      needsConfirmation: true,
    });
  }
}
