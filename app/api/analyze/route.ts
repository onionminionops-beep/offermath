import { NextRequest, NextResponse } from "next/server";
import { calculateOffer } from "@/lib/calculations";
import { OfferInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: OfferInput = await request.json();
    const analysis = calculateOffer(body);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing offer:", error);
    return NextResponse.json(
      { error: "Failed to analyze offer" },
      { status: 500 }
    );
  }
}
