import db from "./db"; // ใช้ mysql2/promise connection
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล
import path from "path";
import fs from "fs";

export const createMemberRank = async (data) => {
  try {
    const memberRankSchema = z.object({
      member_rank_name: z.string().min(2, "Member rank name is too short"),
      member_rank_base: z
        .number()
        .int()
        .nonnegative("base must be a non-negative integer"),
      member_rank_logo: z
        .string()
        .refine(
          (val) =>
            val.startsWith("/tmp/") &&
            (val.endsWith(".png") ||
              val.endsWith(".jpg") ||
              val.endsWith(".jpeg")),
          {
            message: "Invalid image file path",
          }
        ),
    });

    const memberRankResult = memberRankSchema.safeParse(data);
  

    if (!memberRankResult.success) {
      throw new Error(
        memberRankResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const { member_rank_name, member_rank_base, member_rank_logo } =
      memberRankResult.data;

    const [result] = await db.query(
      `INSERT INTO member_rank (
          member_rank_name, member_rank_base, member_rank_logo
        ) VALUES (?, ?, ?)`,
      [member_rank_name, member_rank_base, member_rank_logo]
    );

    const [newMemberRankRows] = await db.query(
      "SELECT * FROM member_rank WHERE member_rank_id = ?",
      [result.insertId]
    );

    return newMemberRankRows[0];
  } catch (error) {
    console.error("❌ createMemberRank error:", error);
  }
};

export const getMemberRankById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM member_rank WHERE member_rank_id = ? ",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Member rank not found");
    }

    return rows[0];
  } catch (error) {
    console.error("❌ getMemberRankById error:", error);
    throw new Error("Get Member Rank failed: " + error.message);
  }
};

export const deleteMemberRank = async (id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM member_rank WHERE member_rank_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Member rank not found or already deleted");
    }

    return { message: "Member rank deleted successfully" };
  } catch (error) {
    console.error("❌ deleteMemberRank error:", error);
    throw new Error("Delete Member Rank failed: " + error.message);
  }
};

export const updateMemberRank = async (id, data) => {
  try {
    // Schema: logo optional
    const memberRankSchema = z.object({
      member_rank_name: z.string().min(2, "Member rank name is too short"),
      member_rank_base: z
        .number()
        .int()
        .positive("base must be a positive integer"),
      member_rank_logo: z
        .string()
        .refine(
          (val) =>
            val === undefined ||
            (val.startsWith("/uploads/") && val.endsWith(".png")),
          {
            message: "Invalid image file path",
          }
        )
        .optional(),
    });

    const memberRankResult = memberRankSchema.safeParse(data);

    if (!memberRankResult.success) {
      throw new Error(
        memberRankResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    let { member_rank_name, member_rank_base, member_rank_logo } =
      memberRankResult.data;

    // ✅ Get the existing image from DB
    const [rows] = await db.query(
      "SELECT member_rank_logo FROM member_rank WHERE member_rank_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Member rank not found");
    }

    const oldImage = rows[0].member_rank_logo;

    // ✅ Fallback to old image if no new one
    const newImage = member_rank_logo || oldImage;

    // ✅ Update record
    const [result] = await db.query(
      `UPDATE member_rank SET
           member_rank_name = ?,
           member_rank_base = ?,
           member_rank_logo = ?
         WHERE member_rank_id = ?`,
      [member_rank_name, member_rank_base, newImage, id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Member rank not found or no changes made");
    }

    // ✅ Delete old image if a new one is provided and it's different
    if (member_rank_logo && member_rank_logo !== oldImage) {
      const oldImagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "member_ranks",
        oldImage.split("/").pop()
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // ✅ Return updated row
    const [updatedMemberRankRows] = await db.query(
      "SELECT * FROM member_rank WHERE member_rank_id = ?",
      [id]
    );

    return updatedMemberRankRows[0];
  } catch (error) {
    console.error("❌ updateMemberRank error:", error);
    throw new Error("Update Member Rank failed: " + error.message);
  }
};
