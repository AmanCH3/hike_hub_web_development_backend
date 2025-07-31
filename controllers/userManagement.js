const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email address already exists.",
            });
        }
        
        const newUser = new User({
            name: name,
            email: email,
            password: password, 
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
        console.error("Registration Error:", e);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide both email and password.",
        });
    }
    try {
        const user = await User.findOne({ email: email }).select('+password');
        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
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