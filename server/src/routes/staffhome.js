const express = require("express");
const router = express.Router();
const staffHomeController = require("../controllers/staffhome");
const auth = require("../middleware/auth");

router.get("/dashboard", auth, staffHomeController.getStaffDashboard);

module.exports = router;