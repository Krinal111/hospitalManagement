const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.CONNECTION_STRING;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Successfully connected to MongoDB with Mongoose!");
    console.log("Connected DB:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };

// https://github.com/Krinal111/hospitalManagement/pull/1
