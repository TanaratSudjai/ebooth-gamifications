import { updateIsCheckInONActivity } from "@/services/server/CheckInService";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const response = await updateIsCheckInONActivity(await req.json());
    return NextResponse.json({ response }, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating check-in status" },
      { status: 500 }
    );
  }
}
