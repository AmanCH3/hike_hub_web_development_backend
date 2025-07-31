const mongoose = require("mongoose");

// Mock user data
const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  name: "Test User",
  email: "test@test.com",
  role: "user"
};

const mockAdmin = {
  _id: new mongoose.Types.ObjectId(),
  name: "Test Admin",
  email: "admin@test.com",
  role: "admin"
};

// Mock authentication middleware
const mockProtect = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === "Bearer VALID_USER_TOKEN") {
    req.user = mockUser;
  } else if (token === "Bearer VALID_ADMIN_TOKEN") {
    req.user = mockAdmin;
  } else if (token && token.startsWith("Bearer VALID_TOKEN_FOR_")) {
    const userId = token.split("_")[3];
    req.user = { _id: userId };
  } else {
    req.user = mockUser; // Default fallback
  }
  next();
};

const mockAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as an admin",
    });
  }
};

module.exports = {
  mockUser,
  mockAdmin,
  mockProtect,
  mockAdminMiddleware
}; 
 