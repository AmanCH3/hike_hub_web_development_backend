const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/:groupId", protect, messageController.getMessageForGroup);

module.exports = router;