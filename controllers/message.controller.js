const Messsage = require("../models/message.model")
    
exports.getMessageForGroup =  async (req , res) => {
    try {
        const messages = await Messsage.find({ group: req.params.groupId })
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
             message : "server error"
        })
    }
}