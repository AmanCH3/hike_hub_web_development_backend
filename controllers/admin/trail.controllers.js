


const Trail = require("../../models/trail.model");

exports.createTrails = async (req, res) => {
  try {
    // Handle multiple files
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
    const {
      page = 1,
      limit = 10,
      search = "",
      maxDistance,
      maxElevation,
      maxDuration,
      difficulty,
    } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

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

    const skip = (page - 1) * limit;
    const trails = await Trail.find(filter).skip(skip).limit(Number(limit));
    const total = await Trail.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Trail data fetched successfully",
      data: trails,
      pagination: {
        total,
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

exports.getOneTrail = async (req, res) => {
  try {
    const trail = await Trail.findById(req.params.id);
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
    
    // Handle multiple files for update
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