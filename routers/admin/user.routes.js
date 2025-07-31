const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/user.controller");
const { protect, admin } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/fileUpload"); // ✅ ADDED: Import multer config

router.get(
  "/me",
  protect,
  userController.getMyProfile
);

router.put(
  "/me", 
  protect,
  userController.updateMyProfile
);

router.put(
  "/me/picture", 
  protect,
  upload.single("profileImage"),
  userController.updateMyProfilePicture
);

router.delete(
  "/me", 
  protect,
  userController.deactivateMyAccount
);


// --- Admin-only routes ---
router.post(
  "/create",
  protect,
  admin, 
  userController.createUser
);

router.get("/",
  protect,
  admin,
  userController.getAllUser);

router.get("/:id",
  protect,
  admin, 
  userController.getUserById);

router.put(
  "/:id",
  protect,
  admin,
  userController.updateUserByAdmin);

router.delete(
  "/:id",
  protect,
  admin, // ✅ CHANGED: Added admin middleware for security
  userController.deleteUser
);

router.put(
  "/role/:userToUpdateId",
  protect, // ✅ CHANGED: Added protect middleware
  admin,
  userController.updateUserRole
);

module.exports = router;