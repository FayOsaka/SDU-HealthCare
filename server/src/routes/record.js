const express = require("express");
const router = express.Router();
const recordController = require("../controllers/record");
const auth = require("../middleware/auth");

router.get("/", auth, recordController.getRecords);

module.exports = router;