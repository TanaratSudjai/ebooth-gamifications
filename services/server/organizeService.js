import db from "./db"; // ใช้ mysql2/promise connection
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล

export const createOrganize = async (data) => {
  try {
    const organizeSchema = z.object({
      organize_name: z.string().min(2, "Organize name is too short"),
      organize_address: z.string().min(1, "Address is required"),
      organize_tel: z
        .string()
        .regex(/^\d{10}$/, "เบอร์โทรศัพท์ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น"),
      organize_email: z.string().email("Invalid email format"),
      organize_description: z.string().min(1, "กรุณากรอกรายละเอียดเพิ่มเติม"),
    });

    const organizeResult = organizeSchema.safeParse(data);

    if (!organizeResult.success) {
      throw new Error(
        organizeResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const {
      organize_name,
      organize_address,
      organize_tel,
      organize_email,
      organize_description,
    } = organizeResult.data;

    const [result] = await db.query(
      `INSERT INTO organize (
        organize_name, organize_address, organize_tel, organize_email, organize_description
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        organize_name,
        organize_address,
        organize_tel,
        organize_email,
        organize_description,
      ]
    );

    const [newOrganizeRows] = await db.query(
      "SELECT * FROM organize WHERE organize_id = ?",
      [result.insertId]
    );

    return newOrganizeRows[0];
  } catch (error) {
    console.error("❌ createOrganize error:", error);
    throw new Error("Create organize failed: " + error.message);
  }
};

export const getOrganizeById = async (id) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM organize WHERE organize_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Organize not found");
    }

    return rows[0]; // Return the first profile
  } catch (error) {
    console.error("❌ getOrganizeById error:", error);
    throw new Error("Get organize by ID failed: " + error.message);
  }
};

export const deleteOrganize = async (id) => {
  try {
    await db.query("DELETE FROM organize WHERE organize_id = ?", [id]);
    return { message: "Organize deleted successfully" };
  } catch (error) {
    console.error("❌ deleteOrganize error:", error);
    throw new Error("Delete organize failed: " + error.message);
  }
};

// อัปเดตโปรไฟล์
export const updateOrganize = async (data, params) => {
  try {
    const organizeSchema = z.object({
      organize_name: z.string().min(3, "Organize name is too short"),
      organize_address: z.string().min(6, "Address is required"),
      organize_tel: z.string().min(1, "Telephone number is required"),
      organize_email: z.string().email("Invalid email format"),
      organize_description: z.string().min("Invalid description"),
    });

    const organizeResult = organizeSchema.safeParse(data);

    if (!organizeResult.success) {
      throw new Error(
        organizeResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const {
      organize_name,
      organize_address,
      organize_tel,
      organize_email,
      organize_description,
    } = organizeResult.data;
    const id = params; // ใช้ id จาก params

    await db.query(
      "UPDATE organize SET organize_name = ?, organize_address = ?, organize_tel = ?, organize_email = ?, organize_description = ? WHERE organize_id = ?",
      [
        organize_name,
        organize_address,
        organize_tel,
        organize_email,
        organize_description,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      "SELECT * FROM organize WHERE organize_id = ?",
      [id]
    );

    return updatedRows[0];
  } catch (error) {
    console.error("❌ updateOrganize error:", error);
    throw new Error("Update organize failed: " + error.message);
  }
};

export const getOrganize = async (id, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    // 1. Get member info
    const [[organize]] = await db.query(
      `SELECT * FROM organize 
       WHERE organize_id = ?`,
      [id]
    );
    

    if (!organize) {
      throw new Error("Organize not found");
    }

    // 2. Get paginated check-ins
    const [activity] = await db.query(
      `SELECT * from activity
       WHERE organize_id = ?
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    const [personnel] = await db.query(
      `SELECT * from personnel
       WHERE organize_id = ?
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    // 3. Count total check-ins
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM organize WHERE organize_id = ?`,
      [id]
    );

    const totalPages = Math.ceil(count / limit);

    return {
      organize: {
        ...organize,
        activity: activity,
        personnel: personnel,
      },
      pagination: {
        page,
        limit,
        totalPages: totalPages,
        totalItems: count,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};
