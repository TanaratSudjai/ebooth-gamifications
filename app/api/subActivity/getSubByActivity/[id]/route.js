import { NextResponse } from "next/server";

import { getPaginatedDataSubByActivity } from "@/services/server/paginate";
const table = "sub_activity";
export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const { id } = params;
    const subActivity = await getPaginatedDataSubByActivity(
      table,
      id,
      page,
      limit
    );
    if (!subActivity) {
      return [];
    }
    return NextResponse.json(
      {
        status: "success",
        message: "Activities fetched successfully",
        data: subActivity.data,
        pagination: {
          page,
          limit,
          totalPages: subActivity.totalPages,
          totalItems: subActivity.totalItems,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
