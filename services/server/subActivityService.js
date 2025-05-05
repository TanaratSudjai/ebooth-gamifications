import db from "./db"; // ใช้ mysql2/promise connection
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล
const path = require('path'); // เพิ่มการ require โมดูล path
const fs = require('fs');
const QRCode = require('qrcode'); // โมดูลสำหรับการสร้าง QR Code
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
    } = subActivityResult.data;

    const [result] = await db.query(
      `INSERT INTO sub_activity (
          sub_activity_name, activity_id, sub_activity_description, sub_activity_start, sub_activity_end, sub_activity_max, sub_activity_point, sub_activity_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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

    const [newActivityRows] = await db.query(
      "SELECT * FROM sub_activity WHERE sub_activity_id = ?",
      [sub_activity_id]
    );

    const qrData = `/api/checkin/updateCheckin/${sub_activity_id}/${sub_activity_id}`;
    const qrImagePath = path.join(process.cwd(), 'public', 'qrcodes', `${sub_activity_id}.png`);

    const qrFolder = path.dirname(qrImagePath);
    if (!fs.existsSync(qrFolder)) {
      fs.mkdirSync(qrFolder, { recursive: true });
    }

    await QRCode.toFile(qrImagePath, qrData);
    await db.query(
      `UPDATE sub_activity SET qr_image_url = ? WHERE sub_activity_id = ?`,
      [`/qrcodes/${sub_activity_id}.png`, sub_activity_id]
    );

    return {
      ...newActivityRows[0],
      qr_image_url: `/qrcodes/${sub_activity_id}.png`,
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

export const updateSubActivity = async (data, params) => {
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
    } = subActivityResult.data;
    const id = params; // ใช้ id จาก params

    await db.query(
      "UPDATE sub_activity SET sub_activity_name = ?, activity_id = ?, sub_activity_description = ?, sub_activity_start = ?, sub_activity_end = ?, sub_activity_max = ?, sub_activity_point = ?, sub_activity_price = ? WHERE sub_activity_id = ?",
      [
        sub_activity_name,
        activity_id,
        sub_activity_description,
        sub_activity_start,
        sub_activity_end,
        sub_activity_max,
        sub_activity_point,
        sub_activity_price,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      "SELECT * FROM sub_activity WHERE sub_activity_id = ?",
      [id]
    );

    return updatedRows[0];
  } catch (error) {
    console.error("❌ updateSubActivity error:", error); // Log the error for debugging
    throw new Error("Failed to update subActivity"); // Throw a generic error message
  }
};
