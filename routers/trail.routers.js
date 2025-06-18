const express = require("express");
const router = express.Router();
const trailController = require("../controllers/admin/trail.controllers");
const { protect, admin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/fileUpload");



router.post("/create",
    //  upload.('images', 10), 
    upload.single('images') ,
     trailController.createTrails);

router.get("", trailController.getAll);

router.get("/:id", trailController.getOneTrail);

router.put("/:id" , 
   
    trailController.updateTrails);

router.delete("/:id", trailController.deleteTrails)

module.exports = router;
