const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  slotId: {
    type: Schema.Types.ObjectId,
    ref: "AvailabilitySlot",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["booked", "completed", "cancelled"],
    default: "booked",
  },
  consultationMode: {
    type: String,
    required: true,
    enum: ["online", "in-person"],
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  rescheduledFrom: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });
appointmentSchema.index({ bookedAt: 1 });

module.exports = appointmentSchema;
