const { AvailabilitySlot, Appointment } = require("../models");

// 1️⃣ Lock Slot (5 min)
const lockSlot = async (req, res) => {
  try {
    const { slotId, userId } = req.body;

    const slot = await AvailabilitySlot.findById(slotId);

    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.status !== "available") {
      return res.status(400).json({ message: "Slot not available" });
    }

    // Lock for 5 min
    const lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
    slot.status = "locked";
    slot.lockedUntil = lockedUntil;
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
    const { slotId, userId, otp } = req.body; // otp can be skipped for demo

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
      await slot.save();
      return res
        .status(400)
        .json({ message: "Slot lock expired, please rebook" });
    }

    // Mark as booked
    slot.status = "booked";
    slot.lockedUntil = null;
    await slot.save();

    // Create appointment
    const appointment = await Appointment.create({
      userId,
      doctorId: slot.doctorId,
      slotId: slot._id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      mode: slot.consultationMode,
      status: "booked",
    });

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
      { $set: { status: "available", lockedUntil: null } }
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

module.exports = { lockSlot, confirmBooking, releaseExpired };
