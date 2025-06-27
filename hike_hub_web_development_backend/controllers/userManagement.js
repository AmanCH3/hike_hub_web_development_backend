const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [
        {
          name: name,
        },
        {
          email: email,
        },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User exisit",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
    });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      hikerType: newUser.hikerType,
      joinDate: newUser.joinDate,
    };

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User Registered",
      data: userResponse,
    });
  } catch (e) {
  
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
      message: "Missing Field",
    });
  }

  try {
    const getUser = await User.findOne({ email: email });
    console.log(getUser)
    if (!getUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    

    if (!getUser.password) {
      return res.status(500).json({
        success: false,
        message: "User password is not set in the database",
      });
    }

    const passwordCheck = await bcrypt.compare(password, getUser.password);

    if (!passwordCheck) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const payLoad = {
      _id: getUser._id,
      name: getUser.name,
      email: getUser.email,
      phone: getUser.phone,
      role: getUser.role,
    };

    const token = jwt.sign(payLoad, process.env.SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: getUser,
      token: token,
    });
  } catch (e) {
    console.log("Login Error:", e);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.getMe = async (req, res) => {
    try {
        // The `protect` middleware has already verified the token 
        // and attached the user's ID to `req.user`.
        const user = await User.findById(req.user._id).select('-password'); // `-password` excludes the password from the result

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Send back the user's data
        res.status(200).json({ success: true, data: user });

    } catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};