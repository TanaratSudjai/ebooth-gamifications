import db from "./db"; // ใช้ mysql2/promise connection
export const getPaginatedData = async (tableName, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    // ตรวจสอบความปลอดภัยเบื้องต้นของ table name
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      throw new Error("Invalid table name");
    }

    if (tableName === "member") {
      const [rows] = await db.query(
        `
          SELECT 
            member.member_id, 
            member.member_username, 
            member.member_email, 
            member.member_rank_id, 
            member_rank.member_rank_logo, 
            member_rank.member_rank_name, 
            member.member_address, 
            member.member_point_total, 
            member.member_exp, 
            member.member_password, 
            member.member_point_remain 
          FROM \`${tableName}\` 
          LEFT JOIN member_rank 
          ON member.member_rank_id = member_rank.member_rank_id 
          WHERE is_admin = 0 
          LIMIT ? OFFSET ?
          `,
        [limit, offset]
      );
      const [[{ count }]] = await db.query(
        `SELECT COUNT(*) AS count FROM \`${tableName}\``
      );

      const totalPages = Math.ceil(count / limit);

      return {
        data: rows,
        totalItems: count,
        totalPages,
      };
    } else {
      const [rows] = await db.query(
        `SELECT * FROM \`${tableName}\` LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      const [[{ count }]] = await db.query(
        `SELECT COUNT(*) AS count FROM \`${tableName}\``
      );

      const totalPages = Math.ceil(count / limit);

      return {
        data: rows,
        totalItems: count,
        totalPages,
      };
    }
  } catch (error) {
    console.error("Error fetching paginated data:", error); // Log the error for debugging
    throw new Error("Failed to fetch paginated data"); // Throw a generic error message
  }
};

export const getPaginatedDataSubByActivity = async (
  tableName,
  id,
  page = 1,
  limit = 10
) => {
  try {
    const offset = (page - 1) * limit;

    // ตรวจสอบความปลอดภัยเบื้องต้นของ table name
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      throw new Error("Invalid table name");
    }

    let [rows] = await db.query(
      `SELECT * FROM \`${tableName}\` WHERE activity_id = ? LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

   console.log("rows", rows[0].sub_activity_start);
   console.log("rows", rows[0].sub_activity_end);

   

    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM \`${tableName}\``
    );

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      totalItems: count,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching paginated data:", error); // Log the error for debugging
    throw new Error("Failed to fetch paginated data"); // Throw a generic error message
  }
};
