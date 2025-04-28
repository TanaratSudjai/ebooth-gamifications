import {
  getSubActivityById,
  deleteSubActivity,
  updateSubActivity,
} from "@/services/server/subActivityService";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const subActivity = await getSubActivityById(id);
    return NextResponse.json(subActivity, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await deleteSubActivity(id);
    return NextResponse.json(
      { message: "SubActivity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    // Update an existing organize
    const { id } = params;
    const updatedSubActivity = await updateSubActivity(await req.json(), id);
    console.log(updateSubActivity);

    return NextResponse.json(
      { message: "SubActivity updated successfully", data: updatedSubActivity },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
