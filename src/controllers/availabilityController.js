const { AvailabilitySlot } = require("../models");

exports.addAvailability = async (req, res) => {
  try {
    const { doctorId, startTime, endTime, consultationMode } = req.body;

    if (!doctorId || !startTime || !endTime || !consultationMode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const slot = new AvailabilitySlot({
      doctorId,
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
      doctorId,
      dayOfWeek,
      startTime,
      endTime,
      consultationMode,
      slotDuration,
    } = req.body;

    if (
      !doctorId ||
      !dayOfWeek ||
      !startTime ||
      !endTime ||
      !consultationMode
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    let slots = [];
    let current = new Date(start);

    while (current < end) {
      const slotEnd = new Date(current.getTime() + slotDuration * 60000);

      if (slotEnd > end) break;

      slots.push({
        doctorId,
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
    const slots = await AvailabilitySlot.find({ doctorId }).sort("startTime");
    res.json(slots);
  } catch (error) {
    console.error("Error fetching doctor slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};
