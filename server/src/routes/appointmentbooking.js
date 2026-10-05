const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentbooking");
const auth = require("../middleware/auth");

router.post("/book", auth, appointmentController.bookAppointment);
router.get("/my-appointments", auth, appointmentController.getAppointments);
router.get("/available-slots", appointmentController.getAvailableSlots);

module.exports = router;