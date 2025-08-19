const express = require("express");
const { authenticate } = require("../middlewares/verifyToken");
const onboarding = require("../controllers/onboardingContoller");
const router = express.Router();

router.post("/onboarding", authenticate(["doctor"]), onboarding);

module.exports = router;
