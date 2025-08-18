const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specializations: [{ type: String }],

    modes: [{ type: String, enum: ["online", "in_person"] }],

    consultationFee: { type: Number, default: 0 },

    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);


doctorSchema.index({ specializations: 1 });
doctorSchema.index({ modes: 1 });

module.exports = doctorSchema;
