const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const auth = require("../middleware/auth");

router.get("/", auth, homeController.getHomeData);

module.exports = router;
