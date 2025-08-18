const express = require("express");
const { authenticate } = require("../middlewares/verifyToken");
const onboarding = require("../controllers/onboardingContoller");
const {
  searchDoctors,
  doctorSlots,
} = require("../controllers/doctorController");
const router = express.Router();

router.post("/onboarding", authenticate(["doctor"]), onboarding);

router.get("/search", authenticate(["patient"]), searchDoctors);
router.get("/:doctorId/slots", authenticate(["patient"]), doctorSlots);

module.exports = router;
