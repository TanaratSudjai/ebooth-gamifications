import db from "./db"; // ใช้ mysql2/promise connection
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล

export const createActivity = async (data) => {
  try {
    const activitySchema = z.object({
      activity_name: z.string().min(3, "activity name is too short"),
      activity_description: z.string().min(1, "Invalid description"), // fixed the `min` usage here
      activity_start: z
        .string()
        .min(1, "Start date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Start date must be a valid datetime",
        }),
      activity_end: z
        .string()
        .min(1, "End date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "End date must be a valid datetime",
        }),
      activity_max: z.number().min(1, "Max member is required"),
      reward_points: z.number().min(1, "Reward points is required"),
      organize_id: z.number().min(1, "Organize ID is required"),
      activity_price: z.number().min(0, "Price is required"),
      mission_ids: z.array(
        z.number().int().positive("required sub activity id")
      ),
    });

    const activityResult = activitySchema.safeParse(data);

    if (!activityResult.success) {
      throw new Error(
        activityResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const {
      activity_name,
      activity_description,
      activity_start,
      activity_end,
      activity_max,
      reward_points,
      organize_id,
      activity_price,
      mission_ids,
    } = activityResult.data;

    let is_multi_day;
    const startDate = new Date(activity_start);
    const endDate = new Date(activity_end);
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const totalDays = Math.floor(diffInDays);
    console.log(totalDays);

    if (totalDays > 1) {
      is_multi_day = 1;
    } else {
      is_multi_day = 0;
    }

    const [result] = await db.query(
      `INSERT INTO activity (
          activity_name, activity_description, activity_start, activity_end, activity_max, reward_points, is_multi_day, organize_id, activity_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        activity_name,
        activity_description,
        activity_start,
        activity_end,
        activity_max,
        reward_points,
        is_multi_day,
        organize_id,
        activity_price,
      ]
    );

    const activityId = result.insertId;

    for (const mission_id of mission_ids) {
      const [result] = await db.query(
        `INSERT INTO activity_mission (activity_id, mission_id) VALUES (?, ?)`,
        [activityId, mission_id]
      );
    }

    const [newActivityRows] = await db.query(
      "SELECT * FROM activity WHERE activity_id = ?",
      [activityId]
    );

    return {
      ...newActivityRows[0],
    };
  } catch (error) {
    console.error("Error creating activity:", error); // Log the error for debugging
    throw new Error("Failed to create activity"); // Throw a generic error message
  }
};

export const getActivityById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT
        activity.*,
        COUNT(checkin.member_id) AS total_participants
      FROM
          activity
      LEFT JOIN
          checkin ON activity.activity_id = checkin.activity_id
      WHERE
          activity.activity_id = ?
      GROUP BY
          checkin.member_id, activity.activity_id, activity.activity_name;
      `,
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Activity not found");
    }

    return rows[0]; // Return the first profile
  } catch (error) {
    console.error("Error fetching activity by ID:", error); // Log the error for debugging
    throw new Error("Activity not found"); // Throw a generic error message
  }
};

export const deleteActivity = async (id) => {
  try {
    await db.query("DELETE FROM activity WHERE activity_id = ?", [id]);
    return { message: "Activity deleted successfully" };
  } catch (error) {
    console.error("Error deleting activity:", error); // Log the error for debugging
    throw new Error("Failed to delete activity"); // Throw a generic error message
  }
};

export const updateActivity = async (data, params) => {
  try {
    const activitySchema = z.object({
      activity_name: z.string().min(3, "activity name is too short"),
      activity_description: z.string().min(1, "Invalid description"), // fixed the `min` usage here
      activity_start: z
        .string()
        .min(1, "Start date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Start date must be a valid datetime",
        }),
      activity_end: z
        .string()
        .min(1, "End date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "End date must be a valid datetime",
        }),
      activity_max: z.number().min(1, "Max member is required"),
      reward_points: z.number().min(1, "Reward points is required"),
      is_multi_day: z
        .union([z.boolean(), z.number().int().min(0).max(1)])
        .transform((val) => Boolean(val))
        .optional(),
      organize_id: z.number().min(1, "Organize ID is required"),
      activity_price: z.number().min(0, "Price is required"),
    });

    const activityResult = activitySchema.safeParse(data);

    if (!activityResult.success) {
      throw new Error(
        activityResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const {
      activity_name,
      activity_description,
      activity_start,
      activity_end,
      activity_max,
      reward_points,
      is_multi_day,
      organize_id,
      activity_price,
    } = activityResult.data;
    const id = params; // ใช้ id จาก params

    await db.query(
      "UPDATE activity SET activity_name = ?, activity_description = ?, activity_start = ?, activity_end = ?, activity_max = ?, reward_points = ?, is_multi_day = ?, organize_id = ?, activity_price = ? WHERE activity_id = ?",
      [
        activity_name,
        activity_description,
        activity_start,
        activity_end,
        activity_max,
        reward_points,
        is_multi_day,
        organize_id,
        activity_price,
        id,
      ]
    );

    const [updatedRows] = await db.query(
      "SELECT * FROM activity WHERE activity_id = ?",
      [id]
    );

    return updatedRows[0];
  } catch (error) {
    console.error("Error updating activity:", error); // Log the error for debugging
    throw new Error("Failed to update activity"); // Throw a generic error message
  }
};

export const getActivityData = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
      `
      SELECT 
        activity.*, 
        COUNT(sa.activity_id) AS sub_activity_count,
        organize.organize_name
      FROM 
        activity 
      LEFT JOIN 
        sub_activity sa 
      ON 
        activity.activity_id = sa.activity_id
      LEFT JOIN
        organize
      ON
        organize.organize_id = activity.organize_id
      GROUP BY 
        activity.activity_id
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM activity`
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

export const getActivityByPersonnelId = async (personnel_id) => {
  try {
    const [getPersonnel] = await db.query(
      `SELECT * FROM personnel WHERE personnel_id = ?`,
      [personnel_id]
    );

    const [getOrganizeId] = await db.query(
      `SELECT organize_id FROM personnel WHERE personnel_id = ?`,
      [personnel_id]
    );

    const organizeId = getOrganizeId[0]?.organize_id;

    if (!organizeId) {
      throw new Error("No organize_id found for the given personnel_id");
    }

    const [getActivity] = await db.query(
      `SELECT * FROM activity WHERE organize_id = ?`,
      [organizeId]
    );

    console.log(getActivity);

    return {
      personnel: getPersonnel,
      activity: getActivity,
    };
  } catch (error) {
    console.error("Error fetching activity by personnel ID:", error);
    throw new Error("Failed to fetch activities");
  }
};
