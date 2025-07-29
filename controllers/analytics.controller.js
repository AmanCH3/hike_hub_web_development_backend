

// const User = require("../models/user.model");
// const Payment = require("../models/payment.model");
// const Cancellation = require("../models/cancellation.model");
// // Helper function to calculate percentage change safely
// const calculatePercentageChange = (current, previous) => {
//   if (previous === 0) {
//     return current > 0 ? 100 : 0;
//   }
//   return ((current - previous) / previous) * 100;
// };

// exports.getAnalytics = async (req, res) => {
//   try {
//     const now = new Date();
//     const currentYear = now.getFullYear();
//     const startOfCurrentMonth = new Date(currentYear, now.getMonth(), 1);
//     const startOfPreviousMonth = new Date(currentYear, now.getMonth() - 1, 1);

//     // --- 1. HIKE STATS (USER-CENTRIC) ---

//     // ✅ Total Completed Hikes: Sum the size of the 'completedTrails' array for all users.
//     const totalCompletedHikesResult = await User.aggregate([
//       { $project: { numCompleted: { $size: "$completedTrails" } } },
//       { $group: { _id: null, total: { $sum: "$numCompleted" } } }
//     ]);
//     const totalCompletedHikes = totalCompletedHikesResult[0]?.total || 0;

//     // ✅ Scheduled Hikes This Month: Count all items in 'joinedTrails' across all users with a date in the current month.
//     const scheduledHikesThisMonthResult = await User.aggregate([
//       { $unwind: "$joinedTrails" }, // Deconstruct the array to process each joined trail individually
//       { $match: { "joinedTrails.scheduledDate": { $gte: startOfCurrentMonth } } },
//       { $count: "count" }
//     ]);
//     const scheduledHikesThisMonth = scheduledHikesThisMonthResult[0]?.count || 0;


//     // --- 2. DATA FOR CHARTS ---
//     const userGrowth = await User.aggregate([
//       { $match: { createdAt: { $gte: new Date(currentYear, 0, 1) } } },
//       { $group: { _id: { $month: "$createdAt" }, users: { $sum: 1 } } },
//       { $sort: { _id: 1 } },
//     ]);

//     // ✅ Hike Data Chart: Count user-completed hikes per month.
//     const completedHikesByMonth = await User.aggregate([
//       { $unwind: "$completedTrails" },
//       { $match: { "completedTrails.completedAt": { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) } } },
//       { $group: { _id: { $month: "$completedTrails.completedAt" }, count: { $sum: 1 } } },
//       { $sort: { _id: 1 } }
//     ]);
    
//     // Create the final hikeData array for the chart
//     const cancelledHikesByMonth = await Cancellation.aggregate([
//         { $match: {
//             cancelledAt: { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) }
//         }},
//         { $group: { _id: { $month: "$cancelledAt" }, count: { $sum: 1 } } }
//     ]);
    
//     // Create the final hikeData array (this logic is now correct)
//     const hikeData = Array.from({ length: 12 }, (_, i) => {
//         const month = i + 1;
//         const completedData = completedHikesByMonth.find(item => item._id === month);
//         const cancelledData = cancelledHikesByMonth.find(item => item._id === month);
//         return {
//             _id: month,
//             completed: completedData?.count || 0,
//             cancelled: cancelledData?.count || 0,
//         };
//     });

//     // --- (No changes to User totals and Revenue totals logic) ---
//     const totalUsers = await User.countDocuments();
//     const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfCurrentMonth } });
//     const newUsersLastMonth = await User.countDocuments({ createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } });

//     const totalRevenueResult = await Payment.aggregate([
//         { $match: { status: 'success' } },
//         { $group: { _id: null, total: { $sum: '$amount' } } },
//     ]);
//     const totalRevenue = totalRevenueResult[0]?.total || 0;
    
