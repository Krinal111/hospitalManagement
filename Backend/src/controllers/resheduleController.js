const { Appointment, AvailabilitySlot } = require("../models");

// Cancel Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId).populate(
      "slotId"
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const now = new Date();
    const diffHours = (appointment.startTime - now) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return res
        .status(400)
        .json({ message: "Cancellation allowed only >24h before" });
    }

    // Update appointment
    appointment.status = "cancelled";
    await appointment.save();

    // Release slot
    await AvailabilitySlot.findByIdAndUpdate(appointment.slotId, {
      status: "available",
      lockedUntil: null,
      lockedBy: null,
    });

    res.json({ message: "Appointment cancelled & slot released" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { newSlotId } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate(
      "slotId"
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const now = new Date();
    const diffHours = (appointment.startTime - now) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return res
        .status(400)
        .json({ message: "Reschedule allowed only >24h before" });
    }

    // Release old slot
    await AvailabilitySlot.findByIdAndUpdate(appointment.slotId, {
      status: "available",
      lockedUntil: null,
      lockedBy: null,
    });

    const newSlot = await AvailabilitySlot.findById(newSlotId);
    if (!newSlot || newSlot.status !== "available") {
      return res.status(400).json({ message: "New slot not available" });
    }

    newSlot.status = "booked";
    newSlot.lockedBy = null;
    newSlot.lockedUntil = null;
    await newSlot.save();

    appointment.slotId = newSlotId;
    appointment.startTime = newSlot.startTime;
    appointment.endTime = newSlot.endTime;
    appointment.status = "rescheduled";
    appointment.rescheduledTo = newSlot._id;
    await appointment.save();

    res.json({ message: "Appointment rescheduled", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
