const express = require("express");
const {
  listMine,
  reschedule,
  cancel,
} = require("../controllers/appointmentController");
const { authenticate } = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/me/appointments", authenticate(["patient"]), listMine);
router.post(
  "/appointments/:id/reschedule",
  authenticate(["patient"]),
  reschedule
);
router.post("/appointments/:id/cancel", authenticate(["patient"]), cancel);

module.exports = router;
