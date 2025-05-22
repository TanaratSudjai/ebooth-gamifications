import { getAllProfileById } from "@/services/server/userService";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    
    try {
        const data = await getAllProfileById(id, page, limit);
        return NextResponse.json(data);
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}