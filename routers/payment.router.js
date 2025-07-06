const express = require("express");
const router = express.Router();
const { initiateEsewaPayment, verifyEsewaPayment, getTransactionHistory } = require("../controllers/payment.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/initiate", protect, initiateEsewaPayment);
router.get("/history", protect, getTransactionHistory);
router.get("/verify", verifyEsewaPayment);

module.exports = router;