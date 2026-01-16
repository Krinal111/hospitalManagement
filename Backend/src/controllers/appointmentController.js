const { AvailabilitySlot, Appointment, Doctor } = require("../models");

const lockSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const userId = req.user?.id;

    const slot = await AvailabilitySlot.findById(slotId);

    if (!slot) return res.status(404).json({ message: "Slot not found" });

    // Release expired lock
    if (
      slot.status === "locked" &&
      slot.lockedUntil &&
      new Date(slot.lockedUntil) < new Date()
    ) {
      slot.status = "available";
      slot.lockedUntil = null;
      slot.lockedBy = null;
      await slot.save();
    }

    // 🔑 If slot is locked by another user → not available
    if (slot.status === "locked" && slot.lockedBy.toString() !== userId) {
      return res.status(400).json({ message: "Slot not available" });
    }

    // 🔑 If the same user already locked → just return success (no need to relock)
    if (slot.status === "locked" && slot.lockedBy.toString() === userId) {
      return res.json({
        message: "Slot already locked by you",
        slotId: slot._id,
        lockedUntil: slot.lockedUntil,
      });
    }

    // Otherwise lock for 5 min
    const lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
    slot.status = "locked";
    slot.lockedUntil = lockedUntil;
    slot.lockedBy = userId;
    await slot.save();

    res.json({
      message: "Slot locked for 5 minutes",
      slotId: slot._id,
      lockedUntil,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const { slotId, otp } = req.body; // mock OTP step for confirmation
    const userId = req.user?.id;

    const slot = await AvailabilitySlot.findById(slotId);

    if (!slot) return res.status(404).json({ message: "Slot not found" });

    // Check lock validity
    if (
      slot.status !== "locked" ||
      !slot.lockedUntil ||
      new Date(slot.lockedUntil) < new Date()
    ) {
      // Reset slot if expired
      slot.status = "available";
      slot.lockedUntil = null;
      slot.lockedBy = null;
      await slot.save();
      return res
        .status(400)
        .json({ message: "Slot lock expired, please rebook" });
    }

    // Enforce that only locker can confirm
    if (slot.lockedBy?.toString() !== userId) {
      return res.status(403).json({ message: "You did not lock this slot" });
    }

    // Mock OTP validation
    if (!otp || otp !== "123456") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as booked
    slot.status = "booked";
    slot.lockedUntil = null;
    slot.lockedBy = null;
    await slot.save();

    // Create appointment
    const appointmentPayload = {
      patientId: userId,
      doctorId: slot.doctorId,
      slotId: slot._id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      mode: slot.consultationMode,
      status: "booked",
    };

    const appointment = await Appointment.create(appointmentPayload);

    res.json({
      message: "Booking confirmed",
      appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const releaseExpired = async (req, res) => {
  try {
    const now = new Date();
    const result = await AvailabilitySlot.updateMany(
      { status: "locked", lockedUntil: { $lt: now } },
      { $set: { status: "available", lockedUntil: null, lockedBy: null } }
    );

    res.json({
      message: "Expired locks released",
      released: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 4️⃣ Patient dashboard: upcoming/past appointments with optional status filter
const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { status, when } = req.query; // when: upcoming | past | all

    const query = { patientId: userId };
    if (status) query.status = status;

    const now = new Date();
    if (when === "upcoming") query.startTime = { $gte: now };
    if (when === "past") query.startTime = { $lt: now };

    const appointments = await Appointment.find(query)
      .populate({
        path: "doctorId",
        populate: { path: "user", select: "firstName lastName email" },
      })
      .populate("slotId")
      .sort({ startTime: 1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  lockSlot,
  confirmBooking,
  releaseExpired,
  getMyAppointments,
};
