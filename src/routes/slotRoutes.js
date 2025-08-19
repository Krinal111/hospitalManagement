const express = require("express");
const {
  addAvailability,
  addRecurringAvailability,
  getDoctorSlots,
} = require("../controllers/availabilityController");
const router = express.Router();

router.post("/add", addAvailability);
router.post("/add-recurring", addRecurringAvailability);
router.get("/:doctorId", getDoctorSlots);

module.exports = router;
