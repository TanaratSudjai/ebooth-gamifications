import { createMission, getMissions } from "@/services/server/missionService";
import { NextResponse } from "next/server";

// CREATE
export async function POST(req) {
  const body = await req.json();
  const result = await createMission(body);

  if (result.error) {
    return NextResponse.json({ status: "error", message: result.error }, { status: result.status || 400 });
  }

  return NextResponse.json({ status: "success", message: "Mission created successfully", data: result }, { status: 201 });
}

// READ with pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  const result = await getMissions(page, limit);
  return NextResponse.json({ status: "success", data: result });
}