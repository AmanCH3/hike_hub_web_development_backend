const express = require("express");
const router = express.Router();
const { initiateEsewaPayment, verifyEsewaPayment, getTransactionHistory, getAllTransactionHistory } = require("../controllers/payment.controller");
const { protect, admin } = require("../middlewares/auth.middleware");

router.post("/initiate", protect, initiateEsewaPayment);
router.get("/history", protect, getTransactionHistory);
router.get("/verify", verifyEsewaPayment);
router.get("/all-history" , protect ,admin , getAllTransactionHistory)

module.exports = router;