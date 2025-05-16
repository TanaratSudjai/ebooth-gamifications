import { getPaginatedData } from "@/services/server/paginate";
import fs from "fs";
import ReadableStreamToNode from "@/utils/readable";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { unstable_parseMultipartFormData, File } from "next/server";
import { IncomingForm } from "formidable";
import path from "path";
import formidable from "formidable";
import { NextResponse } from "next/server";
import { uploadToR2 } from "@/utils/r2Upload";
import { createMemberRank } from "@/services/server/memberRankService";

// app/api/upload-rank/route.js

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const config = {
  api: {
    bodyParser: false, // disable Next.js built-in body parsing
  },
};

export async function POST(request) {
  const form = new IncomingForm({
    keepExtensions: true,
  });

  return new Promise(async (resolve) => {
    try {
      // Read request body as chunks
      const reader = request.body?.getReader();
      if (!reader) {
        return resolve(
          NextResponse.json({ status: "error", message: "No body reader" }, { status: 400 })
        );
      }
      console.log("Reading body chunks...");

      const chunks = [];
      let done = false;

      while (!done) {
        const { value, done: chunkDone } = await reader.read();
        if (value) chunks.push(value);
        done = chunkDone;
      }

      const buffer = Buffer.concat(chunks);

      // Convert buffer into a mock Node.js readable stream for formidable
      const mockReq = new ReadableStreamToNode(buffer, request.headers);

      form.parse(mockReq, async (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          return resolve(
            NextResponse.json({ status: "error", message: err.message }, { status: 500 })
          );
        }
        console.log("Form parsed fields:", fields);
        console.log("Form parsed files:", files);

        const file = files.member_rank_logo?.[0];
        let imageUrl = null;

        if (file) {
          try {
            // Generate a unique filename for R2 key
            const uniqueFileName = `${Date.now()}-${path.basename(file.originalFilename || file.filepath)}`;
            const r2Key = `member_ranks/${uniqueFileName}`;

            // Upload file to Cloudflare R2 and get public URL
            imageUrl = await uploadToR2(file.filepath, r2Key);

            // Optionally delete the local temp file after upload
            fs.unlink(file.filepath, (unlinkErr) => {
              if (unlinkErr) console.warn("Failed to delete temp file:", unlinkErr);
            });
          } catch (uploadErr) {
            console.error("Upload to R2 error:", uploadErr);
            return resolve(
              NextResponse.json(
                { status: "error", message: "Failed to upload image to R2." },
                { status: 500 }
              )
            );
          }
        }

        try {
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
        } catch (dbErr) {
          console.error("DB error:", dbErr);
          return resolve(
            NextResponse.json(
              { status: "error", message: "Failed to create member rank." },
              { status: 500 }
            )
          );
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return resolve(
        NextResponse.json({ status: "error", message: error.message || "Unknown error" }, { status: 500 })
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
