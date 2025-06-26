const Message = require("../models/message.model")
    
exports.getMessageForGroup =  async (req , res) => {
    try {
        const messages = await Message.find({ group: req.params.groupId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: "asc" });
      return res.status(200).json({
      success: true,
      data: messages,
    });


    }
    catch(e){

        return res.status(500).json({
            success : false ,
             message : "Server error while fetching messages."
        })
    }
}