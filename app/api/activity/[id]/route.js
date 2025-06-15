import {
  getActivityById,
  deleteActivity,
  updateActivity,
} from "@/services/server/activityService";
import { NextResponse } from "next/server";
import { uploadToR2 } from "@/utils/r2Update";
import path from "path";
import ReadableStreamToNode from "@/utils/readable";
import { IncomingForm } from "formidable";
import { deleteFromR2 } from "@/utils/r2Delete";
import db from "@/services/server/db";

export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const activity = await getActivityById(id);
    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// export async function DELETE(req, { params }) {
//   try {
//     const id = Number(params.id);
//     const res = await deleteActivity(id);
//     return NextResponse.json(res, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const activity = await getActivityById(id);

    const logoUrl = activity.qr_activity_image_url;
    const imageUrl = activity.activity_image;

    // Extract keys from public R2 URLs
    const r2PublicUrl = process.env.R2_PUBLIC_URL;
    const logoKey = logoUrl?.startsWith(r2PublicUrl)
      ? logoUrl.split(r2PublicUrl + "/")[1]
      : null;
    const imageKey = imageUrl?.startsWith(r2PublicUrl)
      ? imageUrl.split(r2PublicUrl + "/")[1]
      : null;

    // Delete from R2 if keys exist
    if (logoKey) {
      await deleteFromR2(logoKey);
    }
    if (imageKey) {
      await deleteFromR2(imageKey);
    }

    await deleteActivity(id);

    return NextResponse.json(
      { message: "activity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// export async function PUT(req, { params }) {
//   try {
//     // Update an existing organize
//     const id = Number(params.id);
//     const updatedActivity = await updateActivity(await req.json(), id);
//     return NextResponse.json(updatedActivity, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }

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
          "SELECT activity_image FROM activity WHERE activity_id = ?",
          [id]
        );

        if (rows.length === 0) {
          return resolve(
            NextResponse.json(
              { status: "error", message: "activity not found" },
              { status: 404 }
            )
          );
        }

        oldImageUrl = rows[0].activity_image;
        console.log("Old image URL:", oldImageUrl);

        const file = files.activity_image?.[0];

        if (file && file.filepath) {
          const uniqueFileName = `${Date.now()}-${path.basename(file.originalFilename)}`;
          const r2Key = `member_ranks/${uniqueFileName}`;

          // Upload new image to R2
          imageUrl = await uploadToR2(file.filepath, r2Key);

          // Delete old image from R2
          if (oldImageUrl && oldImageUrl.includes("r2.dev")) {
            const oldKey = oldImageUrl.replace(/^https:\/\/[^/]+\/?/, "");
            await deleteFromR2(oldKey);
          }
        } else {
          imageUrl = oldImageUrl; // Keep old image if no new one uploaded
        }

        // Update in DB
        const updated = await updateActivity(id, {
          activity_name: fields.activity_name?.[0],
            activity_description: fields.activity_description?.[0],
            activity_start: fields.activity_start?.[0],
            activity_end: fields.activity_end?.[0],
            activity_max: parseInt(fields.activity_max?.[0]),
            reward_points: parseInt(fields.reward_points?.[0]),
            organize_id: parseInt(fields.organize_id?.[0]),
            activity_price: parseInt(fields.activity_price?.[0]),
            mission_ids: fields.mission_ids?.[0]
              .split(",")
              .map((id) => parseInt(id.trim()))
              .filter((id) => !isNaN(id)),
            activity_image: imageUrl,
        });

        return resolve(
          NextResponse.json(
            {
              status: "success",
              message: "activity updated successfully",
              data: updated,
            },
            { status: 200 }
          )
        );
      });
    } catch (error) {
      console.error("PUT /Activity error:", error);
      return resolve(
        NextResponse.json(
          { status: "error", message: error.message },
          { status: 500 }
        )
      );
    }
  });
}