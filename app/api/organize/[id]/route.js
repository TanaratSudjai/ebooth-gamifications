import {
  getOrganizeById,
  deleteOrganize,
  updateOrganize,
} from "@/services/server/organizeService";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const id = await Number(params.id);
    const organize = await getOrganizeById(id);
    return NextResponse.json(organize, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    const res = await deleteOrganize(id);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    // Update an existing organize
    const id = Number(params.id);
    const updatedOrganize = await updateOrganize(await req.json(), id);
    return NextResponse.json(
      { message: "Organize updated successfully", data: updatedOrganize },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
