import { getOrganize } from "@/services/server/organizeService";

import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    
    try {
        const data = await getOrganize(id, page, limit);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error fetching organize data:", error);
        return NextResponse.json({ error: "Failed to fetch organize data" }, { status: 500 });
    }
    }