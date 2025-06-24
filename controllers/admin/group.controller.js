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
      requirement,
      difficulty,
      comments,
    } = req.body;

    const group = new Group({
      title: title,
      trail,
      date,
      description,
      maxSize,
      leader,
      participants,
      status,
      meetingPoint,
      requirement,
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
    const userId = req.user._id; // Assuming user ID is available from protect middleware
    const { message } = req.body; // Optional message from the user

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if the user is already a participant (pending, confirmed, or declined)
    const existingParticipant = group.participants.find(
      (p) => p.user.toString() === userId.toString()
    );

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: "You have already requested to join or are already a member of this group.",
      });
    }

    // Add the user to participants with a 'pending' status
    group.participants.push({
      user: userId,
      status: "pending",
      message: message, // Save the message if provided
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

    participant.status = "declined"; // Or use group.participants.pull(requestId) to remove the request entirely
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
    // This aggregation pipeline is the most efficient way to get all pending requests
    const pendingRequests = await Group.aggregate([
      // Stage 1: Deconstruct the participants array into a stream of documents
      { $unwind: "$participants" },

      // Stage 2: Filter these documents to only keep those with 'pending' status
      { $match: { "participants.status": "pending" } },
      
      // Stage 3: Perform a lookup (like a join) to get the user's details
      {
        $lookup: {
          from: "users", // The name of the users collection
          localField: "participants.user",
          foreignField: "_id",
          as: "userDetails"
        }
      },

      // Stage 4: Perform a lookup to get the trail's details
      {
        $lookup: {
          from: "trails", // The name of the trails collection
          localField: "trail",
          foreignField: "_id",
          as: "trailDetails"
        }
      },
      
      // Stage 5: Deconstruct the userDetails array (lookup returns an array)
      { $unwind: "$userDetails" },
      
      // Stage 6: Deconstruct the trailDetails array (optional but good practice)
      { $unwind: { path: "$trailDetails", preserveNullAndEmptyArrays: true } },

      // Stage 7: Project (reshape) the final output to match what the frontend needs
      {
        $project: {
          _id: "$participants._id", // The unique ID of the join request itself
          message: "$participants.message",
          user: { // User information
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