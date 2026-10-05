const db = require("../models/database");

exports.getStaffDashboard = async (req, res) => {
  try {
    const userId = req.user?.users_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todayAppointmentsSQL = `
      SELECT COUNT(*) AS count
      FROM appointment
      WHERE DATE(appointment_date) = DATE(NOW()) AND status != 'Cancelled'
    `;

    const todayVisitorsSQL = `
      SELECT COUNT(DISTINCT users_id) AS count
      FROM medical
      WHERE DATE(visit_date) = DATE(NOW())
    `;

    const appointmentsSQL = `
      SELECT 
        a.appointment_id,
        u.users_id,
        u.firstname,
        u.lastname,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status
      FROM appointment a
      JOIN users u ON a.users_id = u.users_id
      WHERE DATE(a.appointment_date) = DATE(NOW()) AND a.status != 'Cancelled'
      ORDER BY a.appointment_time ASC
      LIMIT 10
    `;

    const recentCasesSQL = `
      SELECT 
        m.medical_id,
        u.users_id,
        u.firstname,
        u.lastname,
        m.symptoms,
        m.diagnosis,
        m.status,
        m.visit_date
      FROM medical m
      JOIN users u ON m.users_id = u.users_id
      WHERE DATE(m.visit_date) = DATE(NOW()) AND m.status = 'Completed'
      ORDER BY m.visit_date DESC
      LIMIT 5
    `;

    const waitingAppointmentsSQL = `
      SELECT COUNT(*) AS count
      FROM appointment
      WHERE DATE(appointment_date) = DATE(NOW()) AND status = 'Pending'
    `;

    const urgentCasesSQL = `
      SELECT COUNT(*) AS count
      FROM medical
      WHERE DATE(visit_date) = DATE(NOW()) AND status IN ('Forward', 'Urgent')
    `;

    // รันทุก query พร้อมกัน
    const [
      [todayAppointmentsResult],
      [todayVisitorsResult],
      [appointmentsResult],
      [recentCasesResult],
      [waitingResult],
      [urgentResult],
    ] = await Promise.all([
      db.query(todayAppointmentsSQL),
      db.query(todayVisitorsSQL),
      db.query(appointmentsSQL),
      db.query(recentCasesSQL),
      db.query(waitingAppointmentsSQL),
      db.query(urgentCasesSQL),
    ]);

    const todayStats = [
      {
        title: "ผู้เข้ารับบริการวันนี้",
        value: `${todayVisitorsResult[0]?.count || 0} คน`,
        icon: "fa-users",
      },
      {
        title: "รอคิวตรวจ",
        value: `${waitingResult[0]?.count || 0} คน`,
        icon: "fa-clock",
      },
      {
        title: "นัดหมายวันนี้",
        value: `${todayAppointmentsResult[0]?.count || 0} รายการ`,
        icon: "fa-calendar",
      },
      {
        title: "เคสเร่งด่วน",
        value: `${urgentResult[0]?.count || 0} เคส`,
        icon: "fa-exclamation",
      },
    ];

    const appointments = (appointmentsResult || []).map((a) => ({
      appointment_id: a.appointment_id,
      firstname: a.firstname,
      lastname: a.lastname,
      fullname: `${a.firstname} ${a.lastname}`.trim(),
      time: a.appointment_time,
      reason: a.reason,
      status: a.status,
    }));

    const recentCases = (recentCasesResult || []).map((c) => ({
      medical_id: c.medical_id,
      firstname: c.firstname,
      lastname: c.lastname,
      fullname: `${c.firstname} ${c.lastname}`.trim(),
      symptoms: c.symptoms || "-",
      diagnosis: c.diagnosis || "-",
      status: c.status || "Completed",
      visit_date: c.visit_date,
    }));

    return res.json({
      todayStats,
      appointments,
      recentCases,
    });
  } catch (err) {
    console.error("Unhandled error in getStaffDashboard:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
