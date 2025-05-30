const  mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema (
    {
        name : {
            type : String ,
            required : [true , "Please provide your name"]
        } ,
        email : {
            type : String ,
            required : [true , "Please provide your email"] ,
            unique : true ,
            lowercase : true ,
            validate : [validator.isEmail,"Please provide a valid email"]
        } ,
        password : {
            type : String ,
            required : [true , "Please provide your email"],
            unique : true ,
            minlength : 8 ,
            select : false
        } ,

        phone : {
            type : String ,
            required : [true , "Please provide emergency contact phone"]
        } ,

        hikerType : {
            type : String ,
            enum : ["new" , "experienced"] ,
            default : "new"
        } ,

        ageGroup : {
            type : String ,
            enum :["18-24" ,"24-35" ,"35-44" , "45-54","55-64" ,"65+"] ,
            required : [true , "Please provide your age group"]
        } ,

        emergencyContact : {
            name : {
                type : String ,
                required : [true , "Please provide emergency contact name"]

            } ,
            phone : {
                type : String ,
                required : [true , "Please provide emergency contact phone"] ,
            } ,
        
        } ,
         bio : {
                type : String ,
                default : "" ,
            },
        profileImage : {
                type : String ,
                default : ""
            } ,
        joinDate : {
            type : Date ,
            default : Date.now
        } ,
        role : {
            type : String ,
            enum : ["user" , "guide" , "admin"] ,
            default : "user"
        } ,
        subscription : {
            type : String ,
            enum : ["basic" , "pro" , "premium"] ,
            default : "basic"
        } ,

        // subscriptionExpiresAt : Date ,
        // passwordChangedAt : Date ,
        // passwordResetToken : String ,
        // passwordResetExpires : Date,
        active : {
            type : Boolean ,
            default : true ,
            select : false
        } ,
        stats : {
            totalHikes : {
                type : Number ,
                default : 0
            } ,
            totalDistance : {
                type : Number ,
                default :  0
            },
            totalElevation : {
                type : Number ,
                default : 0
            } ,
            totalHours : {
                type : Number ,
                default : 0
            } ,
            hikesJoined : {
                type : Number ,
                default : 0
            } ,
            hikesLed : {
                type : Number ,
                default : 0
            }
        },

        achievements : [
            {
                type : mongoose.Schema.ObjectId,
                ref : "Achievement",
            }
        ] ,

        completedTrails : [
            {
                trail : {
                    type : mongoose.Schema.ObjectId,
                    red : "Trail"
                } ,
                completedAt : {
                    type : Date ,
                    default : Date.now
                }
            }
        ],



    } ,
    {
        timestamps : true ,
        toJSON : {virtuals : true} ,
        toObject : {virtuals : true} ,
    }
)




module.exports = mongoose.model(
    "User" , UserSchema
)