//     // --- 3. COMBINE ALL DATA INTO A SINGLE RESPONSE ---
//     res.json({
//       success: true,
//       data: {
//         userGrowth,
//         hikeData,
//         summary: {
//           totalUsers: {
//             total: totalUsers,
//             percentageChange: calculatePercentageChange(newUsersThisMonth, newUsersLastMonth),
//           },
//           totalRevenue: {
//             total: totalRevenue,
//             percentageChange: 0, // You can add monthly revenue logic if needed
//           },
//           completedHikes: {
//             total: totalCompletedHikes,
//             scheduledThisMonth: scheduledHikesThisMonth,
//           },
//         }
//       },
//     });

//   } catch (error) {
//     console.error("Analytics Error:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };







const User = require("../models/user.model");
const Payment = require("../models/payment.model");
const Cancellation = require("../models/cancellation.model");

// Helper function to calculate percentage change safely
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
    // If last month had 0 revenue, any new revenue is a 100% increase.
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

exports.getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfCurrentMonth = new Date(currentYear, now.getMonth(), 1);
    const startOfPreviousMonth = new Date(currentYear, now.getMonth() - 1, 1);

    // --- 1. HIKE STATS (USER-CENTRIC) ---
    const totalCompletedHikesResult = await User.aggregate([
      { $project: { numCompleted: { $size: "$completedTrails" } } },
      { $group: { _id: null, total: { $sum: "$numCompleted" } } }
    ]);
    const totalCompletedHikes = totalCompletedHikesResult[0]?.total || 0;

    const scheduledHikesThisMonthResult = await User.aggregate([
      { $unwind: "$joinedTrails" },
      { $match: { "joinedTrails.scheduledDate": { $gte: startOfCurrentMonth } } },
      { $count: "count" }
    ]);
    const scheduledHikesThisMonth = scheduledHikesThisMonthResult[0]?.count || 0;

    // --- 2. DATA FOR CHARTS ---
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(currentYear, 0, 1) } } },
      { $group: { _id: { $month: "$createdAt" }, users: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const completedHikesByMonth = await User.aggregate([
      { $unwind: "$completedTrails" },
      { $match: { "completedTrails.completedAt": { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) } } },
      { $group: { _id: { $month: "$completedTrails.completedAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const cancelledHikesByMonth = await Cancellation.aggregate([
        { $match: {
            cancelledAt: { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) }
        }},
        { $group: { _id: { $month: "$cancelledAt" }, count: { $sum: 1 } } }
    ]);
    
    const hikeData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const completedData = completedHikesByMonth.find(item => item._id === month);
        const cancelledData = cancelledHikesByMonth.find(item => item._id === month);
        return {
            _id: month,
            completed: completedData?.count || 0,
            cancelled: cancelledData?.count || 0,
        };
    });

    // --- 3. USER & REVENUE STATS ---
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfCurrentMonth } });
    const newUsersLastMonth = await User.countDocuments({ createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } });

    // Get all-time revenue for the summary card's main number
    const allTimeRevenueResult = await Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = allTimeRevenueResult[0]?.total || 0;
    
    // Get revenue for the current and previous months specifically for the percentage calculation
    const revenueThisMonthResult = await Payment.aggregate([
      { $match: { status: 'success', createdAt: { $gte: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const revenueLastMonthResult = await Payment.aggregate([
      { $match: { status: 'success', createdAt: { $gte: startOfPreviousMonth, $lt: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenueThisMonth = revenueThisMonthResult[0]?.total || 0;
    const totalRevenueLastMonth = revenueLastMonthResult[0]?.total || 0;
    
    // --- 4. COMBINE ALL DATA INTO A SINGLE RESPONSE ---
    res.json({
      success: true,
      data: {
        userGrowth,
        hikeData,
        summary: {
          totalUsers: {
            total: totalUsers,
            percentageChange: calculatePercentageChange(newUsersThisMonth, newUsersLastMonth),
          },
          totalRevenue: {
            total: totalRevenue,
            percentageChange: calculatePercentageChange(totalRevenueThisMonth, totalRevenueLastMonth),
          },
          completedHikes: {
            total: totalCompletedHikes,
            scheduledThisMonth: scheduledHikesThisMonth,
          },
        }
      },
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};