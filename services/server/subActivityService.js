import db from "./db"; // ใช้ mysql2/promise connection
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล
const path = require("path"); // เพิ่มการ require โมดูล path
const fs = require("fs");
const QRCode = require("qrcode"); // โมดูลสำหรับการสร้าง QR Code
import { uploadQR } from "@/utils/uploadQR"; // โมดูลสำหรับการอัปโหลด QR Code ไปยัง Cloudflare R2

export const createSubActivity = async (data) => {
  try {
    const subActivitySchema = z.object({
      sub_activity_name: z.string().min(3, "subActivity name is too short"),
      activity_id: z.number().min(1, "Activity ID is required"),
      sub_activity_description: z.string().min(1, "Invalid description"),
      sub_activity_start: z
        .string()
        .min(1, "Start date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Start date must be a valid datetime",
        }),
      sub_activity_end: z
        .string()
        .min(1, "End date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "End date must be a valid datetime",
        }),
      sub_activity_max: z.number().min(1, "Max member is required"),
      sub_activity_point: z.number().min(1, "Reward points is required"),
      sub_activity_price: z.number().min(0, "Price is required"),
      mission_ids: z.array(
        z.number().int().positive("required sub activity id")
      ),
      sub_activity_image: z
        .string()
        .refine(
          (val) =>
            val.startsWith("https://") &&
            (val.endsWith(".png") ||
              val.endsWith(".jpg") ||
              val.endsWith(".jpeg")),
          {
            message: "Invalid image file path",
          }
        ),
    });

    const subActivityResult = subActivitySchema.safeParse(data);
    if (!subActivityResult.success) {
      console.error(subActivityResult.error.format());
      return;
    }

    const {
      sub_activity_name,
      activity_id,
      sub_activity_description,
      sub_activity_start,
      sub_activity_end,
      sub_activity_max,
      sub_activity_point,
      sub_activity_price,
      mission_ids,
      sub_activity_image,
    } = subActivityResult.data;

    const [result] = await db.query(
      `INSERT INTO sub_activity (
        sub_activity_image,
        sub_activity_name, activity_id, sub_activity_description, sub_activity_start, sub_activity_end, sub_activity_max, sub_activity_point, sub_activity_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sub_activity_image,
        sub_activity_name,
        activity_id,
        sub_activity_description,
        sub_activity_start,
        sub_activity_end,
        sub_activity_max,
        sub_activity_point,
        sub_activity_price,
      ]
    );

    const sub_activity_id = result.insertId;

    for (const mission_id of mission_ids) {
      await db.query(
        `INSERT INTO activity_mission (activity_id, mission_id, sub_activity_id) VALUES (?, ?, ?)`,
        [activity_id, mission_id, sub_activity_id]
      );
    }

    // ✅ Generate QR Code Buffer
    const qrData = `main,${activity_id},sub,${sub_activity_id}`;
    const qrBuffer = await QRCode.toBuffer(qrData);

    // ✅ Upload to Cloudflare R2
    const r2Key = `qrcode/${sub_activity_id}.png`;
    const qrImageUrl = await uploadQR(qrBuffer, r2Key); // ⬅️ Returns public R2 URL

    // ✅ Store R2 public URL
    await db.query(
      `UPDATE sub_activity SET qr_image_url = ? WHERE sub_activity_id = ?`,
      [qrImageUrl, sub_activity_id]
    );

    const [newActivityRows] = await db.query(
      "SELECT * FROM sub_activity WHERE sub_activity_id = ?",
      [sub_activity_id]
    );

    return {
      ...newActivityRows[0],
      qr_image_url: qrImageUrl,
    };
  } catch (error) {
    console.error("❌ createSubActivity error:", error);
    throw new Error("Create subActivity failed: " + error.message);
  }
};

export const getSubActivityById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sub_activity WHERE sub_activity_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Sub_activity not found");
    }

    return rows[0]; // Return the first profile
  } catch (error) {
    console.error("❌ getSubActivityById error:", error); // Log the error for debugging
    throw new Error("Failed to fetch subActivity by ID"); // Throw a generic error message
  }
};

export const deleteSubActivity = async (id) => {
  try {
    await db.query("DELETE FROM sub_activity WHERE sub_activity_id = ?", [id]);
  } catch (error) {
    console.error("❌ deleteSubActivity error:", error); // Log the error for debugging
    throw new Error("Failed to delete subActivity"); // Throw a generic error message
  }
};

export const updateSubActivity = async (params, data) => {
  try {
    const subActivitySchema = z.object({
      sub_activity_name: z.string().min(3, "subActivity name is too short"),
      activity_id: z.number().min(1, "Activity ID is required"),
      sub_activity_description: z.string().min(1, "Invalid description"), // fixed the `min` usage here
      sub_activity_start: z
        .string()
        .min(1, "Start date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Start date must be a valid datetime",
        }),
      sub_activity_end: z
        .string()
        .min(1, "End date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "End date must be a valid datetime",
        }),
      sub_activity_max: z.number().min(1, "Max member is required"),
      sub_activity_point: z.number().min(1, "Reward points is required"),
      sub_activity_price: z.number().min(0, "Price is required"),
      mission_ids: z.array(
        z.number().int().positive("required sub activity id")
      ),
      sub_activity_image: z
        .string()
        .refine(
          (val) =>
            val.startsWith("https://") &&
            (val.endsWith(".png") ||
              val.endsWith(".jpg") ||
              val.endsWith(".jpeg")),
          {
            message: "Invalid image file path",
          }
        ),
    });

    const subActivityResult = subActivitySchema.safeParse(data);

    if (!subActivityResult.success) {
      throw new Error(
        subActivityResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const {
      sub_activity_name,
      activity_id,
      sub_activity_description,
      sub_activity_start,
      sub_activity_end,
      sub_activity_max,
      sub_activity_point,
      sub_activity_price,
      mission_ids,
      sub_activity_image,
    } = subActivityResult.data;
    const id = params; // ใช้ id จาก params

    const [result] = await db.query(
      "UPDATE sub_activity SET sub_activity_name = ?, activity_id = ?, sub_activity_description = ?, sub_activity_start = ?, sub_activity_end = ?, sub_activity_max = ?, sub_activity_point = ?, sub_activity_price = ?, sub_Activity_image = ? WHERE sub_activity_id = ?",
      [
        sub_activity_name,
        activity_id,
        sub_activity_description,
        sub_activity_start,
        sub_activity_end,
        sub_activity_max,
        sub_activity_point,
        sub_activity_price,
        sub_activity_image,
        id,
      ]
    );

    // 1. Get current mission IDs for this sub-activity
    const [existingMissions] = await db.query(
      "SELECT mission_id FROM activity_mission WHERE activity_id = ? AND sub_activity_id = ?",
      [activity_id, id]
    );
    const existingMissionIds = existingMissions.map((row) => row.mission_id);

    // 2. Determine which missions to add and remove
    const newMissionIds = mission_ids;
    const missionsToAdd = newMissionIds.filter(
      (mid) => !existingMissionIds.includes(mid)
    );
    const missionsToRemove = existingMissionIds.filter(
      (mid) => !newMissionIds.includes(mid)
    );

    // 3. Remove unselected missions (ONLY if there are any)
    if (missionsToRemove.length > 0) {
      const placeholders = missionsToRemove.map(() => "?").join(",");
      await db.query(
        `DELETE FROM activity_mission WHERE activity_id = ? AND sub_activity_id = ? AND mission_id IN (${placeholders})`,
        [activity_id, id, ...missionsToRemove]
      );
    }

    // 4. Add new missions (ONLY if there are any)
    for (const mission_id of missionsToAdd) {
      await db.query(
        `INSERT INTO activity_mission (activity_id, mission_id, sub_activity_id) VALUES (?, ?, ?)`,
        [activity_id, mission_id, id]
      );
    }

    const [updatedRows] = await db.query(
      "SELECT * FROM sub_activity WHERE sub_activity_id = ?",
      [id]
    );

    return { subActivity: updatedRows[0], status: 200 };
  } catch (error) {
    console.error("❌ updateSubActivity error:", error); // Log the error for debugging
    throw new Error("Failed to update subActivity"); // Throw a generic error message
  }
};

export const checkin = async (data) => {
  try {
    const checkinSchema = z.object({
      sub_activity_id: z.number().min(1, "Sub Activity ID is required"),
      member_id: z.number().min(1, "User ID is required"),
      activity_id: z.number().min(1, "Activity ID is required"),
    });

    const checkinResult = checkinSchema.safeParse(data);
    if (!checkinResult.success) {
      console.error(checkinResult.error.format());
      return;
    }

    const { sub_activity_id, member_id, activity_id } = checkinResult.data;

    const [checkActivityRows] = await db.query(
      "SELECT * FROM checkin WHERE sub_activity_id = ? AND member_id = ? AND activity_id = ? AND is_checkin = 1",
      [sub_activity_id, member_id, activity_id]
    );

    if (checkActivityRows.length > 0) {
      return { message: "already checkin", status: 400 };
    }

    const [checkinRows] = await db.query(
      "SELECT * FROM checkin WHERE sub_activity_id = ? AND member_id = ? AND activity_id = ?",
      [sub_activity_id, member_id, activity_id]
    );

    if (checkinRows.length > 0) {
      await db.query(
        "UPDATE checkin SET is_checkin = 1 WHERE sub_activity_id = ? AND member_id = ? AND activity_id = ?",
        [sub_activity_id, member_id, activity_id]
      );

      const [getActivityRewardPoint] = await db.query(
        `SELECT reward_points FROM activity JOIN checkin on activity.activity_id = checkin.activity_id 
            WHERE activity.activity_id = ? AND is_checkin = 0`,
        [activity_id]
      );

      await db.query(
        "UPDATE checkin SET is_checkin = 1 WHERE member_id = ? AND activity_id = ?",
        [member_id, activity_id]
      );

      const [getSubActivityRewardPoint] = await db.query(
        `SELECT sub_activity_point FROM sub_activity WHERE sub_activity_id = ?`,
        [sub_activity_id]
      );

      const subActivityPoint =
        getSubActivityRewardPoint[0].sub_activity_point || 0;
      const activityPoint = getActivityRewardPoint[0].reward_points || 0;

      await db.query(
        `UPDATE member SET member_point_total = member_point_total + ?, member_point_remain = member_point_remain + ? WHERE member_id = ?`,
        [
          subActivityPoint + activityPoint,
          subActivityPoint + activityPoint,
          member_id,
        ]
      );

      return { message: "Check-in updated successfully", status: 200 };
    }

    if (checkinRows.length === 0) {
      const [checkSubActivityMax] = await db.query(
        "SELECT * FROM sub_activity WHERE sub_activity_max = 0 AND sub_activity_id = ?",
        [sub_activity_id]
      );

      if (checkSubActivityMax.length > 0) {
        return { message: "Sub activity is full or not found", status: 400 };
      }

      const [checkSubactivityPrice] = await db.query(
        "SELECT * FROM sub_activity WHERE sub_activity_price > 0 AND sub_activity_id = ?",
        [sub_activity_id]
      );

      if (checkSubactivityPrice.length > 0) {
        return { message: "Not Allowed it not free", status: 400 };
      }

      const [insertCheckIn] = await db.query(
        "INSERT INTO checkin ( member_id, activity_id,sub_activity_id, checkin_time, is_checkin) VALUES (?, ?, ?, NOW(),?)",
        [member_id, activity_id, sub_activity_id, 1]
      );
      return { messgae: "Check-in successful", status: 200 };
    }
  } catch (error) {
    console.error("❌ checkin error:", error);
    return "Check-in failed: " + error.message;
  }
};
