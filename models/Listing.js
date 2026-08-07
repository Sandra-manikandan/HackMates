const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
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

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listingType: {
      type: String,
      enum: ["SALE", "EXCHANGE", "LOST", "FOUND"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "BOOKS",
        "ELECTRONICS",
        "STATIONERY",
        "CLOTHING",
        "HOSTEL",
        "ID_CARD",
        "ACCESSORIES",
        "OTHER"
      ],
      required: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    condition: {
      type: String,
      enum: ["NEW", "LIKE_NEW", "GOOD", "FAIR", "NOT_APPLICABLE"],
      default: "NOT_APPLICABLE",
    },

    images: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    contactInfo: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "RESERVED", "SOLD", "RESOLVED", "CLOSED"],
      default: "ACTIVE",
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

module.exports = mongoose.model("Listing", listingSchema);