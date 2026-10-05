const db = require("../models/database");

exports.getRecords = async (req, res) => {
  try {
    const userId = req.user?.users_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const sql = `
      SELECT 
        medical_id,
        users_id,
        visit_date,
        symptoms,
        diagnosis,
        treatment,
        doctor,
        status
      FROM medical
      WHERE users_id = ?
      ORDER BY visit_date DESC
    `;

    const [rows] = await db.query(sql, [userId]);

    return res.json({ records: rows || [] });
  } catch (err) {
    console.error("Get records error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
