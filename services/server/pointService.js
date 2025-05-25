import db from "./db";

export const addPoint = async (id, data) => {
    const { point_earned } = data;

    try {
        // Check if the user already earned a point today
        const [existing] = await db.query(
            `SELECT member_id FROM point 
             WHERE member_id = ? 
             AND DATE(point_created) = CURDATE()`,
            [id]
        );

        if (existing.length > 0) {
            return {error:"You have already earned points today. Try again tomorrow.", status: 400};
        }

        // Insert new point record
        const [rows] = await db.query(
            "INSERT INTO point (member_id, point_earned, point_created) VALUES (?, ?, NOW())",
            [id, point_earned]
        );

        const [addPointToMember] = await db.query(
            "UPDATE member SET member_point_total = member_point_total + ?, member_point_remain = member_point_remain + ? WHERE member_id = ?",
            [point_earned,point_earned, id]
        );

        return rows,addPointToMember;
    } catch (error) {
        console.error(error);
        return {error:"something went wrong"};
    }
};

