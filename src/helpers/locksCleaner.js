const { AvailabilitySlot } = require("../models");

async function cleanupExpiredLocks() {
  const now = new Date();
  await AvailabilitySlot.updateMany(
    { status: "locked", lockedUntil: { $lt: now } },
    { $set: { status: "available", lockedBy: null, lockedUntil: null } }
  );
}
module.exports = { cleanupExpiredLocks };
