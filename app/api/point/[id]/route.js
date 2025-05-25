import { addPoint } from "@/services/server/pointService";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
    const { id } = params;
    const data = await req.json();
    
    try {
        const result = await addPoint(id, data);
        return NextResponse.json(result,{status: result.status || 200});
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