const express = require("express");
const Checklist = require("../../models/checklist.model");

exports.createCheckList = async (req, res) => {
  try {
    const {
      user,
      name,
      experienceLevel,
      duration,
      weather,
      items,
      associatedHike,
    } = req.body;

    const checklist = new Checklist({
      user,
      name,
      experienceLevel,
      duration,
      weather,
      items,
      associatedHike,
    });

    await checklist.save();

    return res.status(200).json({
      success: true,
      message: "Checklist created successfully",
      data: checklist,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.body;

    let filters = {};
    if (search) {
      filters.$or = [
        {
          name: { $regex: search, $option: "i" },
        },
      ];
    }

    const skips = (page - 1) * limit;
    const checklist = await Checklist.find()
      .populate("checklist", "name")
      .populate("items", "name")
      .skip(skips)
      .limit(Number(limit));

    const total = await Checklist.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Data Fetched",
      data: checklist,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.cerl(total / limit),
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getCheckListById = async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: checklist,
      message: "One checklist",
    });
  } catch (err) {
    return (
      res.status(500).json *
      {
        success: false,
        message: "Server error",
      }
    );
  }
};

exports.updateCheckList = async (req, res) => {
  try {
    const checklist = await Checklist.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: checklist,
      message: "updated",
    });
  } catch (e) {
    res.status(500).json({
      Error: "server error",
    });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const result = await Checklist.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found",
      });
    }

    return res.status(200).json({
        success : true ,
        message : "updated" 
    })
  } catch (e) {
    res.status(500).json({
      Error: "server error",
    });
  }
};
