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
   "/me" ,
   protect ,
   userController.updateMyProfile
)

router.delete(
   "/me" ,
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
   admin,
    
   userController.deleteUser);

router.put("/role/:userToUpdateId" , admin , userController.updateUserRole)

module.exports = router;


   