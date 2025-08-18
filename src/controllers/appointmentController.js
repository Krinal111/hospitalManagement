const mongoose = require("mongoose");
const { Appointment, AvailabilitySlot } = require("../models");

exports.listMine = async (req, res) => {
  const { status, scope, page = 1, limit = 10 } = req.query;
  const q = { userId: req.user.id };
  if (status) q.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const appts = await Appointment.find(q)
    .populate({ path: "doctorId", select: "specializations consultationFee" })
    .populate({ path: "slotId", select: "startTime endTime consultationMode" })
    .sort({ "slotId.startTime": -1 })
    .skip(skip)
    .limit(Number(limit));

  const now = new Date();
  const filtered =
    scope === "upcoming"
      ? appts.filter((a) => a.slotId?.startTime >= now)
      : scope === "past"
      ? appts.filter((a) => a.slotId?.startTime < now)
      : appts;

  res.json({
    page: Number(page),
    limit: Number(limit),
    count: filtered.length,
    data: filtered,
  });
};

exports.reschedule = async (req, res) => {
  const { id } = req.params;
  const { newSlotId } = req.body || {};
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    const appt = await Appointment.findOne({
      _id: id,
      userId: req.user.id,
      status: "booked",
    })
      .populate("slotId")
      .session(session);
    if (!appt) throw new Error("Appointment not found");

    const now = new Date();
    const H24 = 24 * 60 * 60 * 1000;
    if (!appt.slotId || appt.slotId.startTime - now < H24) {
      const e = new Error("Rescheduling allowed only >24h before start");
      e.code = 403;
      throw e;
    }

    // Lock & book new slot (simulate confirm, no OTP)
    const newSlot = await AvailabilitySlot.findOneAndUpdate(
      { _id: newSlotId, status: "available", startTime: { $gt: now } },
      { $set: { status: "booked", lockedBy: null, lockedUntil: null } },
      { new: true, session }
    );
    if (!newSlot) throw new Error("New slot not available");

    // Cancel old appt & free old slot
    appt.status = "cancelled";
    await appt.save({ session });
    await AvailabilitySlot.updateOne(
      { _id: appt.slotId._id },
      { $set: { status: "available", lockedBy: null, lockedUntil: null } },
      { session }
    );

    // Create new appointment, link rescheduledFrom
    await Appointment.create(
      [
        {
          userId: appt.userId,
          doctorId: newSlot.doctorId,
          slotId: newSlot._id,
          status: "booked",
          consultationMode: newSlot.consultationMode,
          rescheduledFrom: appt._id,
        },
      ],
      { session }
    );
  });

  session.endSession();
  res.json({ message: "Rescheduled successfully" });
};

exports.cancel = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const appt = await Appointment.findOne({
      _id: id,
      userId: req.user.id,
      status: "booked",
    })
      .populate("slotId")
      .session(session);
    if (!appt) throw new Error("Appointment not found");

    const now = new Date();
    const H24 = 24 * 60 * 60 * 1000;
    if (!appt.slotId || appt.slotId.startTime - now < H24) {
      const e = new Error("Cancellation allowed only >24h before start");
      e.code = 403;
      throw e;
    }

    appt.status = "cancelled";
    await appt.save({ session });

    await AvailabilitySlot.updateOne(
      { _id: appt.slotId._id },
      { $set: { status: "available", lockedBy: null, lockedUntil: null } },
      { session }
    );
  });
  session.endSession();
  res.json({ message: "Cancelled successfully" });
};
