const express = require("express");
const User = require("../../models/user.model");
const userModel = require("../../models/user.model");

exports.updateUserRole = async (req, res) => {
  const { userToUpdate } = req.params;
  const { newRoles } = req.body;

  if (!["user", "guide", "admin"].includes(newRoles)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role specifed .",
    });
  }

  try {
    const user = await User.findById(userToUpdate);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User to update not found",
      });
    }
    
    user.role = newRoles ;
    await user.save() ;

    return res.status(200).json({
      success: true,
      message: `User ${userToUpdate.name}'s role to updated to ${newRoles}.`,
      data: {
        _id: userToUpdate._id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role,
      },
    });
  } catch (e) {
   
    return res.status(500).json({
      success: false,
      message: "Server issue",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      hikerType,
      role,
      ageGroup,
      emergencyContact,
      bio,
      profileImage,
      stats,
      achievements,
      completedTrails,
    } = req.body;

    const user = new User({
      name,
      email,
      password,
      phone,
      hikerType,
      role,
      ageGroup,
      emergencyContact,
      bio,
      profileImage,
      stats,
      achievements,
      completedTrails,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User created succesfully",
      data: user,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

        
        let filters = {};
        if (search) {
            filters = {
                // Search for the 'search' string in the 'name' or 'email' fields.
                // The regex is case-insensitive ($options: "i").
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            };
        }

        // 3. Calculate the number of documents to skip for the current page
        const skips = (page - 1) * limit;
     const users = await User.find(filters)
    //   .populate({
    //     path: "achievements",
    //     select: "name description icon",
    //   })
      // Populate the 'trail' field nested inside the 'completedTrails' array.
      .populate({
                path: 'completedTrails.trail',
                select: 'name difficulty location' // Example: only select these fields
            })
      .sort({ createdAt: -1 }) // sort by newest users first
      .skip(skips)
      .limit(Number(limit));

    //  Get the total count of documents that match the filter for pagination
    const total = await User.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Data fetched",
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        messsage: "User not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: " A user",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

//update user details
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
      message: "Updated",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// delete the users
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (e) {}
};
