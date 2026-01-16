const express = require("express");
const { authenticate } = require("../middlewares/verifyToken");
const {
  addAvailability,
  addRecurringAvailability,
  getDoctorSlots,
} = require("../controllers/availabilityController");
const router = express.Router();

// Only doctors can edit their availability
router.post("/add", authenticate(["doctor"]), addAvailability);
router.post(
  "/add-recurring",
  authenticate(["doctor"]),
  addRecurringAvailability
);

// Anyone can view a doctor's slots
router.get("/:doctorId", getDoctorSlots);

module.exports = router;
