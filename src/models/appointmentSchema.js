// appointment.model.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },

    status: {
      type: String,
      enum: ["booked", "completed", "cancelled", "rescheduled"],
      default: "booked",
    },
    rescheduledTo: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
    consultationFee: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = appointmentSchema;
