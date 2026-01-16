const express = require("express");
const { authenticate } = require("../middlewares/verifyToken");
const onboarding = require("../controllers/onboardingContoller");
const { getDoctors, getMe } = require("../controllers/doctorController");
const router = express.Router();

// Doctor discovery for patients
router.get("/discover", getDoctors);

// Doctor onboarding/profile
router.post("/onboarding", authenticate(["doctor"]), onboarding);

// Current doctor info
router.get("/me", authenticate(["doctor"]), getMe);

module.exports = router;
