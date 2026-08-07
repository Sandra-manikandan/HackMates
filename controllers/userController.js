const User = require("../models/User");

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        collegeId: user.collegeId,
        department: user.department,
        graduationYear: user.graduationYear,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve profile",
    });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "collegeName",
      "department",
      "graduationYear",
      "profileImage",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.name) {
      updates.name = updates.name.trim();
    }

    if (updates.collegeName) {
      updates.collegeName = updates.collegeName.trim();
    }

    if (updates.department) {
      updates.department = updates.department.trim();
    }

    if (updates.graduationYear !== undefined) {
      updates.graduationYear = Number(updates.graduationYear);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        collegeName: user.collegeName,
        collegeId: user.collegeId,
        department: user.department,
        graduationYear: user.graduationYear,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};