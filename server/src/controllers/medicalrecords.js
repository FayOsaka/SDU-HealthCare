const db = require("../models/database"); // เปลี่ยนจาก import เป็น require

const getStudent = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("ค้นหา:", query);

    if (!query) {
      return res.status(400).json({ message: "กรุณาระบุคำค้นหา" });
    }

    const [rows] = await db.query(
      `
      SELECT 
        users_id,
        student_id,
        firstname,
        lastname,
        faculty,
        age,
        blood_type,
        disease,
        allergy
      FROM users
      WHERE users_id = ?
      OR student_id = ?
      OR CONCAT(firstname, ' ', lastname) LIKE ?
      LIMIT 1
      `,
      [query, query, `%${query}%`],
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลนักศึกษา" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Create medical record
const createMedicalRecord = async (req, res) => {
  try {
    const {
      users_id,
      appointment_id,
      symptoms,
      diagnosis,
      treatment,
      medicine,
      medicine_count,
      doctor,
      status,
      temp,
      pressure,
      pulse,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO medical
      (users_id, appointment_id, symptoms, diagnosis, treatment, medicine,
       medicine_count, doctor, visit_date, status, temp, pressure, pulse)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
      [
        String(users_id),
        String(appointment_id),
        symptoms,
        diagnosis,
        treatment,
        medicine,
        medicine_count,
        doctor,
        status,
        temp,
        pressure,
        pulse,
      ],
    );

    res.status(201).json({ message: "สำเร็จ", id: result.insertId });
  } catch (error) {
    console.error("SQL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get medical history by student ID
const getMedicalHistory = async (req, res) => {
  try {
    const { users_id } = req.params;

    const [records] = await db.query(
      `SELECT * 
       FROM medical 
       WHERE users_id = ? 
       ORDER BY visit_date DESC`,
      [users_id],
    );

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStudent,
  createMedicalRecord,
  getMedicalHistory,
};
