import db from "./db"; // ใช้ mysql2/promise connection
import { z } from "zod"; // ใช้สำหรับการตรวจสอบข้อมูล

export const createReward = async (data) => {
  try{
    const rewardSchema = z.object({
      reward_name: z.string().min(3, "Reward name is too short"),
      reward_point_required: z.number().min(1, "Reward point is required"),
      reward_qty_available: z.number().min(1, "Reward quantity is required"),
    });
  
    const rewardResult = rewardSchema.safeParse(data);
  
    if (!rewardResult.success) {
      throw new Error(rewardResult.error.errors.map((e) => e.message).join(", "));
    }
  
    const { reward_name, reward_point_required, reward_qty_available } = rewardResult.data;
  
    const [result] = await db.query(
      `INSERT INTO reward (
        reward_name, reward_point_required, reward_qty_available
      ) VALUES (?, ?, ?)`,
      [reward_name, reward_point_required, reward_qty_available]
    );
  
    const [newRewardRows] = await db.query(
      "SELECT * FROM reward WHERE reward_id = ?",
      [result.insertId]
    );
  
    return newRewardRows[0];
  } catch (error) {
    console.error("❌ createReward error:", error); // Log the error for debugging
    throw new Error("Create reward failed: " + error.message); // Throw a generic error message
  }
}

  export const getRewardById = async (id) => {
    try{
      const [rows] = await db.query("SELECT * FROM reward WHERE reward_id = ?", [id]);
      
      if (rows.length === 0) {
        throw new Error("Reward not found");
      }
    
      return rows[0]; // Return the first profile
    } catch (error) {
      console.error("❌ getRewardById error:", error); // Log the error for debugging
      throw new Error("Failed to fetch reward by ID"); // Throw a generic error message
    }
  }

    export const deleteReward = async (id) => {
      try{
        await db.query("DELETE FROM reward WHERE reward_id = ?", [id]);
      } catch (error) {
        console.error("❌ deleteReward error:", error); // Log the error for debugging
        throw new Error("Failed to delete reward"); // Throw a generic error message
      }
    };

    export const updateReward = async (data, params) => {
      try{
        const rewardSchema = z.object({
            reward_name: z.string().min(3, "Reward name is too short"),
            reward_point_required: z.number().min(1, "Reward point is required"),
            reward_qty_available: z.number().min(1, "Reward quantity is required"),
          });
        
          const rewardResult = rewardSchema.safeParse(data);
        
          if (!rewardResult.success) {
            throw new Error(rewardResult.error.errors.map((e) => e.message).join(", "));
          }
        
          const { reward_name, reward_point_required, reward_qty_available } = rewardResult.data;
          const id = params; // ใช้ id จาก params
        
          const [result] = await db.query(
            `UPDATE reward SET
                reward_name = ?,
                reward_point_required = ?,
                reward_qty_available = ?
              WHERE reward_id = ?`,
            [reward_name, reward_point_required, reward_qty_available, id]
          );
        
          const [newRewardRows] = await db.query(
            "SELECT * FROM reward WHERE reward_id = ?",
            [id]
          );
        
          return newRewardRows[0];
      } catch (error) {
        console.error("❌ updateReward error:", error); // Log the error for debugging
        throw new Error("Update reward failed: " + error.message); // Throw a generic error message
      }
    }