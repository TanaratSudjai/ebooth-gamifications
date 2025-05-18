import db from "./db"; // ใช้ mysql2/promise connection
import bcrypt from "bcrypt";
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล

export const createPersonnel = async (data) => {
  try {
    const PersonnelSchema = z.object({
      personnel_name: z.string().min(2, "Name is too short"),
      personnel_address: z.string().min(1, "Address is required"),
      personnel_tel: z
        .string()
        .regex(/^\d{10}$/, "เบอร์โทรศัพท์ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น"),
      personnel_email: z.string().email("Invalid email format"),
      personnel_description: z.string().min("Invalid description"),
      personnel_username: z.string().min(3, "username is too short"),
      personnel_password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
      organize_id: z.number().min(1, "Organize ID is required"),
    });

    const personnelResult = PersonnelSchema.safeParse(data);

    if (!personnelResult.success) {
      throw new Error(
        personnelResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const {
      personnel_name,
      personnel_address,
      personnel_tel,
      personnel_email,
      personnel_description,
      personnel_username,
      personnel_password,
      organize_id,
    } = personnelResult.data;

    const hashedPassword = await bcrypt.hash(personnel_password, 10);

    const [result] = await db.query(
      `INSERT INTO personnel (
      personnel_name, personnel_address, personnel_tel, 
      personnel_email, personnel_description,personnel_username, personnel_password, 
      organize_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        personnel_name,
        personnel_address,
        personnel_tel,
        personnel_email,
        personnel_description,
        personnel_username,
        hashedPassword,
        organize_id,
      ]
    );

    const [newPersonnelRows] = await db.query(
      "SELECT * FROM personnel WHERE personnel_id = ?",
      [result.insertId]
    );

    return newPersonnelRows[0];
  } catch (error) {
    console.error("❌ createPersonnel error:", error);
    throw new Error("Create personnel failed: " + error.message);
  }
};

export const getPersonnelById = async (id) => {
  try {

    const [rows] = await db.query(
      "SELECT * FROM personnel WHERE personnel_id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Personnel not found");
    }

    return rows[0]; // Return the first profile
  } catch (error) {
    console.error("❌ getPersonnelById error:", error);
    throw new Error("Get personnel by ID failed: " + error.message);
  }
};

export const deletePersonnel = async (id) => {
  try {
    await db.query("DELETE FROM personnel WHERE personnel_id = ?", [id]);
    return { message: "Personnel deleted successfully" };
  } catch (error) {
    console.error("❌ deletePersonnel error:", error);
  }
};

export const updatePersonnel = async (data, params) => {
  try {
    const id = params; // ใช้ id จาก params
    const PersonnelSchema = z.object({
      personnel_name: z.string().min(3, "Name is too short"),
      personnel_address: z.string().min(1, "Address is required"),
      personnel_tel: z
        .string()
        .regex(/^\d{10}$/, "เบอร์โทรศัพท์ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น"),
      personnel_email: z.string().email("Invalid email format"),
      personnel_description: z.string().min("Invalid description"),
      personnel_username: z.string().min(3, "username is too short"),
      personnel_password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
      organize_id: z.number().min(1, "Organize ID is required"),
    });

    const personnelResult = PersonnelSchema.safeParse(data);

    if (!personnelResult.success) {
      throw new Error(
        personnelResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const {
      personnel_name,
      personnel_address,
      personnel_tel,
      personnel_email,
      personnel_description,
      personnel_username,
      personnel_password,
      organize_id,
    } = personnelResult.data;

    // Hash the password if it has changed
    let hashedPassword = personnel_password;
    if (personnel_password) {
      hashedPassword = await bcrypt.hash(personnel_password, 10);
    }

    await db.query(
      "UPDATE personnel SET personnel_name = ?, personnel_address = ?, personnel_tel = ?,personnel_email = ?, personnel_description = ?, personnel_username = ?, personnel_password = ? , organize_id = ? WHERE personnel_id = ?",
      [
        personnel_name,
        personnel_address,
        personnel_tel,
        personnel_email,
        personnel_description,
        personnel_username,
        hashedPassword,
        organize_id,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      "SELECT * FROM personnel WHERE personnel_id = ?",
      [id]
    );

    return updatedRows[0];
  } catch (error) {
    console.error("❌ updatePersonnel error:", error);
    throw new Error("Update personnel failed: " + error.message);
  }
};

export const getPersonnelData = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
      `
      SELECT 
        personnel.*, 
        organize.organize_name
      FROM 
        personnel 
      LEFT JOIN
        organize
      ON
        organize.organize_id = personnel.organize_id
      GROUP BY 
        personnel.personnel_id
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM personnel`
    );

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows, // Each row will now have a 'sub_activity_count'
      totalItems: count,
      totalPages,
    };

  } catch (error) {
    console.error("Error fetching paginated data:", error);
    throw new Error("Failed to fetch paginated data");
  }
};

export const getMemberByActivityId = async (activity_id, { page = 1, limit = 10 }) => {
  try {
    const offset = (page - 1) * limit;

    // Get the activity
    const [activityRows] = await db.query(
      "SELECT * FROM activity WHERE activity_id = ?",
      [activity_id]
    );

    // Count total members (for pagination)
    const [[{ total }]] = await db.query(
      `
      SELECT COUNT(DISTINCT member.member_id) AS total
      FROM checkin
      LEFT JOIN member ON checkin.member_id = member.member_id
      WHERE activity_id = ?
      `,
      [activity_id]
    );

    // Fetch paginated members
    const [rows] = await db.query(
      `
      SELECT member.*, MAX(checkin.is_checkin) AS is_checkin
      FROM checkin
      LEFT JOIN member ON checkin.member_id = member.member_id
      WHERE activity_id = ?
      GROUP BY member.member_id
      LIMIT ? OFFSET ?
      `,
      [activity_id, limit, offset]
    );

    return {
      data: {
        activity: activityRows[0],
        memberCount: total,
        members: rows,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching members by activity ID:", error);
    throw new Error("Failed to fetch members by activity ID");
  }
};


export const getMemberBySubActivityId = async (subActivity_id) => {
  try {

    const [[subActivityRows]] = await db.query(
      "SELECT * FROM sub_activity WHERE sub_activity_id = ?",
      [subActivity_id]
    );

    const [rows] = await db.query(
      `
      SELECT member.*,MAX(checkin.is_checkin) AS is_checkin from checkin left join member on checkin.member_id = member.member_id
      WHERE sub_activity_id = ? group by member.member_id
      `,
      [subActivity_id]
    );

    return {
      data: {
        subActivity: subActivityRows,
        memberCount: rows.length,
        members: rows,

      }
    };
  } catch (error) {
    console.error("Error fetching members by sub activity ID:", error);
    throw new Error("Failed to fetch members by sub activity ID");
  }
}