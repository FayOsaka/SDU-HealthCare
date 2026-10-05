const db = require("../models/database");

exports.bookAppointment = async (req, res) => {
  try {
    const userId = req.user?.users_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { appointment_date, appointment_time, reason } = req.body;

    if (!appointment_date || !appointment_time || !reason) {
      return res.status(400).json({ message: "ข้อมูลไม่สมบูรณ์" });
    }

    const sql = `
      INSERT INTO appointment (users_id, appointment_date, appointment_time, reason, status)
      VALUES (?, ?, ?, ?, 'pending')
    `;

    const [results] = await db.query(sql, [
      userId,
      appointment_date,
      appointment_time,
      reason,
    ]);

    return res.json({
      message: "จองนัดหมายสำเร็จ",
      appointment_id: results.insertId,
    });
  } catch (err) {
    console.error("Book appointment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user?.users_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const sql = `
      SELECT appointment_id, appointment_date, appointment_time, reason, status
      FROM appointment
      WHERE users_id = ?
      ORDER BY appointment_date DESC
    `;

    const [results] = await db.query(sql, [userId]);

    return res.json({ appointment: results || [] });
  } catch (err) {
    console.error("Get appointment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { appointment_date } = req.query;

    if (!appointment_date) {
      return res.status(400).json({ message: "appointment_date required" });
    }

    const timeSlots = [
      "09:00 - 09:30",
      "09:30 - 10:00",
      "10:00 - 10:30",
      "10:30 - 11:00",
      "13:00 - 13:30",
      "13:30 - 14:00",
      "14:00 - 14:30",
      "14:30 - 15:00",
    ];

    const sql = `
      SELECT appointment_time
      FROM appointment
      WHERE appointment_date = ? AND status != 'cancelled'
    `;

    const [results] = await db.query(sql, [appointment_date]);

    const bookedTimes = (results || []).map((r) => r.appointment_time);
    const availableSlots = timeSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    return res.json({ availableSlots, bookedTimes });
  } catch (err) {
    console.error("Get available slots error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
