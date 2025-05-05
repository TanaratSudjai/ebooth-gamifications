import { checkin } from "@/services/server/subActivityService";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const checkinResult = await checkin(data);
    return NextResponse.json(checkinResult, { status: 200 });
  } catch (error) {
    console.error("Error in checkin route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

