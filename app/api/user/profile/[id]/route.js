import {
    getProfileById,
    updateProfile,
    deleteProfile,
  } from "@/services/server/userService";
  import { NextResponse } from "next/server";

  export async function GET(req, { params }) {
    try {
      const id = Number(params.id);
      const profile = await getProfileById(id);
      return NextResponse.json(profile, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: error.message },
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
  

  export async function DELETE(req, { params }) {
    try {
      const id = Number(params.id);
      await deleteProfile(id);
      return NextResponse.json(
        { message: "Profile deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }

  export async function PUT(req, { params }) {
    try {
      // Update an existing profile
      const { id } = params;
      const updatedProfile = await updateProfile(await req.json(), id);
      return NextResponse.json(
        { message: "Profile updated successfully", data: updatedProfile },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }