const express = require("express");
const router = express.Router();
const { initiateEsewaPayment, verifyEsewaPayment, getTransactionHistory } = require("../controllers/payment.controller");
const { protect } = require("../middlewares/auth.middleware");

// Routes that require a logged-in user
router.post("/initiate", protect, initiateEsewaPayment);
router.get("/history", protect, getTransactionHistory);

// 🟢 KEY CHANGE: This route is called by eSewa's server, so it's a GET and is public.
router.get("/verify", verifyEsewaPayment);

module.exports = router;