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
import { deleteFromR2 } from "@/utils/r2Delete";
import { updateToR2 } from "@/utils/r2Update";

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
  const id = params.id;

  try {
    const rank = await getMemberRankById(id);
    if (!rank) {
      return NextResponse.json({ status: "error", message: "Not found" }, { status: 404 });
    }

    const logoUrl = rank.member_rank_logo;

    // Extract R2 key from the full public URL
    // Example: "https://...r2.dev/member_ranks/12345.png" → "member_ranks/12345.png"
    const r2Key = logoUrl?.split(process.env.R2_PUBLIC_URL + "/")[1];

    if (r2Key) {
      await deleteFromR2(r2Key);
    }

    await deleteMemberRank(id);

    return NextResponse.json({
      status: "success",
      message: "Member rank deleted",
    });
  } catch (error) {
    console.error("DELETE member rank error:", error);
    return NextResponse.json({ status: "error", message: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  const form = new IncomingForm({
    keepExtensions: true,
  });

  return new Promise(async (resolve) => {
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

        let imageUrl;
        let oldImageUrl;

        // Get current data from DB
        const [rows] = await db.query(
          "SELECT member_rank_logo FROM member_rank WHERE member_rank_id = ?",
          [id]
        );

        if (rows.length === 0) {
          return resolve(
            NextResponse.json(
              { status: "error", message: "Member rank not found" },
              { status: 404 }
            )
          );
        }

        oldImageUrl = rows[0].member_rank_logo;

        const file = files.member_rank_logo?.[0];

        if (file && file.filepath) {
          const uniqueFileName = `${Date.now()}-${path.basename(file.originalFilename)}`;
          const r2Key = `member_ranks/${uniqueFileName}`;

          // Upload new image to R2
          imageUrl = await updateToR2(file.filepath, r2Key);

          // Delete old image from R2
          if (oldImageUrl && oldImageUrl.includes("r2.dev")) {
            const oldKey = oldImageUrl.split("/").slice(-2).join("/");
            await deleteFromR2(oldKey);
          }
        } else {
          imageUrl = oldImageUrl; // Keep old image if no new one uploaded
        }

        // Update in DB
        const updated = await updateMemberRank(id, {
          member_rank_name: fields.member_rank_name?.[0],
          member_rank_base: parseInt(fields.member_rank_base?.[0]),
          member_rank_logo: imageUrl,
        });

        return resolve(
          NextResponse.json(
            {
              status: "success",
              message: "Member rank updated successfully",
              data: updated,
            },
            { status: 200 }
          )
        );
      });
    } catch (error) {
      console.error("PUT /memberRank error:", error);
      return resolve(
        NextResponse.json(
          { status: "error", message: error.message },
          { status: 500 }
        )
      );
    }
  });
}
