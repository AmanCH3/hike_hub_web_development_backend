const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findOne } = require("../models/trail.model");

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

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User reigstered",
      data: newUser,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


exports.loginUser = async(req , res) => {
    const {email , password} = req.body
    if(!email || !password){

        return res.status(400).json(
            {
                success : false ,
                message : "Missing Field"
            }
        )
    }
    try {
        const getUser = await User.findOne({
            email : email
        })

        if(!getUser) {
            return res.status(400).json({
                success : false ,
                message : "User not found"
            })
        }

        const passwordCheck = await bcrypt.compare(password , getUser.password)
        if(!passwordCheck){
            return res.status(400).json({
                success : false ,
                message : "Invalid Credentails"
            })
        }

        const payLoad = {
            "_id" : getUser._id ,
            "name" : getUser.name ,
            "email" : getUser.email ,
            "phone" : getUser.phone,
            "role" : getUser.role
        }

        // const userResponse = {
          
        // }

        const token = jwt.sign(payLoad , process.env.SECRET , {expiresIn : '7d'})

        return res.status(200).json({
            success : true ,
            message : "Login successful" ,
            data : getUser ,
            token : token
        })

    }
    catch (e){
        return res.status(500).json({
            success : false ,
            message : "server error"
        })
    }
}


