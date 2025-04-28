import { createReward } from "@/services/server/rewardService";
import { getPaginatedData } from "@/services/server/paginate";
import { NextResponse } from "next/server";
const reward = "reward";

export async function POST(req) {
  try {
    const body = await req.json();
    const newReward = await createReward(body);

    const response = {
      status: "success",
      message: "Reward created successfully",
      data: newReward,
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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getPaginatedData(reward, page, limit);

    return NextResponse.json(
      {
        status: "success",
        message: "Rewards fetched successfully",
        data: result.data,
        pagination: {
          page,
          limit,
          totalPages: result.totalPages,
          totalItems: result.totalItems,
        },
      },
      { status: 200 }
    );
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