const express = require("express");
const cors = require("cors");

const loginRoutes = require("./routes/login");
const homeRoutes = require("./routes/home");
const appointmentRoutes = require("./routes/appointmentbooking");
const recordRoutes = require("./routes/record");
const staffHomeRoutes = require("./routes/staffhome");
const appointmentScheduleRoutes = require("./routes/appointmentschedule");
const statisticsRoutes = require("./routes/statistics");
const medicalrecordsRoutes = require("./routes/medicalrecords");
const formRoutes = require("./routes/form");

const app = express();

app.use(cors());
app.use(express.json());

// route
app.use("/api/login", loginRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/medical", medicalrecordsRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/staff", staffHomeRoutes);
app.use("/api/appointment-schedule", appointmentScheduleRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/form", formRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
