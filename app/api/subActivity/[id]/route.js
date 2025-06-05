import {
  getSubActivityById,
  deleteSubActivity,
  updateSubActivity,
} from "@/services/server/subActivityService";
import { NextResponse } from "next/server";
import { deleteFromR2 } from "@/utils/r2Delete";
import db from "@/services/server/db";
import { uploadToR2 } from "@/utils/r2Update";
import path from "path";
import ReadableStreamToNode from "@/utils/readable";
import { IncomingForm } from "formidable";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const subActivity = await getSubActivityById(id);
    return NextResponse.json(subActivity, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const subActivity = await getSubActivityById(id);

    const logoUrl = subActivity.qr_image_url;
    
    const r2Key = logoUrl?.split(process.env.R2_PUBLIC_URL + "/")[1];
    
    if (r2Key) {
      await deleteFromR2(r2Key);
    }

    await deleteSubActivity(id);
    return NextResponse.json(
      { message: "SubActivity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// export async function PUT(req, { params }) {
//   try {
//     // Update an existing organize
//     const { id } = params;
//     const updatedSubActivity = await updateSubActivity(await req.json(), id);
//     console.log(updateSubActivity);

//     return NextResponse.json(
//       { message: "SubActivity updated successfully", data: updatedSubActivity },
//       { status: 200 }
//     );
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
          "SELECT sub_activity_image FROM sub_activity WHERE sub_activity_id = ?",
          [id]
        );

        if (rows.length === 0) {
          return resolve(
            NextResponse.json(
              { status: "error", message: "Sub activity not found" },
              { status: 404 }
            )
          );
        }

        oldImageUrl = rows[0].sub_activity_image;
        console.log("Old image URL:", oldImageUrl);

        const file = files.sub_activity_image?.[0];

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
        const updated = await updateSubActivity(id, {
          sub_activity_name: fields.sub_activity_name?.[0],
            activity_id: parseInt(fields.activity_id?.[0]),
            sub_activity_description: fields.sub_activity_description?.[0],
            sub_activity_start: fields.sub_activity_start?.[0],
            sub_activity_end: fields.sub_activity_end?.[0],
            sub_activity_max: parseInt(fields.sub_activity_max?.[0]),
            sub_activity_point: parseInt(fields.sub_activity_point?.[0]),
            sub_activity_price: parseInt(fields.sub_activity_price?.[0]),
            mission_ids: fields.mission_ids?.[0]
              .split(",")
              .map((id) => parseInt(id.trim()))
              .filter((id) => !isNaN(id)),
            sub_activity_image: imageUrl,
        });

        return resolve(
          NextResponse.json(
            {
              status: "success",
              message: "Sub activity updated successfully",
              data: updated,
            },
            { status: 200 }
          )
        );
      });
    } catch (error) {
      console.error("PUT /subActivity error:", error);
      return resolve(
        NextResponse.json(
          { status: "error", message: error.message },
          { status: 500 }
        )
      );
    }
  });
}