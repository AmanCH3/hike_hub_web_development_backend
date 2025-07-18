const express = require("express");
const router = express.Router();
const trailController = require("../controllers/admin/trail.controllers");
const { protect, admin } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/fileUpload");


router.post("/create",
    protect ,
    admin,
    upload.array('images',10) ,
     trailController.createTrails);

router.get("",
     trailController.getAll);

router.get("/:id",
    protect ,
    admin,
     trailController.getOneTrail);

router.put("/:id" , 
    protect ,
    admin,
   upload.array('images',10) ,
    trailController.updateTrails);

router.delete("/:id",
    protect ,
    admin,
     trailController.deleteTrails)

router.post("/:trailId/join-trail" , protect , trailController.joinTrails)
router.post('/:trailId/leaver-trail' , protect , trailController.leaveTrail)
module.exports = router;
