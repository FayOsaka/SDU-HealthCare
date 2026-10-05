const db = require("../models/database");

exports.getHomeData = async (req, res) => {
  try {
    console.log("getHomeData req.user:", req.user);
    const userId = req.user?.users_id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ดึงข้อมูล user
    const userSql =
      "SELECT users_id, username, student_id FROM users WHERE users_id = ?";

    const [userRows] = await db.query(userSql, [userId]);

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    // ตรวจสอบชื่อคอลัมน์ใน medical
    const [cols] = await db.query("SHOW COLUMNS FROM medical");

    const columnNames = (cols || []).map((c) => c.Field);
    let fkCol = null;

    if (columnNames.includes("users_id")) fkCol = "users_id";
    else if (columnNames.includes("user_id")) fkCol = "user_id";
    else if (columnNames.includes("student_id")) fkCol = "student_id";
    else if (columnNames.includes("usersid")) fkCol = "usersid";

    if (!fkCol) {
      console.warn(
        "No matching FK column found in medical table, returning empty activities"
      );
      return res.json({ user, activities: [] });
    }

    const medicalSql = `
      SELECT diagnosis, visit_date
      FROM medical
      WHERE ${fkCol} = ?
      ORDER BY visit_date DESC
      LIMIT 5
    `;

    const [medicalRows] = await db.query(medicalSql, [userId]);

    const activities = (medicalRows || []).map((item) => ({
      title: item.diagnosis || "ไม่มีคำวินิจฉัย",
      date: item.visit_date
        ? new Date(item.visit_date).toISOString().split("T")[0]
        : null,
    }));

    return res.json({ user, activities });
  } catch (err) {
    console.error("Unhandled error in getHomeData:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
