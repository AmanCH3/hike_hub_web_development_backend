const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/user.controller");
const { protect, admin } = require("../../middlewares/auth.middleware");


router.post(
  "/create",
  protect ,
  admin ,
  userController.createUser
);

router.get("/",
   protect ,
   admin,
    userController.getAllUser);

router.get("/:id",
  protect ,
   admin, 
   userController.getUserById);

router.put(
     "/:id",
  protect ,
   admin,
   userController.updateUser);

router.delete("/:id",
   (protect, admin), 
   userController.deleteUser);

module.exports = router;
