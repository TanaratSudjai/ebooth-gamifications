import { getDashboardData } from "@/services/server/dashBoardService";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const data = await getDashboardData();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}