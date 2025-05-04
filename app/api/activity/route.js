import { getPaginatedData } from "@/services/server/paginate";
import { createActivity,getActivityData } from "@/services/server/activityService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure correct path
const activity = "activity";

export async function GET(req) {
  // const session = await getServerSession({ req, ...authOptions });

  // if (!session) {
  //   return NextResponse.json(
  //     {
  //       status: "unauthorized",
  //       message: "You must be logged in to access this resource.",
  //     },
  //     { status: 401 }
  //   );
  // }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getActivityData(page, limit);

    return NextResponse.json(
      {
        status: "success",
        message: "Activities fetched successfully",
        data: result.data,
        pagination: {
          page,
          limit,
          totalPages: result.totalPages,
          totalItems: result.totalItems,
        },
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

export async function POST(req) {
  try {
    const body = await req.json();
    const newActivity = await createActivity(body);

    const response = {
      status: "success",
      message: "Activity created successfully",
      data: newActivity,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response = {
      status: "error",
      message: error.message || "Something went wrong",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
