const express = require("express");
const router = express.Router();
const { cancelSubscription } = require("../controllers/subscription.controller");
const { protect } = require("../middlewares/auth.middleware");

// A protected route for cancelling a subscription.
router.put("/cancel", protect, cancelSubscription);

module.exports = router;