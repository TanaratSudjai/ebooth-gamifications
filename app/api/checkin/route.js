import { createCheckIn,getCheckIn,updateCheckIn } from "@/services/server/CheckInService";

import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
    
        const checkin = await getCheckIn(page, limit);
        return NextResponse.json(
        {
            status: "success",
            message: "checkin fetched successfully",
            data: checkin.data,
            pagination: {
            page,
            limit,
            totalPages: checkin.totalPages,
            totalItems: checkin.totalItems,
            },
        },
        { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    }

export async function POST(req) {
  try {
    const checkin = await createCheckIn(await req.json());
    return NextResponse.json(
      {
        status: "success",
        message: "checkin created successfully",
        data: checkin,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const updatedCheckIn = await updateCheckIn(await req.json());
    return NextResponse.json(updatedCheckIn, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}