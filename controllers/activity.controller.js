// const User = require("../models/user.model");
// const Group = require("../models/group.model");

// exports.getRecentActivities = async (req, res) => {
//   try {
//     // Get the 5 most recent user registrations
//     const recentUsers = await User.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .select("name createdAt profileImage");

//     // Get the 5 most recent group creations
//     const recentGroups = await Group.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("leader", "name profileImage")
//       .populate("trail", "name");

//     // Format user activities
//     const userActivities = recentUsers.map(user => ({
//       id: user._id,
//       type: 'user_joined',
//       user: user.name,
//       avatar: user.profileImage,
//       trail: null, // ✅ Set to null as there's no specific trail/group associated
//       time: user.createdAt,
//     }));

//     // Format group activities
//     const groupActivities = recentGroups.map(group => ({
//       id: group._id,
//       type: 'group_created',
//       user: group.leader.name,
//       avatar: group.leader.profileImage,
//       trail: group.trail.name, // ✅ Simplified to just the trail name
//       time: group.createdAt,
//     }));

//     // Combine, sort by time, and get the latest 5 activities
//     const combinedActivities = [...userActivities, ...groupActivities]
//       .sort((a, b) => new Date(b.time) - new Date(a.time))
//       .slice(0, 5);

//     res.json({
//       success: true,
//       data: combinedActivities,
//     });
//   } catch (error) {
//     console.error("Error fetching recent activities:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };







const User = require("../models/user.model");
const Group = require("../models/group.model");
const Activity = require("../models/activity.model");

exports.getRecentActivities = async (req, res) => {
  try {
    console.log("Fetching recent activities...");

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name createdAt profileImage");
    console.log(`Found ${recentUsers.length} recent users.`);

    const recentGroups = await Group.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("leader", "name profileImage")
      .populate("trail", "name");
    console.log(`Found ${recentGroups.length} recent groups.`);

    const recentHikeActivities = await Activity.find({
      type: { $in: ["hike_joined", "hike_completed", "hike_cancelled"] }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name profileImage")
      .populate("trail", "name");
    console.log(`Found ${recentHikeActivities.length} recent hike activities.`);

    const userActivities = recentUsers.map(user => ({
      id: user._id,
      type: 'user_joined',
      user: user.name,
      avatar: user.profileImage,
      trail: null,
      time: user.createdAt,
    }));

    const groupActivities = recentGroups.map(group => ({
      id: group._id,
      type: 'group_created',
      user: group.leader.name,
      avatar: group.leader.profileImage,
      trail: group.trail.name,
      time: group.createdAt,
    }));

    const hikeActivities = recentHikeActivities.map(activity => ({
      id: activity._id,
      type: activity.type,
      user: activity.user.name,
      avatar: activity.user.profileImage,
      trail: activity.trail?.name || null,
      time: activity.createdAt,
    }));

    const combinedActivities = [...userActivities, ...groupActivities, ...hikeActivities]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    console.log(`Returning ${combinedActivities.length} combined activities to the frontend.`);

    res.json({ success: true, data: combinedActivities });

  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};