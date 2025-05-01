import { getMemberBySubActivityId } from "@/services/server/personelService";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const personnel = await getMemberBySubActivityId(id);
        return NextResponse.json(personnel, { status: 200 });
    } catch (error) {
        console.error("❌ getMemberBySubActivityId error:", error);
        return NextResponse.json(
        { message: "Get member by sub activity ID failed" },
        { status: 500 }
        );
    }
    }