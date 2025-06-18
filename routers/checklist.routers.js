const express = require("express")
const router = express.Router()
const checklistController = require("../controllers/admin/checklist.controller")
const {protect ,  admin} = require("../middlewares/authorization.middleware")


router.post(
    "/create" ,

    checklistController.createCheckList
)

router.get(
    "" ,
    checklistController.getAllCheckList
)
router.get(
    "/:id" ,
    checklistController.getCheckListById
)

router.put(
    "/:id" ,
    checklistController.updateCheckList
)

router.delete(
    "/:id" ,
    checklistController.deleteCheckList
)

module.exports = router ;