const express = require("express");
const router = express.Router();
const trailController = require("../controllers/admin/trail.controllers");

router.post("", trailController.createTrails);

router.get("", trailController.getAll);

router.get("/:id", trailController.getOneTrail);

module.exports = router;
