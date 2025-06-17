const express = require("express")
const router = express.Router()
const userController = require("../../controllers/admin/user.controller")


router.post(
    "/create" ,
    userController.createUser
)


router.get(
    "/" ,
    userController.getAllUser
)

router.get(
    "/:id" ,
    userController.getUserById
)

router.put(
    "/:id" ,
    userController.updateUser
)

router.delete(
    "/:id" ,
    userController.deleteUser
)

module.exports = router ;