const express = require("express");
const router = express.Router();
const { generateChecklist } = require("../controllers/checklist_generator.controller");

router.get("/generate", generateChecklist);

module.exports = router;