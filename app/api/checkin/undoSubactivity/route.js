import { undoSubactivityInCheckIn } from "@/services/server/CheckInService";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const data = await request.json();
    const result = await undoSubactivityInCheckIn(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST /checkin/undoSubactivity:", error);
    return NextResponse.json({ error: "Failed to undo subactivity" }, { status: 500 });
  }
}