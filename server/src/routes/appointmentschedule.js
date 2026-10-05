const express = require("express");
const router = express.Router();
const appointmentScheduleController = require("../controllers/appointmentschedule");
const auth = require("../middleware/auth");

router.get("/", auth, appointmentScheduleController.getAppointmentSchedule);
router.get("/stats", auth, appointmentScheduleController.getAppointmentStats);
router.put("/:appointmentId/status", auth, appointmentScheduleController.updateAppointmentStatus);

module.exports = router;
