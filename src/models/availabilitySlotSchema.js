const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    consultationMode: {
      type: String,
      enum: ["online", "in_person"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "locked", "cancelled"],
      default: "available",
    },
    lockedUntil: { type: Date, default: null },
    recurringRule: {
      dayOfWeek: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: false,
      },
      slotDuration: { type: Number, default: 30 },
    },
  },
  { timestamps: true }
);

module.exports = availabilitySlotSchema;
