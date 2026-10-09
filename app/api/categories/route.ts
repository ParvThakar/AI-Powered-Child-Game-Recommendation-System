import { NextResponse } from "next/server";
import { CATEGORY_DETAILS } from "@/lib/schemas";

export async function GET() {
  return NextResponse.json(CATEGORY_DETAILS);
}
