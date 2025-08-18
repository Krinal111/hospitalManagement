const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const availabilitySlotSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["available", "locked", "booked"],
    default: "available",
  },
  lockedUntil: {
    type: Date,
    default: null,
  },
  lockedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  consultationMode: {
    type: String,
    required: true,
    enum: ["online", "in-person"],
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

// Indexes for efficient querying
availabilitySlotSchema.index({ doctorId: 1, status: 1, startTime: 1 });
availabilitySlotSchema.index({ startTime: 1 }); // For sorting by soonest availability
availabilitySlotSchema.index({ lockedUntil: 1 }); // For cleanup of expired locks

module.exports = availabilitySlotSchema;
