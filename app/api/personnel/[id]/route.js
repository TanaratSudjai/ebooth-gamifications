import {
  getPersonnelById,
  deletePersonnel,
  updatePersonnel,
} from "@/services/server/personelService";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const personnel = await getPersonnelById(id);
    return NextResponse.json(personnel, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const res = await deletePersonnel(id);
    return NextResponse.json(res, { status: 200 });
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
    const { id } = await params;
    const updatedPersonnel = await updatePersonnel(await req.json(), id);
    return NextResponse.json(
      { message: "Personnel updated successfully", data: updatedPersonnel },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
