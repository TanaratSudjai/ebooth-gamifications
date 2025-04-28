import db from "./db";

export const getDashboardData = async () => {
  try {
    // Total counts
    const [totalMembers] = await db.query(
      `SELECT COUNT(*) AS totalMembers FROM member;`
    );
    const [totalOrganizes] = await db.query(
      `SELECT COUNT(*) AS totalOrganizes FROM organize;`
    );
    const [totalMemberRanks] = await db.query(
      `SELECT COUNT(*) AS totalMemberRanks FROM member_rank;`
    );
    const [totalRewards] = await db.query(
      `SELECT COUNT(*) AS totalRewards FROM reward;`
    );
    const [totalMembersByMonth] = await db.query(
      `SELECT 
        MONTH(member_register) AS month,
        COUNT(*) AS memberCount
            FROM member
            WHERE YEAR(member_register) = YEAR(CURDATE())  
            GROUP BY MONTH(member_register)
            ORDER BY MONTH(member_register);`
    );

    const [totalMembersByProvince] = await db.query(
      `SELECT
            CASE
                WHEN member_address LIKE '%Bangkok%' OR member_address LIKE '%กรุงเทพ%' THEN 'กรุงเทพ'
                WHEN member_address LIKE '%Buriram%' OR member_address LIKE '%บุรีรัมย์%' THEN 'บุรีรัมย์'
                WHEN member_address LIKE '%Chiang Mai%' OR member_address LIKE '%เชียงใหม่%' THEN 'เชียงใหม่'
                WHEN member_address LIKE '%Phuket%' OR member_address LIKE '%ภูเก็ต%' THEN 'ภูเก็ต'
                WHEN member_address LIKE '%khon kaen%' OR member_address LIKE '%ขอนแก่น%' THEN 'ขอนแก่น'
                
                ELSE 'อื่นๆ'
            END AS province,
            COUNT(*) AS memberCount
            FROM member
            GROUP BY province;
`
    );

    // Yesterday's new counts
    const [newMembersToday] = await db.query(
      `SELECT COUNT(*) AS newMembersToday
             FROM member 
             WHERE DATE(member_register) = CURDATE();`
    );

    const [activityUpComing] = await db.query(
      `SELECT 
            activity.*, 
            DATEDIFF(activity_start, CURDATE()) AS daysLeft, 
            COUNT(checkin.member_id) AS memberAmount
            FROM activity
            LEFT JOIN checkin ON activity.activity_id = checkin.activity_id
            WHERE DATE(activity_start) >= CURDATE()
            GROUP BY activity.activity_id
            ORDER BY activity_start ASC;
`
    );

    const [newestOrganizes] = await db.query(
      `SELECT * FROM organize ORDER BY organize_id DESC LIMIT 5;`
    );

    const [newestActivities] = await db.query(
      `SELECT * FROM activity ORDER BY activity_id DESC LIMIT 5;`
    );

    // const [newOrganizesToday] = await db.query(
    //     `SELECT COUNT(*) AS newOrganizesToday
    //      FROM organize
    //      WHERE DATE(organize_register) = CURDATE();`
    // );

    // const [newMemberRanksToday] = await db.query(
    //     `SELECT COUNT(*) AS newMemberRanksToday
    //      FROM member_rank
    //      WHERE DATE(member_rank_register) = CURDATE();`
    // );

    return {
      totalMembers: totalMembers[0].totalMembers,
      newMembersToday: newMembersToday[0].newMembersToday,
      totalOrganizes: totalOrganizes[0].totalOrganizes,
      // newOrganizesToday: newOrganizesToday[0].newOrganizesToday,
      totalMemberRanks: totalMemberRanks[0].totalMemberRanks,
      // newMemberRanksToday: newMemberRanksToday[0].newMemberRanksToday,
      totalRewards: totalRewards[0].totalRewards,
      totalMembersByMonth: totalMembersByMonth.map((row) => ({
        month: row.month,
        memberCount: row.memberCount,
      })),
      totalMembersByProvince: totalMembersByProvince.map((row) => ({
        province: row.province,
        memberCount: row.memberCount,
      })),
      totalSalaries:
        "ยังไม่รู้ว่าจะเอารายได้มาจากไหน น่าจะต้องเพิ่ม db เก็บประวัติการจ่ายเงิน", // Placeholder for total salaries
      activityUpComing: activityUpComing.map((row) => ({
        ...row,
        daysLeft: row.daysLeft,
        memberAmount: row.memberAmount,
      })),
        newestOrganizes: newestOrganizes.map((row) => ({
            ...row,
            organize_register: row.organize_id,
        })),
        newestActivities: newestActivities.map((row) => ({
            ...row,
            activity_start: row.activity_start,
            activity_end: row.activity_end,
        })),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
};
