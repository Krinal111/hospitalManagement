const express = require("express");
const {
  lockSlot,
  releaseSlot,
  confirmSlot,
} = require("../controllers/slotController");
const { authenticate } = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/slots/:slotId/lock", authenticate(["patient"]), lockSlot);
router.post("/slots/:slotId/release", authenticate(["patient"]), releaseSlot);
router.post("/slots/:slotId/confirm", authenticate(["patient"]), confirmSlot);

module.exports = router;
