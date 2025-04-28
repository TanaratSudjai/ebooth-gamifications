import { getRewardById,deleteReward,updateReward } from "@/services/server/rewardService";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const reward = await getRewardById(id);
    return NextResponse.json(reward, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await deleteReward(id);
    return NextResponse.json(
      { message: "Reward deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    // Update an existing organize
    const { id } = params;
    const updatedReward = await updateReward(await req.json(), id);
    return NextResponse.json(
      { message: "Reward updated successfully", data: updatedReward },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}