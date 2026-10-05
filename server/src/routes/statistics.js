const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statistics");
const auth = require("../middleware/auth");

router.get("/", auth, statisticsController.getStatistics);

module.exports = router;