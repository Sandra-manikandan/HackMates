const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    domains: {
      type: [String],
      default: [],
    },

    availability: {
      type: String,
      enum: ["AVAILABLE", "LIMITED", "UNAVAILABLE"],
      default: "AVAILABLE",
    },

    contactMethod: {
      type: String,
      enum: ["EMAIL", "PHONE", "LINKEDIN"],
      default: "EMAIL",
    },

    contactValue: {
      type: String,
      required: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);