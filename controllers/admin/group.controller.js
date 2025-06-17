const express = require("express") ;
const Group = require("../../models/group.model")

exports.createGroups = async (req, res) => {
    try{
        const {
            title ,
            trail ,
            date ,
            description ,
            maxSize ,
            leader ,
            participants,
            status ,
            meetingPoint ,
            requirement ,
            difficulty ,
            photos ,
            comments 

        } = req.body ;

        const group = new Group({
            title : title ,
            trail ,
            date ,
            description ,
            maxSize ,
            leader ,
            participants ,
            status ,
            meetingPoint ,
            requirement ,
            difficulty ,
            photos ,
            comments

        }) ;

        await group.save() ;

        return res.status(200).json({
            success : true ,
            message : "Group created successfully" ,
            data : group
        })

    }
    catch (e){
        return res.status(500).json({
            success : false ,
            message : "Server error"
        })

    }
}


exports.getAll = async (req, res) => {
    try {
        const {page = 1 , limit = 10 , search = ""} = req.query

        let filters = {}
        if(search) {
            filters.$or = [
                {
                    name : {$regex : search , $option : "i"}
                }
            ]
        }

        const skips =(page -1) * limit ;

        const groups = await Group.find()
        .populate("trail" , "name")
        .populate('participants' , 'user')
        .skip(skips)
        .limit(Number(limit))

        const total = await Group.countDocuments(filters)

        return res.status(200).json({
            success : true ,
            message : "Data fetched" ,
            data  : groups ,
            pagination : {
                total ,
                page : Number(page) ,
                limit : Number(limit) ,
                totalPages : Math.ceil(total / limit) 
            }
        })

    }
    catch(e){
        res.status(500).json({
            success : "false " ,
            message : "Server error"
         })
    }
}


exports.getGroupById = async (req,res) => {
    try{
        const group = await Group.findById(req.params.id) ;
        if(!group){
            return res.status(404).json({
                success : false ,
                message : "Group not found"
            })
        }
        return res.status(200).json({
            success : true ,
            data : group ,
            message : "One Group"
        })

    }
    catch(err){
        return res.status(500).json({
            success : false ,
            message : "Server error"
        })
    }
}


//update a group
exports.updateGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(
            req.params.id ,
            {name : req.body.name} ,
            {new : true}
        )

        if(!group){
            return res.status(404).json({
                success : false ,
                message : "Group Not Found"
            }) ;
        }

        return res.json({
            success : true ,
            data :group ,
            message : "updated"
        })

    }
    catch(e){
        res.status(500).json({
            Error : "server error"
        }) ;
    }
}


exports.deletegroup = async (req,res) => {
    try {
        const result = await Group.findByIdAndDelete(req.params.id) ;
         if(!result){
            return res.status(404).json({
                success : false ,
                message : "Group Not Found"
            }) ;
        }

        return res.json({
            success : true ,
            message : "Deleted"
        })

    }
    catch(err){
        return res.status(500).json({
            success : false ,
            message : "Server Error"
        })
    }
}