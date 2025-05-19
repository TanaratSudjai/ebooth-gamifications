import { getMemberBySubActivityId } from "@/services/server/personelService";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const personnel = await getMemberBySubActivityId(id, { page, limit });

    return NextResponse.json(personnel, { status: 200 });
  } catch (error) {
    console.error("❌ getMemberBySubActivityId error:", error);
    return NextResponse.json(
      { message: "Get member by Subactivity ID failed" },
      { status: 500 }
    );
  }
}