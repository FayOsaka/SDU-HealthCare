const db = require("../models/database");

// =============================
// GET APPOINTMENT LIST
// =============================
exports.getAppointmentSchedule = async (req, res) => {
  console.log("=== getAppointmentSchedule called ===");

  try {
    const sql = `
       SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.reason,
        u.username,
        u.student_id
      FROM appointment a
      JOIN users u ON a.users_id = u.users_id
      ORDER BY a.appointment_date DESC
    `;

    const [rows] = await db.query(sql);

    console.log("Rows:", rows);

    return res.json(rows);
  } catch (error) {
    console.error("Schedule error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// =============================
// GET STATS
// =============================
exports.getAppointmentStats = async (req, res) => {
  try {
    const totalSQL = `SELECT COUNT(*) AS count FROM appointment`;
    const pendingSQL = `
      SELECT COUNT(*) AS count 
      FROM appointment 
      WHERE status = 'Pending'
    `;
    const confirmedSQL = `
      SELECT COUNT(*) AS count 
      FROM appointment 
      WHERE status = 'Completed'
    `;

    const [totalRes] = await db.query(totalSQL);
    const [pendingRes] = await db.query(pendingSQL);
    const [confirmedRes] = await db.query(confirmedSQL);

    res.json({
      total: totalRes[0].count || 0,
      pending: pendingRes[0].count || 0,
      confirmed: confirmedRes[0].count || 0,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// UPDATE STATUS
// =============================
exports.updateAppointmentStatus = (req, res) => {
  const appointmentId = req.params.appointmentId;
  const { status } = req.body;

  if (!appointmentId || !status) {
    return res
      .status(400)
      .json({ message: "appointmentId and status required" });
  }

  const map = {
    pending: "pending",
    completed: "completed",
    confirmed: "completed",
    cancelled: "cancelled",
    cancel: "cancelled",
  };

  const key = String(status).toLowerCase().trim();
  const dbStatus = map[key];

  if (!dbStatus) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const sql = `
    UPDATE appointment
    SET status = ?
    WHERE appointment_id = ?
  `;

  db.query(sql, [dbStatus, appointmentId], (err) => {
    if (err) {
      console.error("Update appointment status error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json({
      message: "อัปเดตสถานะสำเร็จ",
      appointmentId,
      status: dbStatus,
    });
  });
};
