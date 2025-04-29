import db from "./db"; // ใช้ mysql2/promise connection
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล

export const getCheckInWithUserId = async (id, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    // 1. Get member info
    const [[member]] = await db.query(
      `SELECT * FROM member 
       LEFT JOIN member_rank 
         ON member.member_rank_id = member_rank.member_rank_id 
       WHERE member.member_id = ?`,
      [id]
    );
    

    if (!member) {
      throw new Error("Member not found");
    }

    // 2. Get paginated check-ins
    const [checkins] = await db.query(
      `SELECT checkin.checkin_id, checkin.member_id, checkin.activity_id, checkin.sub_activity_id, 
      checkin.checkin_time, activity.activity_name, activity.activity_description, activity.activity_max,
      sub_activity.sub_activity_name, sub_activity.sub_activity_description, sub_activity.sub_activity_max
       FROM checkin join activity on checkin.activity_id = activity.activity_id
       join sub_activity on checkin.sub_activity_id = sub_activity.sub_activity_id
       WHERE checkin.member_id = ?
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    // 3. Count total check-ins
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM checkin WHERE member_id = ?`,
      [id]
    );

    const totalPages = Math.ceil(count / limit);

    return {
      member: {
        ...member,
        checkin: checkins,
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

export const getCheckIn = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(`SELECT * FROM checkin LIMIT ? OFFSET ?`, [
      limit,
      offset,
    ]);

    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM checkin`
    );

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      totalItems: count,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export const createCheckIn = async (data) => {
  try {
    const checkInSchema = z.object({
      member_id: z.number().int().positive("Member ID must be positive"),
      activity_id: z.number().int().positive("required activity id"),
      sub_activity_ids: z.array(z.number().int().positive("required sub activity id")),
    });

    const checkInResult = checkInSchema.safeParse(data);

    if (!checkInResult.success) {
      throw new Error(
        checkInResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const { member_id, activity_id, sub_activity_ids } = checkInResult.data;

    // Check activity limit
    const [[activity]] = await db.query(
      "SELECT activity_max FROM activity WHERE activity_id = ?",
      [activity_id]
    );

    if (!activity) {
      throw new Error("Activity not found.");
    }

    if (activity.activity_max < sub_activity_ids.length) {
      throw new Error("Not enough activity slots available.");
    }

    const checkInResults = [];

    for (const sub_activity_id of sub_activity_ids) {
      // Check if already registered
      const [[existingCheckIn]] = await db.query(
        `SELECT checkin_id FROM checkin 
         WHERE member_id = ? AND activity_id = ? AND sub_activity_id = ?`,
        [member_id, activity_id, sub_activity_id]
      );

      if (existingCheckIn) {
        throw new Error(`Already checked in for Sub-Activity ID ${sub_activity_id}`);
      }

      // Check sub-activity limit
      const [[subActivity]] = await db.query(
        "SELECT sub_activity_max FROM sub_activity WHERE sub_activity_id = ?",
        [sub_activity_id]
      );

      if (!subActivity) {
        throw new Error(`Sub-Activity ID ${sub_activity_id} not found.`);
      }

      if (subActivity.sub_activity_max <= 0) {
        throw new Error(`Sub-Activity ID ${sub_activity_id} is full.`);
      }

      // Insert check-in
      const [result] = await db.query(
        "INSERT INTO checkin (member_id, activity_id, sub_activity_id, checkin_time) VALUES (?, ?, ?, NOW())",
        [member_id, activity_id, sub_activity_id]
      );

      // Decrement counts
      await db.query(
        "UPDATE sub_activity SET sub_activity_max = sub_activity_max - 1 WHERE sub_activity_id = ?",
        [sub_activity_id]
      );

      checkInResults.push(result.insertId);
    }

    // Decrement the activity slots after all successful sub-activities
    await db.query(
      "UPDATE activity SET activity_max = activity_max - ? WHERE activity_id = ?",
      [checkInResults.length, activity_id] // decrement based on successful inserts
    );

    // Fetch the newly created check-ins
    const [newCheckInRows] = await db.query(
      `SELECT 
        checkin.checkin_id, 
        checkin.member_id, 
        checkin.activity_id, 
        checkin.sub_activity_id, 
        checkin.checkin_time 
      FROM checkin 
      WHERE checkin_id IN (?)`,
      [checkInResults]
    );

    return newCheckInRows;
  } catch (error) {
    console.error("Error creating check-in:", error.message);
    throw new Error(error.message || "Failed to create check-in");
  }
};

export const deleteCheckIn = async (id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM checkin WHERE checkin_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Check-in not found");
    }

    return { message: "checkin deleted successfully" };
  } catch (error) {
    console.error("Error deleting check-in:", error);
    throw new Error("Failed to delete check-in");
  }
};

export const updateCheckIn = async (data) => {
  try {
    const checkInSchema = z.object({
      member_id: z.number().int().positive("Member ID must be positive"),
      activity_id: z.number().int().positive("required activity id"),
      sub_activity_ids: z.array(z.number().int().positive("required sub activity id")),
    });

    const checkInResult = checkInSchema.safeParse(data);

    if (!checkInResult.success) {
      throw new Error(
        checkInResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const { member_id, activity_id, sub_activity_ids } = checkInResult.data;

    // 1. Get current check-ins
    const [existingRows] = await db.query(
      `SELECT sub_activity_id FROM checkin WHERE member_id = ? AND activity_id = ?`,
      [member_id, activity_id]
    );

    const existingSubActivityIds = existingRows.map(row => row.sub_activity_id);

    // 2. Find which sub-activities to delete
    const subActivityIdsToDelete = existingSubActivityIds.filter(id => !sub_activity_ids.includes(id));

    if (subActivityIdsToDelete.length > 0) {
      await db.query(
        `DELETE FROM checkin WHERE member_id = ? AND activity_id = ? AND sub_activity_id IN (?)`,
        [member_id, activity_id, subActivityIdsToDelete]
      );
    }

    // 3. Find which sub-activities to add
    const subActivityIdsToAdd = sub_activity_ids.filter(id => !existingSubActivityIds.includes(id));

    for (const sub_activity_id of subActivityIdsToAdd) {
      // Check sub-activity limit
      const [[subActivity]] = await db.query(
        "SELECT sub_activity_max FROM sub_activity WHERE sub_activity_id = ?",
        [sub_activity_id]
      );

      if (!subActivity) {
        throw new Error(`Sub-Activity ID ${sub_activity_id} not found.`);
      }

      if (subActivity.sub_activity_max <= 0) {
        throw new Error(`Sub-Activity ID ${sub_activity_id} is full.`);
      }

      // Insert new check-in
      await db.query(
        `INSERT INTO checkin (member_id, activity_id, sub_activity_id, checkin_time) VALUES (?, ?, ?,NOW())`,
        [member_id, activity_id, sub_activity_id]
      );
    }
    return { message: "checkin updated successfully" };
  } catch (error) {
    console.error("Error updating check-in:", error.message);
    throw new Error(error.message || "Failed to update check-in");
  }
}

