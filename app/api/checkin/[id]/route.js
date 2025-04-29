import {
  getCheckInWithUserId,
  deleteCheckIn,
  updateCheckIn,
} from "@/services/server/CheckInService";

import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const checkin = await getCheckInWithUserId(id);
    return NextResponse.json(
      {
        status: "success",
        message: "checkin fetched successfully",
        data: checkin,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    const res = await deleteCheckIn(id);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


