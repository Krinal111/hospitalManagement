const { Doctor } = require("../models");

const onboarding = async (req, res) => {
  try {
    const doctorData = {
      user: req.user.id,
      specializations: req.body.specializations,
      modes: req.body.modes,
      consultationFee: req.body.consultationFee,
    };

    let doctor = await Doctor.findOne({ user: req.user.id });

    if (doctor) {
      doctor.set(doctorData);
      await doctor.save();
    } else {
      doctor = new Doctor(doctorData);
      await doctor.save();
    }

    res.json({
      message: "Doctor profile submitted, waiting for admin approval",
      doctor,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = onboarding;
