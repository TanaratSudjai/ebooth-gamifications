import { getSubAcvitityByMemberIdAndActivity} from "@/services/server/CheckInService";

import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { member_id, activity_id } = params;

    const subActivity = await getSubAcvitityByMemberIdAndActivity({
      member_id: Number(member_id),
      activity_id: Number(activity_id),
    });

    return NextResponse.json(
      {
        status: "success",
        message: "SubActivity fetched successfully",
        data: subActivity,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
