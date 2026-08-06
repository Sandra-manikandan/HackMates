const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "TECHNICAL",
        "CULTURAL",
        "SPORTS",
        "WORKSHOP",
        "HACKATHON",
        "SEMINAR",
        "OTHER"
      ],
      required: true,
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collegeName: {
      type: String,
      required: true,
      trim: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    registrationLink: {
      type: String,
      default: "",
    },

    posterUrl: {
      type: String,
      default: "",
    },

    isFree: {
      type: Boolean,
      default: true,
    },

    fee: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "CANCELLED"],
      default: "PUBLISHED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);