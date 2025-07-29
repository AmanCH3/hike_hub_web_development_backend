// const express = require("express");
// const router = express.Router();
// const { getRecentActivities } = require("../controllers/activity.controller");
// const { protect, admin } = require("../middlewares/auth.middleware");

// // This route will be accessible at /api/activity
// router.get("/", protect, admin, getRecentActivities);

// module.exports = router;





const express = require("express");
const router = express.Router();
const { getRecentActivities } = require("../controllers/activity.controller");
const { protect, admin } = require("../middlewares/auth.middleware");

router.get("/", protect, admin, getRecentActivities);

module.exports = router;
