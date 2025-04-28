import { createProfile } from "@/services/server/userService";
import { NextResponse } from "next/server";

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
      message: error.errors
        ? error.errors.map((e) => e.message).join(", ")
        : error.message || "Something went wrong",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
