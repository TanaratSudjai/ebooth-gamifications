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
    } else if (tableName === "member_rank") {
      const [rows] = await db.query(
        `SELECT 
          mr.member_rank_id,
          mr.member_rank_name,
          mr.member_rank_logo,
          mr.member_rank_base,
          COUNT(m.member_id) AS member_count
        FROM 
          member_rank AS mr
        LEFT JOIN 
          member AS m 
        ON 
          mr.member_rank_id = m.member_rank_id
        GROUP BY 
          mr.member_rank_id, mr.member_rank_name
        LIMIT ? OFFSET ?;`,
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
    } else if (tableName === "activity") {
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
  activityId,
  page = 1,
  limit = 10
) => {
  try {
    const offset = (page - 1) * limit;

    // Sanitize table name
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      throw new Error("Invalid table name");
    }

    // Get total count of sub-activities
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM \`${tableName}\` WHERE activity_id = ?`,
      [activityId]
    );

    // Get paginated sub-activities
    const [subActivities] = await db.query(
      `SELECT * FROM \`${tableName}\` WHERE activity_id = ? LIMIT ? OFFSET ?`,
      [activityId, limit, offset]
    );

    // For each sub-activity, count the number of distinct members who checked in
    const subActivityWithMemberCounts = await Promise.all(
      subActivities.map(async (sub) => {
        const [[{ memberCount }]] = await db.query(
          `
          SELECT COUNT(DISTINCT member.member_id) AS memberCount
          FROM checkin
          LEFT JOIN member ON checkin.member_id = member.member_id
          WHERE sub_activity_id = ?
          `,
          [sub.sub_activity_id]
        );

        return {
          ...sub,
          memberCount,
        };
      })
    );

    const totalPages = Math.ceil(count / limit);

    return {
      data: subActivityWithMemberCounts,
      totalItems: count,
      totalPages,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching paginated data:", error);
    throw new Error("Failed to fetch paginated data");
  }
};

