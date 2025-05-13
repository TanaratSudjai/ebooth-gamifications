import { getActivityByPersonnelId } from "@/services/server/activityService";
import { NextResponse } from "next/server";

export async function GET(req,{params}) {
  try {
    const id = Number(params.id);
    const result = await getActivityByPersonnelId(id);

    return NextResponse.json(
      {
        status: "success",
        message: "Activities fetched successfully",
        data: result,
      },
      { status: 200 }
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