import { createOrganize } from "@/services/server/organizeService";
import { getPaginatedData } from "@/services/server/paginate";
import { NextResponse } from "next/server";
const organize = "organize";

export async function POST(req) {
  try {
    const body = await req.json();
    const newOrganize = await createOrganize(body);

    const response = {
      status: "success",
      message: "Organize created successfully",
      data: newOrganize,
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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getPaginatedData(organize, page, limit);

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