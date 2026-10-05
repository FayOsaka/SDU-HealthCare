const db = require("../models/database");

exports.getStatistics = async (req, res) => {
  try {
    const totalUsersSQL = `SELECT COUNT(*) AS count FROM users`;

    const dispenseSQL = `
      SELECT COUNT(*) AS count
      FROM medical
      WHERE treatment IS NOT NULL AND TRIM(treatment) <> ''
    `;

    const observationSQL = `
      SELECT COUNT(*) AS count
      FROM medical
      WHERE LOWER(status) IN ('observation','พักสังเกต','นอนพักสังเกต','observed')
    `;

    const referralSQL = `
      SELECT COUNT(*) AS count
      FROM medical
      WHERE LOWER(status) IN ('referred','ส่งต่อ','ส่งต่อโรงพยาบาล')
    `;

    const recentSQL = `
      SELECT
        m.medical_id,
        m.visit_date,
        u.student_id,
        u.firstname,
        u.lastname,
        m.symptoms,
        m.treatment,
        m.status
      FROM medical m
      JOIN users u ON m.users_id = u.users_id
      ORDER BY m.visit_date DESC
      LIMIT 10
    `;

    // 🔥 ยิง query พร้อมกัน (เร็วกว่าแบบ callback ซ้อน)
    const [
      [totalRes],
      [dispenseRes],
      [obsRes],
      [refRes],
      [recentRes],
    ] = await Promise.all([
      db.query(totalUsersSQL),
      db.query(dispenseSQL),
      db.query(observationSQL),
      db.query(referralSQL),
      db.query(recentSQL),
    ]);

    const stats = [
      {
        title: "ผู้ใช้บริการทั้งหมด",
        value: totalRes[0]?.count || 0,
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "จ่ายยาเบื้องต้น",
        value: dispenseRes[0]?.count || 0,
        color: "bg-green-100 text-green-600",
      },
      {
        title: "นอนพักสังเกตอาการ",
        value: obsRes[0]?.count || 0,
        color: "bg-yellow-100 text-yellow-600",
      },
      {
        title: "ส่งต่อโรงพยาบาล",
        value: refRes[0]?.count || 0,
        color: "bg-purple-100 text-purple-600",
      },
    ];

    const history = (recentRes || []).map((r) => ({
      date: r.visit_date,
      id: r.student_id || "",
      fullname: `${r.firstname} ${r.lastname}`.trim(),
      symptoms: r.symptoms || "-",
      treatment: r.treatment || "-",
      status: r.status || "-",
    }));

    res.json({ stats, history });

  } catch (err) {
    console.error("Unhandled error in getStatistics:", err);
    res.status(500).json({ message: "Server error" });
  }
};
