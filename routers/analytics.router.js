const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analytics.controller");
const { protect, admin } = require("../middlewares/auth.middleware");

router.get("/", protect, admin, getAnalytics);

module.exports = router;