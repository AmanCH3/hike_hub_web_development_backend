const Step = require("../models/step.models")

exports.saveSteps = async (req , res) => {
    const {userId , trailId  , steps} = req.body 

    if (!userId || !trailId || steps  === undefined){
        return res.status(400).json({
            success : false ,
            message : 'Missing Field'
        })
    }
    try {
        const step = new Step ({userId , trailId , steps}) ;
        await step.save() ;
        return res.status(200).json({
            success : true ,
            message : 'Step save successfully'
        })
    }
    catch(e){
        return res.status(500).json({
            success : false , 
            message : " Server error "
        })
    }
}

exports.getTotalStepsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Step.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalSteps: { $sum: '$steps' } } }
    ]);

    return res.status(200).json({
      success: true,
      totalSteps: result[0]?.totalSteps || 0,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
