const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      collegeName,
      collegeId,
      department,
      graduationYear,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !collegeName ||
      !collegeId ||
      !department ||
      !graduationYear
    ) {
      return res.status(400).json({
        success: false,
        message: "All registration fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const existingCollegeId = await User.findOne({
      collegeId: collegeId.trim(),
    });

    if (existingCollegeId) {
      return res.status(409).json({
        success: false,
        message: "A user with this college ID already exists",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      collegeName: collegeName.trim(),
      collegeId: collegeId.trim(),
      department: department.trim(),
      graduationYear: Number(graduationYear),
      role: "STUDENT",
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
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
    console.error("Register error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or college ID already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to register user",
    });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account has been disabled",
      });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
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
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in",
    });
  }
};

// GET /api/auth/me
const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      collegeName: req.user.collegeName,
      collegeId: req.user.collegeId,
      department: req.user.department,
      graduationYear: req.user.graduationYear,
      role: req.user.role,
      profileImage: req.user.profileImage,
      createdAt: req.user.createdAt,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};