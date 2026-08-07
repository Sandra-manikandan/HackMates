const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    resourceType: {
      type: String,
      enum: [
        "NOTES",
        "QUESTION_PAPER",
        "LAB_MANUAL",
        "PROJECT",
        "REFERENCE",
        "OTHER"
      ],
      required: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isApproved: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("Resource", resourceSchema);