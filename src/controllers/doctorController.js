const { Doctor, AvailabilitySlot } = require("../models");

exports.searchDoctors = async (req, res) => {
  const {
    specialization,
    mode,
    from,
    to,
    sort = "soonest",
    page = 1,
    limit = 10,
  } = req.query;
  const q = { isApproved: true };
  if (specialization) q.specializations = specialization;
  if (mode) q.modes = mode; // "online" | "in-person"

  const skip = (Number(page) - 1) * Number(limit);
  const doctors = await Doctor.find(q).skip(skip).limit(Number(limit)).lean();

  // attach 1-3 next slots each
  const fromDt = from ? new Date(from) : new Date();
  const toDt = to ? new Date(to) : undefined;

  const doctorIds = doctors.map((d) => d._id);
  const slotQ = {
    doctorId: { $in: doctorIds },
    status: "available",
    startTime: { $gte: fromDt },
  };
  if (toDt) slotQ.startTime.$lte = toDt;
  if (mode) slotQ.consultationMode = mode;

  const slots = await AvailabilitySlot.find(slotQ)
    .sort({ startTime: 1 })
    .lean();

  const slotsByDoc = new Map();
  for (const s of slots) {
    const arr = slotsByDoc.get(s.doctorId.toString()) || [];
    if (arr.length < 3)
      arr.push({
        _id: s._id,
        startTime: s.startTime,
        endTime: s.endTime,
        mode: s.consultationMode,
      });
    slotsByDoc.set(s.doctorId.toString(), arr);
  }

  let data = doctors.map((d) => ({
    ...d,
    nextSlots: slotsByDoc.get(d._id.toString()) || [],
  }));
  if (sort === "soonest") {
    data.sort((a, b) => {
      const aT = a.nextSlots[0]?.startTime
        ? new Date(a.nextSlots[0].startTime).getTime()
        : Infinity;
      const bT = b.nextSlots[0]?.startTime
        ? new Date(b.nextSlots[0].startTime).getTime()
        : Infinity;
      return aT - bT;
    });
  }
  res.json({
    page: Number(page),
    limit: Number(limit),
    count: data.length,
    data,
  });
};

exports.doctorSlots = async (req, res) => {
  const { mode, from, to } = req.query;
  const slotQ = {
    doctorId: req.params.doctorId,
    status: "available",
    startTime: { $gte: from ? new Date(from) : new Date() },
  };
  if (to) slotQ.startTime.$lte = new Date(to);
  if (mode) slotQ.consultationMode = mode;

  const slots = await AvailabilitySlot.find(slotQ).sort({ startTime: 1 });
  res.json(slots);
};
