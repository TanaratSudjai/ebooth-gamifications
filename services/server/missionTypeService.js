import db from "./db";
import { z } from "zod";

export const createMissionType = async (data) => {
    try{
        const MissionTypeSchema = z.object({
            mission_type_name : z.string().min(1, "Mission type name is too short!"),
            mission_type_description :  z.string().min(1, "Mission type description is required!")
        });

    const missionTypeResult = MissionTypeSchema.safeParse(data);

    if(!missionTypeResult.success){
        return {error:missionTypeResult.error.errors.map((e) => e.message).join(", ") ,status: 500}
    }

    const {
        mission_type_name,
        mission_type_description
    } = missionTypeResult.data;

    const [result] = await db.query(
        `INSERT INTO mission_type(mission_type_name,mission_type_description) VALUES (?,?)`,
        [
           mission_type_name, 
           mission_type_description,
        ]
    )

    const [newMissionTypeRow] = await db.query(
        `SELECT * FROM mission_type WHERE mission_type_id = ?`,
        [result.insertId]
    )

    return newMissionTypeRow[0];
    }catch(error){
    console.log("Fail to create MissionType", error);

    // Check for duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
        return {
            error: "Mission type name already exists!",
            status: 409 // Conflict
        };
    }

    return {
        error: "Fail to create MissionType",
        status: 400
    };
}
}

export const getMissionTypes = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(`SELECT * FROM mission_type LIMIT ? OFFSET ?`, [Number(limit), Number(offset)]);
  const [countResult] = await db.query(`SELECT COUNT(*) as count FROM mission_type`);
  return {
    data: rows,
    total: countResult[0].count,
    page: Number(page),
    limit: Number(limit),
  };
};

export const getMissionTypesById = async (params) => {
  const [rows] = await db.query(`SELECT * FROM mission_type WHERE mission_type_id = ?`, [params]);
  return {
    data: rows,
  };
};

export const updateMissionType = async (data, params) => {
  try {
    const MissionTypeSchema = z.object({
            mission_type_name : z.string().min(1, "Mission type name is too short!"),
            mission_type_description :  z.string().min(1, "Mission type description is required!")
        });

    const missionTypeResult = MissionTypeSchema.safeParse(data);
    if (!missionTypeResult.success) {
      return { error: missionTypeResult.error.errors.map((e) => e.message).join(", "), status: 400 };
    }

    const { mission_type_name, mission_type_description } = missionTypeResult.data;

    await db.query(
      `UPDATE mission_type SET mission_type_name = ?, mission_type_description = ? WHERE mission_type_id = ?`,
      [mission_type_name, mission_type_description, params]
    );

    const [updated] = await db.query(`SELECT * FROM mission_type WHERE mission_type_id = ?`, [params]);
    return updated[0];

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return { error: "Mission type name already exists!", status: 409 };
    }
    return { error: "Failed to update mission type", status: 400 };
  }
};

// DELETE
export const deleteMissionType = async (params) => {
  try {
    await db.query(`DELETE FROM mission_type WHERE mission_type_id = ?`, [params]);
    return { message: "Mission type deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete mission type", status: 400 };
  }
};