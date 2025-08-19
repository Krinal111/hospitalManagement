const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRouter = require("./routes/authRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const adminRouter = require("./routes/adminRoutes");
const availabilityRouter = require("./routes/slotRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/booking", appointmentRouter);

const PORT = process.env.PORT || 5000;

// Start only after DB connects
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB, server not started", err);
  });


  

require("./helpers/locksCleaner");
