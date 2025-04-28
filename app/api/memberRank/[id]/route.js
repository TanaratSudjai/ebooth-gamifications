import {
  getMemberRankById,
  deleteMemberRank,
  updateMemberRank,
} from "@/services/server/memberRankService";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import ReadableStreamToNode from "@/utils/readable";
import { IncomingForm } from "formidable";
import db from "@/services/server/db";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const memberRank = await getMemberRankById(id);
    return NextResponse.json(
      {
        status: "success",
        message: "Member rank fetched successfully",
        data: memberRank,
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

export async function DELETE(request, { params }) {
  const { id } = params;

  const memberRank = await getMemberRankById(id);

  if (!memberRank) {
    return NextResponse.json(
      {
        status: "error",
        message: "Member rank not found",
      },
      { status: 404 }
    );
  }

  const imageFileName = memberRank.member_rank_logo.split("/").pop();
  const imagePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "member_ranks",
    imageFileName
  );

  try {
    // Delete image if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete from database
    const result = await deleteMemberRank(id);

    return NextResponse.json(
      {
        status: "success",
        message: `Member rank deleted successfully along with image ${imageFileName}.`,
        dbResult: result, // Optional: return DB result if useful
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

export async function PUT(request, { params }) {
  const { id } = params;
  // This is the magic that converts Web Request to a Node stream
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "/public/uploads/member_ranks"),
    keepExtensions: true,
  });

  return new Promise(async (resolve, reject) => {
    try {
      const reader = request.body?.getReader();

      if (!reader) {
        return resolve(
          NextResponse.json(
            { status: "error", message: "No body reader" },
            { status: 400 }
          )
        );
      }

      const chunks = [];
      let done = false;

      while (!done) {
        const { value, done: chunkDone } = await reader.read();
        if (value) chunks.push(value);
        done = chunkDone;
      }

      const buffer = Buffer.concat(chunks);

      // Create a mock Node.js request stream
      const mockReq = new ReadableStreamToNode(buffer, request.headers);

      form.parse(mockReq, async (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          return resolve(
            NextResponse.json(
              { status: "error", message: err.message },
              { status: 500 }
            )
          );
        }

        const file = files.member_rank_logo?.[0];
        let imageUrl;

        // ✅ If a new file is uploaded, use its path
        if (file && file.filepath) {
          imageUrl = `/uploads/member_ranks/${path.basename(file.filepath)}`;
        } else {
          // ✅ No new image uploaded: get the current logo from DB
          const [rows] = await db.query(
            "SELECT member_rank_logo FROM member_rank WHERE member_rank_id = ?",
            [id]
          );

          if (rows.length === 0) {
            throw new Error("Member rank not found");
          }

          imageUrl = rows[0].member_rank_logo;
        }

        const newMemberRank = await updateMemberRank(id, {
          member_rank_name: fields.member_rank_name?.[0],
          member_rank_base: parseInt(fields.member_rank_base?.[0]),
          member_rank_logo: imageUrl,
        });

        return resolve(
          NextResponse.json(
            {
              status: "success",
              message: "Member rank created successfully",
              data: newMemberRank,
            },
            { status: 201 }
          )
        );
      });
    } catch (error) {
      console.error("Upload handling error:", error);
      return resolve(
        NextResponse.json(
          { status: "error", message: error.message },
          { status: 500 }
        )
      );
    }
  });
}
