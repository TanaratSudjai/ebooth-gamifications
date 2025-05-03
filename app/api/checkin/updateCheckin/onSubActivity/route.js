import { updateIsCheckInONSubActivity } from "@/services/server/CheckInService";
import { NextResponse } from "next/server";

export async function PUT(req) {

  try {
    const response = await updateIsCheckInONSubActivity(await req.json());
    return NextResponse.json({response},{status: response.status});
    }
    catch (error) {
    return NextResponse.json({ error: "Error updating check-in status" },{status: 500});
  }
}