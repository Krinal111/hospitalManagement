const { Doctor, AvailabilitySlot } = require("../models");

const getDoctors = async (req, res) => {
  try {
    const { specialization, mode, date } = req.query;
    let doctorQuery = { isApproved: true };
    if (specialization) doctorQuery.specializations = specialization;
    if (mode) doctorQuery.modes = mode;

    const doctors = await Doctor.find(doctorQuery);
    const results = await Promise.all(
      doctors.map(async (doc) => {
        let slotQuery = {
          doctorId: doc._id,
          status: "available",
        };
        if (date) {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          slotQuery.startTime = { $gte: startOfDay, $lte: endOfDay };
        }

        if (mode) {
          slotQuery.consultationMode = mode;
        }
        const nextSlot = await AvailabilitySlot.findOne(slotQuery).sort(
          "startTime"
        );

        if (!nextSlot) return null;

        return {
          doctorId: doc._id,
          name: doc.name,
          specializations: doc.specializations,
          modes: doc.modes,
          consultationFee: doc.consultationFee,
          nextAvailableSlot: {
            slotId: nextSlot._id,
            startTime: nextSlot.startTime,
            endTime: nextSlot.endTime,
            mode: nextSlot.consultationMode,
          },
        };
      })
    );
    const filteredResults = results.filter((r) => r !== null);
    filteredResults.sort(
      (a, b) =>
        new Date(a.nextAvailableSlot.startTime) -
        new Date(b.nextAvailableSlot.startTime)
    );

    res.json(filteredResults);
  } catch (error) {
    console.error("Error in getDoctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDoctors };
