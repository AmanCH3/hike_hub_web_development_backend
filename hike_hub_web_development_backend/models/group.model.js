const { request } = require("express")
const mongoose = require("mongoose")

const groupSchema = mongoose.Schema({
    title : {
        type : String ,
        required : [true , "A group must have a title"]
    } ,

    trail : {
        type : mongoose.Schema.ObjectId ,
        ref : "Trail" ,
        required : [true , "A group must be associated with a trail"],
    } ,
    date : {
        type : Date ,
        required : [true , "A group must have a date"]
    } ,
    description : {
        type : String ,
        
    },
    maxSize : {
        type : Number ,
        min : [2 , "A group must have at least 2 participants"] ,
        max : [20 , "A group cannot have more than 20 participants"],
    } ,
    leader : {
        type : mongoose.Schema.ObjectId ,
        ref : "User" ,
        required : [true , "A group must have a leader"]
    } ,
    participants : [
        {
            user : {
                type : mongoose.Schema.ObjectId ,
                ref : "User" ,
            } ,
            status : {
                type : String ,
                enum : ["pending" ,"confirmed" ,"declined"],
                default : 'pending'
            } ,
            joinedAt : {
                type : Date ,
                default : Date.now
            }
        }
    ] ,

    status : {
        type : String ,
        enum : ["upcoming" ,"active" ,"completed" , "cancelled"],
        default : "upcoming"
    } ,
    meetingPoint : {
        description : String ,

    },
    requirements :{

      type :  [String] ,
        default :[] ,
    } ,

    difficulty : {
        type : String ,
    },
    createdAt : {
        type : Date ,
        default : Date.now ,
    },
    updatedAt : {
        type : Date ,
        default : Date.now ,
    },
    photos : {

      type :  [String] ,
        default :[] ,
    } ,
    comments : [
        {
            user : {
                type : mongoose.Schema.ObjectId ,
                red : "User",
            } ,
            text : {
                type : String ,
            } ,
            createAt : {
                type : Date ,
                default : Date.now ,
            }
        }
    ]
} ,
{
    // toJSON :{virtuals : true} ,
    // toObject : {virtuals : true} ,
}

)

module.exports = mongoose.model(
    "Group" , groupSchema
)
