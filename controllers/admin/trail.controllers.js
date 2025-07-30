// const Trail = require("../../models/trail.model");
// const User = require("../../models/user.model");
// const Cancellation = require("../../models/cancellation.model");
// // ✅ 1. REMOVED THE ACTIVITY MODEL IMPORT

// exports.createTrails = async (req, res) => {
//   try {
//     const filepaths = req.files ? req.files.map(file => file.path) : [];
//     const trail = new Trail({
//       ...req.body,
//       images: filepaths,
//     });
//     await trail.save();
//     return res.status(201).json({
//       success: true,
//       message: "Trail created successfully",
//       data: trail,
//     });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ success: false, message: "Server error while creating trail." });
//   }
// };

// exports.getAll = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = "", maxDistance, maxElevation, maxDuration, difficulty } = req.query;
//     const filter = {};
//     if (search) filter.name = { $regex: search, $options: "i" };
//     if (maxDistance) filter.distance = { $lte: Number(maxDistance) };
//     if (maxElevation) filter.elevation = { $lte: Number(maxElevation) };
//     if (maxDuration) filter["duration.max"] = { $lte: Number(maxDuration) };
//     if (difficulty && difficulty !== "All") filter.difficult = difficulty;

//     const skip = (page - 1) * limit;
//     const trails = await Trail.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
//     const total = await Trail.countDocuments(filter);

//     return res.status(200).json({
//       success: true,
//       message: "Trail data fetched successfully",
//       data: trails,
//       pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
//     });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ success: false, message: "Server error while fetching trails." });
//   }
// };

// exports.getOneTrail = async (req, res) => {
//   try {
//     const trail = await Trail.findById(req.params.id);
//     if (!trail) {
//       return res.status(404).json({ success: false, message: "Trail not found" });
//     }
//     return res.status(200).json({ success: true, message: "Trail fetched successfully", data: trail });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ success: false, message: "Server error while fetching trail." });
//   }
// };

// exports.updateTrails = async (req, res) => {
//   try {
//     const updatedData = { ...req.body };
//     if (req.files && req.files.length > 0) {
//       updatedData.images = req.files.map(file => file.path);
//     }
//     const trail = await Trail.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
//     if (!trail) {
//       return res.status(404).json({ success: false, message: "Trail not found" });
//     }
//     return res.status(200).json({ success: true, message: "Trail updated successfully", data: trail });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ success: false, message: "Server error while updating trail." });
//   }
// };

// exports.deleteTrails = async (req, res) => {
//   try {
//     const trail = await Trail.findByIdAndDelete(req.params.id);
//     if (!trail) {
//       return res.status(404).json({ success: false, message: "Trail not found" });
//     }
//     return res.status(200).json({ success: true, message: "Trail deleted successfully" });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ success: false, message: "Server error while deleting trail." });
//   }
// };

// exports.joinTrailWithDate = async (req, res) => {
//   try {
//     const { scheduledDate } = req.body;
//     if (!scheduledDate) {
//       return res.status(400).json({ success: false, message: "A scheduled date is required to join a hike." });
//     }

//     const user = await User.findById(req.user.id);
//     const trail = await Trail.findById(req.params.id);

//     if (!trail) {
//       return res.status(404).json({ success: false, message: "Trail not found." });
//     }

//     const alreadyJoined = user.joinedTrails.some(t => t.trail.equals(trail._id));
//     if (alreadyJoined) {
//       return res.status(400).json({ success: false, message: "You have already scheduled this hike." });
//     }

//     user.joinedTrails.push({ trail: trail._id, scheduledDate });
//     await user.save();

//     res.status(200).json({ 
//         success: true, 
//         message: `Successfully scheduled '${trail.name}' for your upcoming hikes!` 
//     });

//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: "Server error while scheduling hike." });
//   }
// };

// exports.completeTrail = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate('joinedTrails.trail');
//     const { joinedTrailId } = req.params;

//     const trailToComplete = user.joinedTrails.find(t => t._id.equals(joinedTrailId));

//     if (!trailToComplete) {
//       return res.status(404).json({ success: false, message: "Scheduled hike not found in your list." });
//     }

//     const trailDetails = trailToComplete.trail;

//     // Update stats
//     user.stats.totalHikes += 1;
//     user.stats.totalDistance += trailDetails.distance || 0;
//     user.stats.totalElevation += trailDetails.elevation || 0;
//     const durationHours = trailDetails.duration?.max || (trailDetails.distance / 4);
//     user.stats.totalHours += durationHours;

//     // Move from joined to completed
//     user.completedTrails.push({ trail: trailDetails._id, completedAt: new Date() });
//     user.joinedTrails = user.joinedTrails.filter(t => !t._id.equals(joinedTrailId));

//     await user.save();

//     // ✅ 2. REMOVED ACTIVITY LOGGING BLOCK
    
//     res.status(200).json({ 
//       success: true, 
//       message: `Congratulations on completing '${trailDetails.name}'! Your stats have been updated.`,
//       data: user 
//     });

//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: "Server error while completing hike." });
//   }
// };


// exports.cancelJoinedTrail = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     const { joinedTrailId } = req.params;

//     const trailToCancel = user.joinedTrails.find(t => t._id.equals(joinedTrailId));

//     if (!trailToCancel) {
//       return res.status(404).json({ success: false, message: "Scheduled hike not found in your list." });
//     }

