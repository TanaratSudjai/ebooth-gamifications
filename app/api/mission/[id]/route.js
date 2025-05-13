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

  return NextResponse.json({ status: "success", message: "Mission updated successfully", result });
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
  const result = await getMissionsById(id);
  return NextResponse.json(result);
}