const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =============================
//  REGISTER USER (IMPROVED)
// =============================
exports.registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        // CHANGE 1: Be specific. The unique identifier for login is the email.
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            // CHANGE 2: Give a clear, specific error message.
            return res.status(400).json({
                success: false,
                message: "An account with this email address already exists.",
            });
        }

        // You don't need to manually hash here if you use the pre-save hook
        // in your Mongoose schema, which is the recommended practice.
        // But if you don't have the hook, this is correct.
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword, // This will be saved after hashing
            phone: phone,
        });

        await newUser.save();

        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
        };

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse,
        });

    } catch (e) {
        console.error("Registration Error:", e); // Use console.error for errors
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// =============================
//  LOGIN USER (FIXED AND SECURE)
// =============================
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide both email and password.",
        });
    }

    try {
        // Find the user and explicitly select the password field
        const user = await User.findOne({ email: email }).select('+password');

        // CHANGE 3 (THE CRITICAL FIX):
        // Combine the user existence check and the password existence check.
        // This prevents user enumeration. If no user is found OR if the user has no password,
        // give the SAME generic error message.
        if (!user || !user.password) {
            return res.status(401).json({ // Use 401 Unauthorized
                success: false,
                message: "Invalid credentials", // Generic, secure message
                // Optional: A more user-friendly hint for the frontend
                // hint: "If you signed up with Google, please use the Google login button."
            });
        }

        // If we reach here, we know the user exists AND has a password. Now we compare.
        const passwordCheck = await bcrypt.compare(password, user.password);

        if (!passwordCheck) {
            return res.status(401).json({ // Use 401 Unauthorized
                success: false,
                message: "Invalid credentials", // Use the same message!
            });
        }

        const payLoad = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payLoad, process.env.SECRET, { expiresIn: "7d" });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: payLoad,
            token: token,
        });

    } catch (e) {
        console.error("Login Error:", e);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};