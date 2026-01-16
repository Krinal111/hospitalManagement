const express = require("express");
const { authenticate } = require("../middlewares/verifyToken");
const {
  lockSlot,
  confirmBooking,
  releaseExpired,
  getMyAppointments,
} = require("../controllers/appointmentController");
const {
  cancelAppointment,
  rescheduleAppointment,
} = require("../controllers/resheduleController");
const router = express.Router();

router.post("/lock", authenticate(["patient"]), lockSlot);
router.post("/confirm", authenticate(["patient"]), confirmBooking);
router.post("/release-expired", authenticate(["admin"]), releaseExpired);
router.post(
  "/:appointmentId/cancel",
  authenticate(["patient"]),
  cancelAppointment
);

router.post(
  "/:appointmentId/reschedule",
  authenticate(["patient"]),
  rescheduleAppointment
);

// Patient dashboard
router.get("/me", authenticate(["patient"]), getMyAppointments);
module.exports = router;
