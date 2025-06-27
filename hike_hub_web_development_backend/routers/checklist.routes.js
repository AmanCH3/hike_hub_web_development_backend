const express = require("express");
const router = express.Router();
const { generateChecklist } = require("../controllers/checklist.controller");

// This route is public, no protection needed
router.get("/generate", generateChecklist);

module.exports = router;