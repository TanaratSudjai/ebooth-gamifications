import {getMemberRankById} from "@/services/server/memberRankService";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function DELETE(request, { params }) {
  const { id } = params;
  const findImage = await getMemberRankById(id);

  console.log(findImage)

  if (!findImage) {
    return NextResponse.json(
      {
        status: "error",
        message: "Member rank not found",
      },
      { status: 404 }
    );
  }

  const imageFileName = findImage.member_rank_logo.split('/').pop(); 
  const imagePath = path.join(process.cwd(), 'public', 'uploads', 'member_ranks', imageFileName);

  try {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      return NextResponse.json(
        {
          status: "success",
          message: `Image ${imageFileName} deleted successfully.`,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Image not found.",
        },
        { status: 404 }
      );
    }
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