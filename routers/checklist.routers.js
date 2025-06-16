const express = require("express")
const router = express.Router()
const checklistController = require("../controllers/admin/checklist.controller")


router.post(
    "/create" ,
    checklistController.createCheckList
)

router.get(
    "" ,
    checklistController.getAll
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