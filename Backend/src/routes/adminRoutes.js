const express = require("express");
const {
  approveDoctor,
  getAllPendingDoctors,
} = require("../controllers/adminController");
const { authenticate } = require("../middlewares/verifyToken");

const router = express.Router();
router.patch("/:doctorId/approve", authenticate(["admin"]), approveDoctor);
router.get(
  "/get-pending-doctors",
  authenticate(["admin"]),
  getAllPendingDoctors
);

module.exports = router;
