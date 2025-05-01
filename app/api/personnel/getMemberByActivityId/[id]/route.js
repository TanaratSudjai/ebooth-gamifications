import { getMemberByActivityId } from "@/services/server/personelService";
import { NextResponse } from "next/server";



export async function GET(request, { params }) {
  try {
    const { id } = params;
    const personnel = await getMemberByActivityId(id);
    return NextResponse.json(personnel, { status: 200 });
  } catch (error) {
    console.error("❌ getMemberByActivityId error:", error);
    return NextResponse.json(
      { message: "Get member by activity ID failed" },
      { status: 500 }
    );
  }
}