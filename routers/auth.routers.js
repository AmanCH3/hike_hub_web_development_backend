const express = require("express");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userManagement");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback', 
  passport.authenticate('google', {
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google-auth-failed`, 
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.SECRET, { expiresIn: '1d' });
    
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;