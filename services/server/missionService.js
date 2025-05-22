import db from "./db";
import { z } from "zod";

// CREATE
export const createMission = async (data) => {
  try {
    const MissionSchema = z.object({
      mission_name: z.string().min(1, "Mission name is required!"),
      mission_detail: z.string().optional(),
      mission_type_id: z.coerce.number().int(),
      mission_points: z.coerce.number().int().default(5),
      mission_active: z.boolean().default(true),
      mission_target_count: z.coerce
        .number()
        .int()
        .min(1, "Target count must be at least 1"),
    });
    const validated = MissionSchema.safeParse(data);
    if (!validated.success) {
      return {
        error: validated.error.errors.map((e) => e.message).join(", "),
        status: 400,
      };
    }

    const {
      mission_name,
      mission_detail = null,
      mission_type_id,
      mission_points,
      mission_active,
      mission_target_count,
    } = validated.data;

    const [result] = await db.query(
      `INSERT INTO mission (mission_name, mission_detail, mission_type_id, mission_points, mission_active, mission_target_count)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        mission_name,
        mission_detail,
        mission_type_id,
        mission_points,
        mission_active,
        mission_target_count,
      ]
    );

    const [newMission] = await db.query(
      `SELECT * FROM mission WHERE mission_id = ?`,
      [result.insertId]
    );
    return newMission[0];
  } catch (error) {
    return { error: "Failed to create mission", status: 400 };
  }
};

// GET with pagination
export const getMissions = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(`SELECT * FROM mission LIMIT ? OFFSET ?`, [
    Number(limit),
    Number(offset),
  ]);
  const [count] = await db.query(`SELECT COUNT(*) AS count FROM mission`);
  return {
    data: rows,
    total: count[0].count,
    page: Number(page),
    limit: Number(limit),
  };
};

export const getMissionsById = async (params) => {
  const [rows] = await db.query(`SELECT * FROM mission WHERE mission_id = ? `, [
    params,
  ]);
  return {
    data: rows,
  };
};

// UPDATE
export const updateMission = async (id, data) => {
  try {
    const MissionSchema = z.object({
      mission_name: z.string().min(1, "Mission name is required!"),
      mission_detail: z.string().optional(),
      mission_type_id: z.coerce.number().int(),
      mission_points: z.coerce.number().int().default(5),
      mission_active: z.boolean().default(true),
      mission_target_count: z.coerce
        .number()
        .int()
        .min(1, "Target count must be at least 1"),
    });
    const validated = MissionSchema.safeParse(data);
    if (!validated.success) {
      return {
        error: validated.error.errors.map((e) => e.message).join(", "),
        status: 400,
      };
    }

    const {
      mission_name,
      mission_detail = null,
      mission_type_id,
      mission_points,
      mission_active,
      mission_target_count,
    } = validated.data;

    await db.query(
      `UPDATE mission SET mission_name = ?, mission_detail = ?, mission_type_id = ?, mission_points = ?, mission_active = ?, mission_target_count = ?
       WHERE mission_id = ?`,
      [
        mission_name,
        mission_detail,
        mission_type_id,
        mission_points,
        mission_active,
        mission_target_count,
        id,
      ]
    );

    const [updated] = await db.query(
      `SELECT * FROM mission WHERE mission_id = ?`,
      [id]
    );
    return updated[0];
  } catch (error) {
    return { error: "Failed to update mission", status: 400 };
  }
};

// DELETE
export const deleteMission = async (id) => {
  try {
    await db.query(`DELETE FROM mission WHERE mission_id = ?`, [id]);
    return { message: "Mission deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete mission", status: 400 };
  }
};

export const getMissionByActivityId = async (activityId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
            m.*, 
            mt.mission_type_name 
        FROM 
            mission m
        JOIN 
            mission_type mt ON m.mission_type_id = mt.mission_type_id
        JOIN 
            activity_mission am ON m.mission_id = am.mission_id
        JOIN 
            activity a ON am.activity_id = a.activity_id
        WHERE 
            a.activity_id = ? AND am.sub_activity_id IS NULL;
      `,
      [activityId]
    );

    if (rows.length === 0) {
      return { error: "No mission found for the given activity ID", status: 404 };
    }

    return {data: rows}
  } catch (error) {
    return { error: "Failed to fetch mission by activity ID", status: 400 };
  }
};

export const getMissionBySubActivityId = async (SubActivityId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
            m.*, 
            mt.mission_type_name 
        FROM 
            mission m
        JOIN 
            mission_type mt ON m.mission_type_id = mt.mission_type_id
        JOIN 
            activity_mission am ON m.mission_id = am.mission_id
        JOIN 
            sub_activity sa ON am.sub_activity_id = sa.sub_activity_id
        WHERE 
            sa.sub_activity_id = ? AND am.sub_activity_id IS NOT NULL;
      `,
      [SubActivityId]
    );

    if (rows.length === 0) {
      return { error: "No mission found for the given sub-activity ID", status: 404 };
    }

    return {data: rows}
  } catch (error) {
    return { error: "Failed to fetch mission by activity ID", status: 400 };
  }
};