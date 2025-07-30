const mongoose = require("mongoose");

const cancellationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  trail: {
    type: mongoose.Schema.ObjectId,
    ref: "Trail",
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  cancelledAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Cancellation", cancellationSchema);