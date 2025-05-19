import db from "./db"; // ใช้ mysql2/promise connection
import bcrypt from "bcrypt";
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล

export const getProfile = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM member WHERE is_admin = 0");

    if (rows.length === 0) {
      console.log("user not found");
    }

    return rows[0]; // Return the first profile
  } catch (error) {
    console.error("❌ getProfile error:", error); // Log the error for debugging
    throw new Error("Failed to fetch profile"); // Throw a generic error message
  }
};

export const getProfileById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM member WHERE member_id = ? AND is_admin = 0", [
      id,
    ]);

    if (rows.length === 0) {
      console.log("user not found");
    }

    return rows[0]; // Return the first profile
  } catch (error) {
    console.error("❌ getProfileById error:", error); // Log the error for debugging
    throw new Error("Failed to fetch profile by ID"); // Throw a generic error message
  }
};

// สร้างโปรไฟล์ใหม่
export const createProfile = async (data) => {
  try {
    const profileSchema = z.object({
      member_username: z.string().min(3, "Username is too short"),
      member_email: z.string().email("Invalid email format"),
      member_password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
      member_address: z.string().min(1, "Address is required"),
    });

    const parseResult = profileSchema.safeParse(data);

    if (!parseResult.success) {
      throw new Error(
        parseResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const { member_username, member_email, member_password, member_address } =
      parseResult.data;

    const [existingUser] = await db.query(
      "SELECT member_id FROM member WHERE member_username = ?",
      [member_username]
    );

    if (existingUser.length > 0) {
      return {
        error: true,
        message: "Username or email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(member_password, 10);

    const [result] = await db.query(
      `INSERT INTO member (
        member_username, member_email, member_password, 
        member_exp, member_rank_id, member_register, 
        member_address, member_point_total, member_point_remain
      ) VALUES (?, ?, ?, 0, 1, NOW(), ?, 0, 0)`,
      [member_username, member_email, hashedPassword, member_address]
    );

    const [newProfileRows] = await db.query(
      "SELECT * FROM member WHERE member_id = ?",
      [result.insertId]
    );

    return newProfileRows[0];
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


// ลบโปรไฟล์
export const deleteProfile = async (id) => {
  try {
    await db.query("DELETE FROM member WHERE member_id = ?", [id]);
  } catch (error) {
    console.error("❌ deleteProfile error:", error); // Log the error for debugging
    throw new Error("Failed to delete profile"); // Throw a generic error message
  }
};

// อัปเดตโปรไฟล์
export const updateProfile = async (data, params) => {
  try {
    const { member_username, member_email } = data;
    const id = params; // ใช้ id จาก params

    await db.query(
      "UPDATE member SET member_username = ?, member_email = ? WHERE member_id = ?",
      [member_username, member_email, id]
    );

    const [updatedRows] = await db.query(
      "SELECT * FROM member WHERE member_id = ?",
      [id]
    );

    return updatedRows[0];
  } catch (error) {
    console.error("❌ updateProfile error:", error); // Log the error for debugging
    throw new Error("Update profile failed: " + error.message); // Throw a generic error message
  }
};

// ดึงข้อมูลโปรไฟล์แบบแบ่งหน้า
export const getProfiles = async (page, limit) => {
  const offset = (page - 1) * limit;

  const [profiles] = await db.query("SELECT * FROM member LIMIT ? OFFSET ?", [
    limit,
    offset,
  ]);

  const [[{ count }]] = await db.query("SELECT COUNT(*) AS count FROM member");

  const totalPages = Math.ceil(count / limit);

  return {
    data: profiles,
    totalPages,
  };
};


