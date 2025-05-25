import { getMissionBySubActivityId } from "@/services/server/missionService";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const result = await getMissionBySubActivityId(id);
        return NextResponse.json(result,{ status: result.status || 200 });
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