import { createMemberRank } from "@/services/server/memberRankService";
import { getPaginatedData } from "@/services/server/paginate";
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import ReadableStreamToNode from "@/utils/readable";

// Disable default Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  // This is the magic that converts Web Request to a Node stream
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "/tmp/uploads/member_ranks"),
    keepExtensions: true,
  });

  return new Promise(async (resolve, reject) => {
    try {
      const reader = request.body?.getReader();

      if (!reader) {
        return resolve(
          NextResponse.json({ status: "error", message: "No body reader" }, { status: 400 })
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
            NextResponse.json({ status: "error", message: err.message }, { status: 500 })
          );
        }

        const file = files.member_rank_logo?.[0];
        const imageUrl = `/uploads/member_ranks/${path.basename(file.filepath)}`;

        const newMemberRank = await createMemberRank({
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
        NextResponse.json({ status: "error", message: error.message }, { status: 500 })
      );
    }
  });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const result = await getPaginatedData("member_rank", page, limit);

    return NextResponse.json(
      {
        status: "success",
        message: "Member ranks fetched successfully",
        data: result.data,
        pagination: {
          page,
          limit,
          totalPages: result.totalPages,
          totalItems: result.totalItems,
        },
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
