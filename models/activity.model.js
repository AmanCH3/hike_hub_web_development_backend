// amanch3/hike_hub_web_development_backend/hike_hub_web_development_backend-e4da1c70d1aba5bfdb7816816b4b5340bba474a6/models/activity.model.js
const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["user_joined", "group_created", "hike_joined", "hike_completed", "hike_cancelled"],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trail",
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Activity", activitySchema);