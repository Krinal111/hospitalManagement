const { Doctor } = require("../models");

const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.isApproved = true;
    await doctor.save();

    res.json({ message: "Doctor approved successfully", doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllPendingDoctors = async (req, res) => {
  try {
    const pending = await Doctor.find({ isApproved: false }).populate(
      "user",
      "firstName lastName email role"
    );

    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { approveDoctor, getAllPendingDoctors };
