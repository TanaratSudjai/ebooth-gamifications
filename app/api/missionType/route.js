import {
  createMissionType,
  getMissionTypes,
} from "@/services/server/missionTypeService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await createMissionType(body);

    // If error exists in the returned result, handle it
    if (result.error) {
      return NextResponse.json(
        {
          status: "error",
          message: result.error,
        },
        { status: result.status || 400 }
      );
    }

    // If no error, proceed
    return NextResponse.json(
      {
        status: "success",
        message: "Mission type created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const result = await getMissionTypes(page, limit);
    return NextResponse.json({ status: "success", data: result });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
