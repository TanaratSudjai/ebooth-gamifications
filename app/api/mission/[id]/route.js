import { updateMission, deleteMission,getMissionsById } from "@/services/server/missionService";
import { NextResponse } from "next/server";

// UPDATE by ID
export async function PUT(req, {params}) {
  const id = Number(params.id);

  const body = await req.json();
  const result = await updateMission(id, body);

  if (result.error) {
    return NextResponse.json({ status: "error", message: result.error }, { status: result.status || 400 });
  }

  return NextResponse.json({ status: "success", message: "Mission updated successfully", data: result });
}

// DELETE by ID
export async function DELETE(req, {params}) {
  const id = Number(params.id);

  const result = await deleteMission(id);

  if (result.error) {
    return NextResponse.json({ status: "error", message: result.error }, { status: result.status || 400 });
  }

  return NextResponse.json({ status: "success", message: result.message });
}

export async function GET(req, {params}) {
  const id = Number(params.id);
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  const result = await getMissionsById(id, page, limit);
  return NextResponse.json({ status: "success", data: result });
}