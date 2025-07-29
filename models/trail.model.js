// const mongoose = require("mongoose");
// const { trim } = require("validator");

// const trailSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     trim: true,
//     unique: true,
//   },
//   location: {
//     type: String,
 
//   },
//   distance: {
//     type: Number,
   
//   },
//   elevation: {
//     type: Number,
   
//   },
//   duration: {
//     min: {
//       type: Number,
    
//     },
//     max: {
//       type: Number,
      
//     },
//   },

//    participants: [{ // --- THIS FIELD IS ADDED ---
//     type: mongoose.Schema.ObjectId,
//     ref: "User" 
//   }],

//   difficult: {
//     type: String,
//     enum: {
//       values: ["Easy", "Moderate", "Difficult"],
//       message: "Difficuly must be either : Easy , Moderate or Difficult",
//     },
//   },

//   description: {
//     type: String,
    
//   },
//   images: [String],
//   features: [String], 
//   seasons: [String], 

//   ratings: [
//     {
//       user: {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//       },
//       rating: {
//         type: Number,
//         min: 1,
//         max: 5,
       
//       },
//       review: String,
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
//   averageRating: {
//     type: Number,
//     default: 4.5,
//     min: [1, "Rating must be at least 1.0"],
//     max: [5, "Rating cannot be more than 5.0"],

//     set: (val) => Math.round(val * 10) / 10,
//   },
//   numRatings: {
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     select: false,
//   },
//   updateAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Trail", trailSchema);

const mongoose = require("mongoose");

const trailSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "A trail must have a name."]
    },
    location: {
        type: String,
        required: [true, "A trail must have a location."]
    },
    distance: {
        type: Number,
        required: [true, "A trail must have a distance."]
    },
    elevation: {
        type: Number,
        required: [true, "A trail must have an elevation gain."]
    },
    duration: {
        min: { type: Number },
        max: { type: Number },
    },
    // ✅ Corrected typo from "difficult" to "difficulty"
    difficulty: {
        type: String,
        enum: {
            values: ["Easy", "Moderate", "Hard"], // Changed to Hard for consistency
            message: "Difficulty must be either: Easy, Moderate, or Hard",
        },
        required: [true, "A trail must have a difficulty level."]
    },
    description: {
        type: String,
        trim: true
    },
    images: [String],
    features: [String],
    seasons: [String],
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
        default: 0,
        min: [0, "Rating must be at least 0"],
        max: [5, "Rating cannot be more than 5.0"],
        set: (val) => Math.round(val * 10) / 10,
    },
    numRatings: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Trail", trailSchema);