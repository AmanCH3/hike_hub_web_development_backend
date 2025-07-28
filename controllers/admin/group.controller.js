// controllers/admin/group.controller.js
const express = require("express");
const Group = require("../../models/group.model");

exports.createGroups = async (req, res) => {
  
  try {
    const filepaths = req.files ? req.files.map(file => file.path) : [];
    const {
      title,
      trail,
      date,
      description,
      maxSize,
      leader,
      participants,
      status,
      meetingPoint,
      requirements,
      difficulty,
      comments,
    } = req.body;

    const group = new Group({
      title: title,
      trail,
      date,
      description,
     maxSize: parseInt(maxSize, 10),
      leader,
      participants,
      status,
      meetingPoint,
      requirements : requirements || [],
      difficulty,
      photos : filepaths,
      comments,
    });

    await group.save();

    return res.status(200).json({
      success: true,
      message: "Group created successfully",
      data: group,
    });
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    let filters = {};
    if (search) {
      filters.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
      ];
    }
    const skips = (page - 1) * limit;

    const groups = await Group.find(filters)
      .populate("trail", "name location distance elevation duration difficult leader participants")
      .populate("participants.user", "name email") 
      .populate("leader", "name profileImage")
      .skip(skips)
      .limit(Number(limit));

    const total = await Group.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Data fetched",
      data: groups,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    res.status(500).json({
      success: "false ",
      message: "Server error",
    });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("leader", "name email") 
      .populate({
        path: 'participants.user',
        select: 'name profileImage hikerType'
      })
      .populate("trail");


    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: group,
      message: "One Group",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//update a group
exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      req.body, // Use req.body directly for update
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group Not Found",
      });
    }

    return res.json({
      success: true,
      data: group,
      message: "updated",
    });
  } catch (e) {
    res.status(500).json({
      Error: "server error",
    });
  }
};

exports.deletegroup = async (req, res) => {
  try {
    const result = await Group.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Group Not Found",
      });
    }

    return res.json({
      success: true,
      message: "Deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.requestToJoinGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user._id; 
    const { message } = req.body; 

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const existingParticipant = group.participants.find(
      (p) => p.user.toString() === userId.toString()
    );

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: "You have already requested to join or are already a member of this group.",
      });
    }

    group.participants.push({
      user: userId,
      status: "pending",
      message: message, 
    });

    await group.save();
    const newParticipantRequest = group.participants[group.participants.length - 1];

    return res.status(200).json({
      success: true,
      message: "Join request submitted successfully. Waiting for approval.",
      data: { groupId: group._id, requestId: newParticipantRequest._id },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server error during join request.",
    });
  }
};

exports.approveJoinRequest = async (req, res) => {
  try {
    const { groupId, requestId } = req.params;
  

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const participant = group.participants.id(requestId); 
    console.log(participant)
   

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Join request not found",
      });
    }

    if (participant.status === "confirmed") {
      return res.status(400).json({
        success: false,
        message: "This request has already been approved.",
      });
    }

    participant.status = "confirmed";
    await group.save();

    return res.status(200).json({
      success: true,
      message: "Join request approved successfully.",
      data: group,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server error during approval.",
    });
  }
};

exports.denyJoinRequest = async (req, res) => {
  try {
    const { groupId, requestId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const participant = group.participants.id(requestId);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Join request not found",
      });
    }

    if (participant.status === "declined") {
      return res.status(400).json({
        success: false,
        message: "This request has already been denied.",
      });
    }

    participant.status = "declined"; 
    await group.save();

    return res.status(200).json({
      success: true,
      message: "Join request denied successfully.",
      data: group,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server error during denial.",
    });
  }
};

exports.getAllPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await Group.aggregate([
      { $unwind: "$participants" },

      { $match: { "participants.status": "pending" } },
      
      {
        $lookup: {
          from: "users", 
          localField: "participants.user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $lookup: {
          from: "trails", 
          localField: "trail",
          foreignField: "_id",
          as: "trailDetails"
        }
      },
      
      { $unwind: "$userDetails" },
      { $unwind: { path: "$trailDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: "$participants._id", 
          message: "$participants.message",
          user: { 
            _id: "$userDetails._id",
            name: "$userDetails.name",
            profileImage: "$userDetails.profileImage"
          },
          group: { // Group information
            _id: "$_id",
            title: "$title",
            date: "$date",
            trail: {
              _id: "$trailDetails._id",
              name: "$trailDetails.name",
              difficult: "$trailDetails.difficult"
            }
          }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: "Fetched all pending join requests.",
      data: pendingRequests,
    });

  } catch (e) {
    console.error("Error fetching pending requests:", e);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pending requests.",
    });
  }
};