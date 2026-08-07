const mongoose = require("mongoose");
const OrganizerRequest = require("../models/OrganizerRequest");
const User = require("../models/User");

// POST /api/organizers/apply
const applyForOrganizer = async (req, res) => {
  try {
    const { organizationName, reason, proofUrl } = req.body;

    if (!organizationName || !reason) {
      return res.status(400).json({
        success: false,
        message: "Organization name and reason are required",
      });
    }

    if (req.user.role === "ORGANIZER") {
      return res.status(400).json({
        success: false,
        message: "You are already an organizer",
      });
    }

    if (req.user.role === "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts do not need organizer approval",
      });
    }

    const existingPendingRequest =
      await OrganizerRequest.findOne({
        applicant: req.user._id,
        status: "PENDING",
      });

    if (existingPendingRequest) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending organizer request",
      });
    }

    const organizerRequest =
      await OrganizerRequest.create({
        applicant: req.user._id,
        organizationName: organizationName.trim(),
        reason: reason.trim(),
        proofUrl: proofUrl?.trim() || "",
      });

    await organizerRequest.populate(
      "applicant",
      "name email collegeName department role"
    );

    return res.status(201).json({
      success: true,
      message: "Organizer request submitted successfully",
      organizerRequest,
    });
  } catch (error) {
    console.error("Apply organizer error:", error);

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
      message: "Unable to submit organizer request",
    });
  }
};

// GET /api/organizers/my-request
const getMyOrganizerRequest = async (req, res) => {
  try {
    const organizerRequest =
      await OrganizerRequest.findOne({
        applicant: req.user._id,
      })
        .sort({ createdAt: -1 })
        .populate(
          "applicant",
          "name email collegeName department role"
        )
        .populate("reviewedBy", "name email");

    return res.status(200).json({
      success: true,
      organizerRequest,
    });
  } catch (error) {
    console.error("Get my organizer request error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve organizer request",
    });
  }
};

// GET /api/organizers/requests
const getOrganizerRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      const normalizedStatus =
        req.query.status.toUpperCase();

      const allowedStatuses = [
        "PENDING",
        "APPROVED",
        "REJECTED",
      ];

      if (!allowedStatuses.includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid organizer request status",
        });
      }

      filter.status = normalizedStatus;
    }

    const requests = await OrganizerRequest.find(filter)
      .populate(
        "applicant",
        "name email collegeName collegeId department role"
      )
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get organizer requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve organizer requests",
    });
  }
};

// PATCH /api/organizers/requests/:id/approve
const approveOrganizerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNote } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organizer request ID",
      });
    }

    const request = await OrganizerRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Organizer request not found",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status.toLowerCase()}`,
      });
    }

    const applicant = await User.findById(request.applicant);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant user not found",
      });
    }

    request.status = "APPROVED";
    request.reviewedBy = req.user._id;
    request.reviewNote = reviewNote?.trim() || "";

    await request.save();

    applicant.role = "ORGANIZER";
    await applicant.save();

    await request.populate(
      "applicant",
      "name email collegeName department role"
    );

    await request.populate(
      "reviewedBy",
      "name email"
    );

    return res.status(200).json({
      success: true,
      message: "Organizer request approved successfully",
      organizerRequest: request,
    });
  } catch (error) {
    console.error("Approve organizer request error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to approve organizer request",
    });
  }
};

// PATCH /api/organizers/requests/:id/reject
const rejectOrganizerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNote } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid organizer request ID",
      });
    }

    const request = await OrganizerRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Organizer request not found",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status.toLowerCase()}`,
      });
    }

    request.status = "REJECTED";
    request.reviewedBy = req.user._id;
    request.reviewNote =
      reviewNote?.trim() || "Request rejected";

    await request.save();

    await request.populate(
      "applicant",
      "name email collegeName department role"
    );

    await request.populate(
      "reviewedBy",
      "name email"
    );

    return res.status(200).json({
      success: true,
      message: "Organizer request rejected successfully",
      organizerRequest: request,
    });
  } catch (error) {
    console.error("Reject organizer request error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reject organizer request",
    });
  }
};

module.exports = {
  applyForOrganizer,
  getMyOrganizerRequest,
  getOrganizerRequests,
  approveOrganizerRequest,
  rejectOrganizerRequest,
};