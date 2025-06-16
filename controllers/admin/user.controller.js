const express = require('express')
const User = require('../../models/user.model')


exports.updateUserRole = async (req ,res) => {
    const{userToUpdate} = req.params
    const{newRoles} = req.body ;
    
    if(!['user' , 'guide' ,'admin'].includes(newRoles)){
        return res.status(400).json({
            success : false ,
            message :  "Invalid role specifed ." 
        })
    }

    try {
        const userToUpdate = await User.findById(userToUpdate) ;
        if(!userToUpdate){
            return res.status(404).json({
                success : false ,
                message : "User to update not found"
            })
        }
        await userToUpdate.save() ;

        return res.status(200).json({
            success : true ,
            message : `User ${userToUpdate.name}'s role to updated to ${newRoles}.` ,
            data : {
                _id : userToUpdate._id ,
                name : userToUpdate.name ,
                email : userToUpdate.email ,
                role : userToUpdate.role,
            }
        })

    }
    catch(e){
        console.log("Error updating user role" , e) ;
        return res.status(500).json({
            success : false ,
            message : "Server issue"
        })
    }
}