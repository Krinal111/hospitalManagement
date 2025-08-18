const mongoose = require("mongoose");
const { AvailabilitySlot, Appointment } = require("../models");

// naive demo OTP store (swap with Redis in prod)
const otpStore = new Map(); // key `${slotId}:${userId}` -> "123456"

exports.lockSlot = async (req, res) => {
  const { slotId } = req.params;
  const now = new Date();
  const lockedUntil = new Date(now.getTime() + 5 * 60 * 1000);

  const slot = await AvailabilitySlot.findOneAndUpdate(
    { _id: slotId, status: "available", startTime: { $gt: now } },
    { $set: { status: "locked", lockedBy: req.user.id, lockedUntil } },
    { new: true }
  );
  if (!slot) return res.status(409).json({ message: "Slot not available" });

  // generate mock OTP
  const otp = "123456";
  otpStore.set(`${slotId}:${req.user.id}`, otp);

  res.json({ message: "Slot locked for 5 minutes", slotId, lockedUntil, otp }); // return otp in dev only
};

exports.releaseSlot = async (req, res) => {
  const { slotId } = req.params;
  const slot = await AvailabilitySlot.findOneAndUpdate(
    { _id: slotId, status: "locked", lockedBy: req.user.id },
    { $set: { status: "available", lockedBy: null, lockedUntil: null } },
    { new: true }
  );
  if (!slot) return res.status(404).json({ message: "No locked slot found" });
  otpStore.delete(`${slotId}:${req.user.id}`);
  res.json({ message: "Slot released" });
};

exports.confirmSlot = async (req, res) => {
  const { slotId } = req.params;
  const { otp } = req.body || {};
  const key = `${slotId}:${req.user.id}`;
  const expected = otpStore.get(key);
  if (!expected || otp !== expected)
    return res.status(400).json({ message: "Invalid OTP" });

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const now = new Date();
    const slot = await AvailabilitySlot.findOne({
      _id: slotId,
      status: "locked",
      lockedBy: req.user.id,
      lockedUntil: { $gt: now },
    }).session(session);

    if (!slot) throw new Error("Locked slot expired or not found");

    slot.status = "booked";
    slot.lockedBy = null;
    slot.lockedUntil = null;
    await slot.save({ session });

    await Appointment.create(
      [
        {
          userId: req.user.id,
          doctorId: slot.doctorId,
          slotId: slot._id,
          status: "booked",
          consultationMode: slot.consultationMode,
        },
      ],
      { session }
    );
  });
  session.endSession();

  otpStore.delete(key);
  res.status(201).json({ message: "Appointment booked" });
};
