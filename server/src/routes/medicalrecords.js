const express = require("express");
const {
  getStudent,
  createMedicalRecord,
  getMedicalHistory,
} = require("../controllers/medicalrecords");

const router = express.Router();

router.get("/student", getStudent); // GET /api/medical/student?query=64010123
router.post("/", createMedicalRecord); // POST /api/medical
router.get("/history/:users_id", getMedicalHistory); // GET /api/medical/history/64010123

module.exports = router;
