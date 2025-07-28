const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your name"]
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"]
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true
        },

        password: {
            type: String,
            required: [
                function() { return !this.googleId; },
                'Please provide a password' 
            ],
            minlength: 8,
            select: false 
        },

        phone: {
            type: String,
            required: [
                function() { return !this.googleId; },
                'Please provide a phone number' // Custom error message
            ]
        },


        hikerType: {
            type: String,
            enum: ["new", "experienced"],
            default: "new"
        },
        ageGroup: {
            type: String,
            enum: ["18-24", "24-35", "35-44", "45-54", "55-64", "65+"],
        },
        emergencyContact: {
            name: {
                type: String,
            },
            phone: {
                type: String,
            },
        },
        bio: {
            type: String,
            default: "",
        },
        profileImage: {
            type: String,
            default: ""
        },
        joinDate: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ["user", "guide", "admin"],
            default: "user"
        },
        subscription: {
            type: String,
            enum: ["basic", "pro", "premium"],
            default: "basic"
        },
        active: {
            type: Boolean,
            default: true,
            select: false
        },
        stats: {
            totalHikes: { type: Number, default: 0 },
            totalDistance: { type: Number, default: 0 },
            totalElevation: { type: Number, default: 0 },
            totalHours: { type: Number, default: 0 },
            hikesJoined: { type: Number, default: 0 },
            hikesLed: { type: Number, default: 0 }
        },
        achievements: [{
            type: mongoose.Schema.ObjectId,
            ref: "Achievement",
        }],
        completedTrails: [{
            trail: {
                type: mongoose.Schema.ObjectId,
                ref: "Trail" // Corrected 'red' to 'ref'
            },
            completedAt: {
                type: Date,
                default: Date.now
            }
        }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
module.exports = mongoose.model("User", UserSchema);