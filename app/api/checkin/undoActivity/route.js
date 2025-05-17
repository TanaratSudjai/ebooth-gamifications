import { undoActivityInCheckIn } from "@/services/server/CheckInService";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const result = await undoActivityInCheckIn(data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
