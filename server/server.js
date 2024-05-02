const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const departmentRoutes = require("./feedbackPatient/routes/departmentRoutes");
const facultyAuthRoutes = require("./feedbackPatient/routes/facultyAuthRoutes");
const facultyManageRoutes = require("./feedbackPatient/routes/facultyManageRoutes");
const patientComplaintRoutes = require("./feedbackPatient/routes/patientComplaintRoutes");
const facultyComplaintRoutes = require("./feedbackPatient/routes/facultyComplaintRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/feedback/departments", departmentRoutes);
app.use("/api/feedback/auth", facultyAuthRoutes);
app.use("/api/feedback/faculty", facultyManageRoutes);
app.use("/api/feedback/facultyComplaints", facultyComplaintRoutes);
app.use("/api/feedback/patientComplaints", patientComplaintRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the RIMS Complaint Management System API");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
