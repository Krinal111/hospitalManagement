const cron = require("node-cron");
const { AvailabilitySlot } = require("../models"); // import slot model

// Runs every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Running slot cleanup job...");

  const now = new Date();
  await AvailabilitySlot.updateMany(
    { status: "locked", lockedUntil: { $lt: now } },
    { $set: { status: "available", lockedUntil: null, lockedBy: null } }
  );

  console.log("Expired slots released");
});
