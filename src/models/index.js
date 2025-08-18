const mongoose = require("mongoose");
const appointmentSchema = require("./appointmentSchema");
const availabilitySlotSchema = require("./availabilitySlotSchema");
const doctorSchema = require("./doctorSchema");
const userSchema = require("./userSchema");
const refreshTokenSchema = require("./refreshTokenSchema");

[userSchema, doctorSchema, availabilitySlotSchema, appointmentSchema].forEach(
  (schema) => {
    schema.pre("save", function (next) {
      this.updatedAt = Date.now();
      next();
    });
  }
);

module.exports = {
  User: mongoose.model("User", userSchema),
  Doctor: mongoose.model("Doctor", doctorSchema),
  AvailabilitySlot: mongoose.model("AvailabilitySlot", availabilitySlotSchema),
  Appointment: mongoose.model("Appointment", appointmentSchema),
  RefreshToken: mongoose.model("RefreshToken", refreshTokenSchema),
};
