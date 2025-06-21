const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET);
      console.log("Decoded JWT:", decoded);

      const user = await User.findById(decoded._id).select("-password");


      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      req.user = user; 
      return next();   

    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "Not authorized, no token provided",
  });
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized as an admin",
    });
  }
};

module.exports = { protect, admin };
