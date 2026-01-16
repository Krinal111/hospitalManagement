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
      ref: "AvailabilitySlot",
      required: true,
    },

    // Duplicate denormalized fields for quick filtering/sorting
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    mode: { type: String, enum: ["online", "in_person"], required: true },

    status: {
      type: String,
      enum: ["booked", "completed", "cancelled", "rescheduled"],
      default: "booked",
      index: true,
    },
    rescheduledTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AvailabilitySlot",
    },
    consultationFee: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

appointmentSchema.index({ patientId: 1, startTime: 1 });
appointmentSchema.index({ doctorId: 1, startTime: 1 });

module.exports = appointmentSchema;
