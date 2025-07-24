
  const Trail = require("../../models/trail.model");

  exports.createTrails = async (req, res) => {
    try {
      const filepaths = req.files ? req.files.map(file => file.path) : [];
      const {
        name,
        location,
        distance,
        elevation,
        duration,
        difficult,
        description,
        features,
        seasons,
        ratings,
        averageRatings,
        numRatings,
      } = req.body;

      const trail = new Trail({
        name,
        location,
        distance,
        elevation,
        duration,
        difficult,
        description,
        images: filepaths, 
        features,
        seasons,
        ratings,
        averageRatings,
        numRatings,
      });

      await trail.save();

      return res.status(200).json({
        success: true,
        message: "Trail created successfully",
        data: trail,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  exports.getAll = async (req, res) => {
  try {
    // 1. Destructure all possible query parameters for pagination, search, and filtering
    const {
      page = 1,
      limit = 10,
      search = "",
      maxDistance,
      maxElevation,
      maxDuration,
      difficulty,
    } = req.query;

    // 2. Initialize an empty filter object to build our query dynamically
    const filter = {};


    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Add filter for maximum distance (e.g., trails with distance <= maxDistance)
    if (maxDistance) {
      filter.distance = { $lte: Number(maxDistance) };
    }

    if (maxElevation) {
      filter.elevation = { $lte: Number(maxElevation) };
    }

  
    if (maxDuration) {
      filter["duration.max"] = { $lte: Number(maxDuration) };
    }
    if (difficulty && difficulty !== "All") {
      filter.difficult = difficulty;
    }

    // 4. Calculate pagination
    const skip = (page - 1) * limit;

    // 5. Execute the query and count total documents with the *same* filter
    const trails = await Trail.find(filter)
      .sort({ createdAt: -1 }) // Optional: sort by newest first
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Trail.countDocuments(filter);

    // 6. Return the successful response with data and pagination info
    return res.status(200).json({
      success: true,
      message: "Trail data fetched successfully",
      data: trails,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

  exports.deleteTrails = async (req, res) => {
    try {
      const trail = await Trail.findByIdAndDelete(req.params.id);

      if (!trail) {
        return res.status(404).json({
          success: false,
          message: "Trail not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Trail deleted successfully",
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  exports.getFilterOne = async (req, res) => {
    try {
      const { maxDistance, maxElevation, maxDuration, difficulty } = req.query;
      const filter = {};

      if (maxDistance) filter.distance = { $lte: Number(maxDistance) };
      if (maxElevation) filter.elevation = { $lte: Number(maxElevation) };
      if (maxDuration) filter["duration.max"] = { $lte: Number(maxDuration) };
      if (difficulty && difficulty !== "All") filter.difficult = difficulty;

      const trails = await Trail.find(filter);

      return res.status(200).json({
        success: true,
        data: trails,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  exports.joinTrails = async (req, res) => {
    try {
      const userId = req.user.id ;
      const {trailId} = req.params  ;
      const updatedTrail = await Trail.findByIdAndUpdate(
        trailId,
        { $addToSet: { participants: userId } }, 
        { new: true, runValidators: true }    
      ).populate('participants', 'name email');

      // Check if the trail existed
      if (!updatedTrail) {
        return res.status(404).json({
          message: "Trail not found",
          success: false
        });
      }
      return res.status(200).json({
        message : "Join trail successful" ,
        data : updatedTrail ,
        success : true 
      }) ;
    }
    catch (e){
      console.log(e)
      return res.status(500).json({
        success : false ,
        message : "Server error" 

      })
    }
  }



  exports.leaveTrail = async (req, res) => {
    try {
      const userId = req.user.id; 
      const {trailId} = req.params  ;
      const trail = await Trail.findById(trailId);

      if (!trail) {
        return res.status(404).json({
          success: false,
          message: "Trail not found",
        });
      }
      const updatedTrail = await Trail.findByIdAndUpdate(
        trailId,
        { $pull: { participants: userId } },
        { new: true }
      ).populate('participants', 'name email');

      return res.status(200).json({
        success: true,
        message: "Successfully left the trail",
        data: updatedTrail,
      });

    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    } 
  };

  exports.getOneTrail = async (req, res) => {
    try {
      const trail = await Trail.findById(req.params.id)
                                  .populate('participants', 'name email');  
      if (!trail) {
        return res.status(404).json({
          success: false,
          message: "Trail not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Trail fetched successfully",
        data: trail,
      });

    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  exports.updateTrails = async (req, res) => {
    try {
      const updatedData = { ...req.body };
      
      if (req.files && req.files.length > 0) {
        updatedData.images = req.files.map(file => file.path);
      }

      const trail = await Trail.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true,
      });

      if (!trail) {
        return res.status(404).json({
          success: false,
          message: "Trail not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Trail updated successfully",
        data: trail,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
