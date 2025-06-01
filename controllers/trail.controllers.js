const express = require("express");
const Trail = require("../models/trail.model");

exports.createTrails = async (req, res) => {
  try {
    const {
      name,
      location,
      distance,
      elevation,
      duration,
      difficult,
      description,
      images,
      features,
      seasons,
      ratings,
      averageRatings,
      numRatings,
    } = req.body;

    const trail = new Trail({
      name: name,
      location: location,
      distance: distance,
      elevation: elevation,
      duration: duration,
      distance: distance,
      difficult: difficult,
      description: description,
      images: images,
      features: features,
      seasons: seasons,
      ratings: ratings,
      averageRatings: averageRatings,
      numRatings: numRatings,
    });

    await trail.save();

    return res.status(200).json({
      success: true,
      message: "Trail created successfully",
      data: trail,
    });
  } catch (e) {
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
    let filter = {};
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $option: "i",
          },
        },
      ];
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

    const trail = await Trail.find(filter)
      .populate("_id", "name")
      .skip(skip)
      .limit(Number(limit));

    const total = await Trail.countDocuments(filter);
    return res.status(200).json({
      success: true,
      message: "Trail data fetched succesfully",
      data: trail,
      pagination: {
        total,
        limit: Number(limit),
        totalPages: Math.ceil(total / limit), //ceil -> rounds number
      },
    });
  } catch (e) {
    console.log(e)
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
        message: "Trails not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Trails fetched succesfully",
      data: trail,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateTrails = async (req, res) => {
  try {
    const trail = await Trail.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    );

    if (!trail) {
      return res.status(404).json({
        success: false,
        message: "Trail not found",
      });
    }
  } catch (e) {
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
        message: "Trails not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trail deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Deleted Trail",
    });
  }
};

exports.getFilterOne = async (req, res) => {
  try {
    const { maxDistance, maxElevation, maxDuration, difficulty } = req.query;

    let filter = {};

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

    const trails = await Trail.find(filter);

    res.status(200).json({
      success: true,
      data: trails,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
