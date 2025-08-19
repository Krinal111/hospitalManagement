const express = require("express");
const { authenticate } = require("../middlewares/verifyToken");
const {
  lockSlot,
  confirmBooking,
  releaseExpired,
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
module.exports = router;
