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

    if (newProfile.error) {
      return NextResponse.json(
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Profile created successfully",
        data: newProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          error: true,
          message: "Username or email already exists",
        },
        { status: 409 }
      );
    }

    console.log(error.message); // Moved before the throw
    throw error;
  }
}


