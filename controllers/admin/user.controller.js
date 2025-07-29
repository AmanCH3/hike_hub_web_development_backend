const express = require("express");
const User = require("../../models/user.model");
const Group = require('../../models/group.model');

exports.updateUserRole = async (req, res) => {
  const { userToUpdateId } = req.params; // Corrected param name
  const { newRoles } = req.body;

  if (!["user", "guide", "admin"].includes(newRoles)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role specified.",
    });
  }

  try {
    const user = await User.findById(userToUpdateId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User to update not found",
      });
    }
    
    user.role = newRoles;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.name}'s role updated to ${newRoles}.`,
      data: user,
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
    // Full user creation logic...
    const user = new User(req.body);
    await user.save();
    return res.status(201).json({ // 201 Created is more appropriate
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    let filters = {};
    if (search) {
      filters = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
    }
    const skips = (page - 1) * limit;
    const users = await User.find(filters)
      .populate({
        path: 'completedTrails.trail',
        select: 'name difficulty location'
      })
      .sort({ createdAt: -1 })
      .skip(skips)
      .limit(Number(limit));
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
      message: "Server error",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not Found" });
    }
    return res.status(200).json({ success: true, data: user, message: "User found" });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "User not Found" });
    }
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, phone, hikerType, ageGroup, bio, role, active } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, hikerType, ageGroup, bio, role, active },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user, message: "User updated by admin" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// exports.getMyProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .populate('completedTrails.trail') 
//       .populate('joinedTrails.trail') // ✅ ADD THIS LINE
//       .lean();
    
//     if(!user){
//       return res.status(404).json({
//         success : false,
//         message : "User not found"
//       })
//     }

//     const userGroups = await Group.find({
//       $or: [
//         { leader: user._id }, 
//         { 'participants.user': user._id } 
//       ]
//     })
//     .populate('leader', 'name profileImage')
//     .populate('participants.user', 'name profileImage')
//     .populate('trail', 'name')
//     .sort({ date: -1 }) 
//     .lean();

//     user.groups = userGroups;

//     return res.status(200).json({
//       success : true,
//       data : user
//     }) ;

//   } catch(e) {
//     console.error(e); // Good practice to log the error
//     return res.status(500).json({
//       success : false,
//       message : "Server error"
//     })
//   }
// }
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('completedTrails.trail')
      .populate('joinedTrails.trail')
      .lean(); // .lean() makes the object mutable
    
    if(!user){
      return res.status(404).json({
        success : false,
        message : "User not found"
      })
    }

    // ✅ --- NEW LOGIC TO CALCULATE GROUP STATS ---
    // Count how many groups this user is the leader of.
    const groupsLedCount = await Group.countDocuments({ leader: user._id });

    // Count how many groups this user is a confirmed participant in (but not the leader).
    const groupsJoinedCount = await Group.countDocuments({
      'participants.user': user._id,
      'participants.status': 'confirmed',
      leader: { $ne: user._id } // Ensures we don't count groups they lead as "joined"
    });

    // Add the calculated stats to the user object before sending.
    // We use the existing fields from your User model's 'stats' object.
    user.stats.hikesLed = groupsLedCount;
    user.stats.hikesJoined = groupsJoinedCount;
    // --- END OF NEW LOGIC ---

    // This part fetches the full group details for the "Groups" tab
    const userGroups = await Group.find({
      $or: [
        { leader: user._id }, 
        { 'participants.user': user._id } 
      ]
    })
    .populate('leader', 'name profileImage')
    .populate('participants.user', 'name profileImage')
    .populate('trail', 'name')
    .sort({ date: -1 }) 
    .lean();

    user.groups = userGroups;

    return res.status(200).json({
      success : true,
      data : user
    }) ;

  } catch(e) {
    console.error(e);
    return res.status(500).json({
      success : false,
      message : "Server error"
    })
  }
};



exports.updateMyProfile = async (req, res) => {
  try {
    const { name, phone, hikerType, ageGroup, emergencyContact, bio } = req.body;
    const fieldsToUpdate = { name, phone, hikerType, ageGroup, emergencyContact, bio };
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      success: true,
      data: user,
      message: "Your profile has been updated.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deactivateMyAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    return res.status(200).json({ success: true, message: "Your account has been deactivated." });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ ADDED: New controller function for profile picture
exports.updateMyProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image.",
      });
    }

    const profileImageUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: profileImageUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      data: user,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};