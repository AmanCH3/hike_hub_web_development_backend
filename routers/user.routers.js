const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userManagement");
const { updateToUserRole } = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/authorization.middleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

// router.put(
//     '/users/:userIdToUpdate/role' ,
//     protect ,
//     authorize(['admin']),
//     updateToUserRole

// )

module.exports = router;
