const { AvailabilitySlot, Doctor } = require("../models");

// Business rule: skip lunch break between 12:00 and 14:30 for all generated slots
const LUNCH_BREAK_START_MINUTES = 12 * 60; // 12:00
const LUNCH_BREAK_END_MINUTES = 14 * 60 + 30; // 14:30

function getMinutesOfDay(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function doesSlotOverlapLunch(startDate, endDate) {
  const startMinutes = getMinutesOfDay(startDate);
  const endMinutes = getMinutesOfDay(endDate);
  // Overlap if slot starts before lunch end and ends after lunch start
  return (
    startMinutes < LUNCH_BREAK_END_MINUTES &&
    endMinutes > LUNCH_BREAK_START_MINUTES
  );
}

exports.addAvailability = async (req, res) => {
  try {
    const { startTime, endTime, consultationMode, slotDuration } = req.body;
    const userId = req.user?.id;

    if (!startTime || !endTime || !consultationMode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor)
      return res.status(404).json({ message: "Doctor profile not found" });

    // If slotDuration provided, generate multiple slots within the single day window
    if (slotDuration) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (start.toDateString() !== end.toDateString()) {
        return res
          .status(400)
          .json({
            message:
              "For multi-slot generation, start and end must be on the same day",
          });
      }
      const slots = [];
      let current = new Date(start);
      while (current < end) {
        const slotEnd = new Date(current.getTime() + slotDuration * 60000);
        if (slotEnd > end) break;
        // Skip lunch break overlap
        if (doesSlotOverlapLunch(current, slotEnd)) {
          current = slotEnd;
          continue;
        }
        slots.push({
          doctorId: doctor._id,
          startTime: new Date(current),
          endTime: slotEnd,
          consultationMode,
        });
        current = slotEnd;
      }
      const saved = await AvailabilitySlot.insertMany(slots);
      return res.status(201).json({ message: "Slots created", slots: saved });
    }

    // Otherwise create a single slot
    const slot = new AvailabilitySlot({
      doctorId: doctor._id,
      startTime,
      endTime,
      consultationMode,
    });
    await slot.save();
    res.status(201).json({ message: "Slot created", slot });
  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addRecurringAvailability = async (req, res) => {
  try {
    const {
      dayOfWeek,
      startTime,
      endTime,
      consultationMode,
      slotDuration,
      fromDate,
      toDate,
      daysOfWeek,
    } = req.body;
    const userId = req.user?.id;

    // New weekly recurrence path if fromDate/toDate/daysOfWeek provided
    if (
      fromDate &&
      toDate &&
      Array.isArray(daysOfWeek) &&
      daysOfWeek.length > 0
    ) {
      if (!slotDuration || !consultationMode || !startTime || !endTime) {
        return res
          .status(400)
          .json({
            message:
              "fromDate, toDate, daysOfWeek, startTime, endTime, slotDuration, consultationMode are required",
          });
      }

      const doctor = await Doctor.findOne({ user: userId });
      if (!doctor)
        return res.status(404).json({ message: "Doctor profile not found" });

      const from = new Date(fromDate);
      const to = new Date(toDate);

      // Parse time-of-day robustly (supports "HH:mm" or any Date string)
      const parseTimeOfDay = (val) => {
        if (typeof val === "string" && /^\d{1,2}:\d{2}$/.test(val)) {
          const [h, m] = val.split(":").map(Number);
          return { h, m };
        }
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          return { h: d.getHours(), m: d.getMinutes() };
        }
        throw new Error(
          "Invalid time format for startTime/endTime. Use 'HH:mm' or a valid date-time string."
        );
      };

      let startHour, startMin, endHour, endMin;
      try {
        const s = parseTimeOfDay(startTime);
        const e = parseTimeOfDay(endTime);
        startHour = s.h;
        startMin = s.m;
        endHour = e.h;
        endMin = e.m;
      } catch (e) {
        return res.status(400).json({ message: e.message });
      }

      const daySet = new Set(daysOfWeek);
      const created = [];
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const name = d.toLocaleDateString("en-US", { weekday: "long" });
        if (!daySet.has(name)) continue;
        // Build day window
        const dayStart = new Date(d);
        dayStart.setHours(Number(startHour), Number(startMin), 0, 0);
        const dayEnd = new Date(d);
        dayEnd.setHours(Number(endHour), Number(endMin), 0, 0);

        let current = new Date(dayStart);
        while (current < dayEnd) {
          const slotEnd = new Date(current.getTime() + slotDuration * 60000);
          if (slotEnd > dayEnd) break;
          // Skip lunch break overlap
          if (doesSlotOverlapLunch(current, slotEnd)) {
            current = slotEnd;
            continue;
          }
          created.push({
            doctorId: doctor._id,
            startTime: new Date(current),
            endTime: slotEnd,
            consultationMode,
            recurringRule: { dayOfWeek: name, slotDuration },
          });
          current = slotEnd;
        }
      }

      const saved = await AvailabilitySlot.insertMany(created);
      return res
        .status(201)
        .json({ message: "Weekly recurring slots created", slots: saved });
    }

    // Legacy single-day recurring behavior
    if (!dayOfWeek || !startTime || !endTime || !consultationMode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor)
      return res.status(404).json({ message: "Doctor profile not found" });

    const start = new Date(startTime);
    const end = new Date(endTime);

    let slots = [];
    let current = new Date(start);

    while (current < end) {
      const slotEnd = new Date(current.getTime() + slotDuration * 60000);

      if (slotEnd > end) break;

      slots.push({
        doctorId: doctor._id,
        startTime: new Date(current),
        endTime: slotEnd,
        consultationMode,
        recurringRule: { dayOfWeek, slotDuration },
      });

      current = slotEnd;
    }

    const savedSlots = await AvailabilitySlot.insertMany(slots);

    res
      .status(201)
      .json({ message: "Recurring slots created", slots: savedSlots });
  } catch (error) {
    console.error("Error adding recurring availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const slots = await AvailabilitySlot.find({
      doctorId,
      status: { $in: ["available", "booked", "locked"] },
    }).sort("startTime");
    res.json(slots);
  } catch (error) {
    console.error("Error fetching doctor slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};
