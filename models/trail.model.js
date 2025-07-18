const mongoose = require("mongoose");
const { trim } = require("validator");

const trailSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
  },
  location: {
    type: String,
 
  },
  distance: {
    type: Number,
   
  },
  elevation: {
    type: Number,
   
  },
  duration: {
    min: {
      type: Number,
    
    },
    max: {
      type: Number,
      
    },
  },

   participants: [{
    type: mongoose.Schema.ObjectId,
    ref: "User" 
  }],

  difficult: {
    type: String,
    enum: {
      values: ["Easy", "Moderate", "Difficult"],
      message: "Difficuly must be either : Easy , Moderate or Difficult",
    },
  },

  description: {
    type: String,
    
  },
  images: [String],
  features: [String], // ['Waterfall' , "lake" , "forest" , 'mountain views']
  seasons: [String], // ['Spring' ,'Summer' , 'fall' , 'winter']

  ratings: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
       
      },
      review: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be at least 1.0"],
    max: [5, "Rating cannot be more than 5.0"],

    set: (val) => Math.round(val * 10) / 10,
  },
  numRatings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Trail", trailSchema);
