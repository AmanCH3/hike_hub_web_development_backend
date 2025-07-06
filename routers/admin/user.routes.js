const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/user.controller");
const { protect, admin } = require("../../middlewares/auth.middleware");


router.post(
  "/create",
  protect ,
  userController.createUser
);

router.get(
   "/me" ,
   protect ,
   userController.getMyProfile
)

router.put(
   "/update" ,
   protect ,
   userController.updateMyProfile
)

router.delete(
   "/delete" ,
   protect ,
   userController.deactivateMyAccount
)

// ===========admin only ==========

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
   userController.updateUserByAdmin);

router.delete("/:id",
   protect ,    
   userController.deleteUser);

router.put("/role/:userToUpdateId" , admin , userController.updateUserRole)

module.exports = router;
   