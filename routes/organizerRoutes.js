const express = require("express");

const {
  applyForOrganizer,
  getMyOrganizerRequest,
  getOrganizerRequests,
  approveOrganizerRequest,
  rejectOrganizerRequest,
} = require("../controllers/organizerController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/apply",
  protect,
  applyForOrganizer
);

router.get(
  "/my-request",
  protect,
  getMyOrganizerRequest
);

router.get(
  "/requests",
  protect,
  allowRoles("ADMIN"),
  getOrganizerRequests
);

router.patch(
  "/requests/:id/approve",
  protect,
  allowRoles("ADMIN"),
  approveOrganizerRequest
);

router.patch(
  "/requests/:id/reject",
  protect,
  allowRoles("ADMIN"),
  rejectOrganizerRequest
);

module.exports = router;