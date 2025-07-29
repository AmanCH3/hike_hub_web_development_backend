const express = require("express");
const router = express.Router();
const userController = require("../../controllers/admin/user.controller");
const { protect, admin } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/fileUpload"); // ✅ ADDED: Import multer config

// --- User-specific routes ---
router.get(
  "/me",
  protect,
  userController.getMyProfile
);

router.put(
  "/me", // ✅ CHANGED: Was "/update" for consistency
  protect,
  userController.updateMyProfile
);

router.put(
  "/me/picture", // ✅ ADDED: New route for profile picture
  protect,
  upload.single("profileImage"),
  userController.updateMyProfilePicture
);

router.delete(
  "/me", // ✅ CHANGED: Was "/delete" for consistency
  protect,
  userController.deactivateMyAccount
);


// --- Admin-only routes ---
router.post(
  "/create",
  protect,
  admin, // This should likely be admin-only
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