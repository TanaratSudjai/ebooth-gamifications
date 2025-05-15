import { getMissionTypesById,updateMissionType,deleteMissionType } from "@/services/server/missionTypeService";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);

    const result = await getMissionTypesById(id);
    return NextResponse.json(result);
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

// UPDATE by ID
export async function PUT(req, { params }) {
    const id = Number(params.id);
    
  const body = await req.json();
  const result = await updateMissionType(body, id);

  if (result.error) {
    return NextResponse.json({ status: "error", message: result.error }, { status: result.status || 400 });
  }

  return NextResponse.json({ status: "success", message: "Mission type updated successfully", data: result });
}

// DELETE by ID
export async function DELETE(req, { params }) {
  const id = Number(params.id);
  
  const result = await deleteMissionType(id);

  if (result.error) {
    return NextResponse.json({ status: "error", message: result.error }, { status: result.status || 400 });
  }

  return NextResponse.json({ status: "success", message: result.message });
}