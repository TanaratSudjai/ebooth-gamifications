import {
  getActivityById,
  deleteActivity,
  updateActivity,
} from "@/services/server/activityService";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const activity = await getActivityById(id);
    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    const res = await deleteActivity(id);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    // Update an existing organize
    const id = Number(params.id);
    const updatedActivity = await updateActivity(await req.json(), id);
    return NextResponse.json(updatedActivity, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
