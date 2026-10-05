const db = require("../models/database");

exports.createGeneralSymptoms = async (req, res) => {
    try {
    const { users_id, temperature, symptoms, severity, note } = req.body;

    const [result] = await db.query(
      `INSERT INTO form
      (users_id, temperature, symptoms, severity, note, visit_date)
      VALUES (?, ?, ?, ?, ?, NOW())`,
      [users_id, temperature, symptoms, severity, note]
    );

    res.status(201).json({
      message: "บันทึกอาการสำเร็จ",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};