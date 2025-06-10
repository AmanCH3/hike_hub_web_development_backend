const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      // logic for fetched user
      next();
    } catch (error) {
      console.error("JWT verification error", error.message);

      return res.status(500).json({
        success: false,
        message: "Server eror",
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized , no token",
      });
    }
  }
};

module.exports = { protect };