//     // Step 1: Log the cancellation in the new collection
//     await Cancellation.create({
//       user: user._id,
//       trail: trailToCancel.trail,
//       scheduledDate: trailToCancel.scheduledDate,
//     });

//     // Step 2: Remove the hike from the user's personal list
//     user.joinedTrails.pull({ _id: joinedTrailId });
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: `Your scheduled hike has been cancelled.`
//     });

//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ success: false, message: "Server error while cancelling hike." });
//   }
// };





const Trail = require("../../models/trail.model");
const User = require("../../models/user.model");
const Cancellation = require("../../models/cancellation.model");
const Activity = require("../../models/activity.model");

exports.createTrails = async (req, res) => {
  try {
    const filepaths = req.files ? req.files.map(file => file.path) : [];
    const trail = new Trail({
      ...req.body,
      images: filepaths,
    });
    await trail.save();
    return res.status(201).json({
      success: true,
      message: "Trail created successfully",
      data: trail,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error while creating trail." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", maxDistance, maxElevation, maxDuration, difficulty } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (maxDistance) filter.distance = { $lte: Number(maxDistance) };
    if (maxElevation) filter.elevation = { $lte: Number(maxElevation) };
    if (maxDuration) filter["duration.max"] = { $lte: Number(maxDuration) };
    if (difficulty && difficulty !== "All") filter.difficult = difficulty;

    const skip = (page - 1) * limit;
    const trails = await Trail.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Trail.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Trail data fetched successfully",
      data: trails,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error while fetching trails." });
  }
};

exports.getOneTrail = async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.id);
    if (!trail) {
      return res.status(404).json({ success: false, message: "Trail not found" });
    }
    return res.status(200).json({ success: true, message: "Trail fetched successfully", data: trail });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error while fetching trail." });
  }
};

exports.updateTrails = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.path);
    }
    const trail = await Trail.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    if (!trail) {
      return res.status(404).json({ success: false, message: "Trail not found" });
    }
    return res.status(200).json({ success: true, message: "Trail updated successfully", data: trail });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error while updating trail." });
  }
};

exports.deleteTrails = async (req, res) => {
  try {
    const trail = await Trail.findByIdAndDelete(req.params.id);
    if (!trail) {
      return res.status(404).json({ success: false, message: "Trail not found" });
    }
    return res.status(200).json({ success: true, message: "Trail deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Server error while deleting trail." });
  }
};


exports.joinTrailWithDate = async (req, res) => {
  try {
    const { scheduledDate } = req.body;
    if (!scheduledDate) {
      return res.status(400).json({ success: false, message: "A scheduled date is required to join a hike." });
    }

    const user = await User.findById(req.user.id);
    const trail = await Trail.findById(req.params.id);

    if (!trail) {
      return res.status(404).json({ success: false, message: "Trail not found." });
    }

    const alreadyJoined = user.joinedTrails.some(t => t.trail.equals(trail._id));
    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: "You have already scheduled this hike." });
    }

    user.joinedTrails.push({ trail: trail._id, scheduledDate });
    await user.save();

    await Activity.create({
      type: "hike_joined",
      user: user._id,
      trail: trail._id
    });

    res.status(200).json({ 
        success: true, 
        message: `Successfully scheduled '${trail.name}' for your upcoming hikes!` 
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error while scheduling hike." });
  }
};

exports.completeTrail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('joinedTrails.trail');
    const { joinedTrailId } = req.params;

    const trailToComplete = user.joinedTrails.find(t => t._id.equals(joinedTrailId));

    if (!trailToComplete) {
      return res.status(404).json({ success: false, message: "Scheduled hike not found in your list." });
    }

    const trailDetails = trailToComplete.trail;

    user.stats.totalHikes += 1;
    user.stats.totalDistance += trailDetails.distance || 0;
    user.stats.totalElevation += trailDetails.elevation || 0;
    const durationHours = trailDetails.duration?.max || (trailDetails.distance / 4);
    user.stats.totalHours += durationHours;

    user.completedTrails.push({ trail: trailDetails._id, completedAt: new Date() });
    user.joinedTrails = user.joinedTrails.filter(t => !t._id.equals(joinedTrailId));

    await user.save();

    await Activity.create({
      type: "hike_completed",
      user: user._id,
      trail: trailDetails._id
    });

    res.status(200).json({ 
      success: true, 
      message: `Congratulations on completing '${trailDetails.name}'! Your stats have been updated.`,
      data: user 
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error while completing hike." });
  }
};

exports.cancelJoinedTrail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { joinedTrailId } = req.params;

    const trailToCancel = user.joinedTrails.find(t => t._id.equals(joinedTrailId));

    if (!trailToCancel) {
      return res.status(404).json({ success: false, message: "Scheduled hike not found in your list." });
    }

    await Cancellation.create({
      user: user._id,
      trail: trailToCancel.trail,
      scheduledDate: trailToCancel.scheduledDate,
    });

    user.joinedTrails.pull({ _id: joinedTrailId });
    await user.save();

    await Activity.create({
      type: "hike_cancelled",
      user: user._id,
      trail: trailToCancel.trail
    });

    res.status(200).json({
      success: true,
      message: `Your scheduled hike has been cancelled.`
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error while cancelling hike." });
  }
};