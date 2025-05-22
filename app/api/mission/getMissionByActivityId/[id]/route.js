import { getMissionByActivityId } from "@/services/server/missionService";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    const { id } = params;
    try {
        const result = await getMissionByActivityId(id);
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