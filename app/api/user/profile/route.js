import { createProfile, updateProfile } from "@/services/server/userService";
import { getPaginatedData } from "@/services/server/paginate";
import { NextResponse } from "next/server";
const member = "member";
// API Route for Profile CRUD (using app directory)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getPaginatedData(member, page, limit);

    return NextResponse.json(
      {
        status: "success",
        message: "Profiles fetched successfully",
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
    const newProfile = await createProfile(body);

    const response = {
      status: "success",
      message: "Profile created successfully",
      data: newProfile,
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
