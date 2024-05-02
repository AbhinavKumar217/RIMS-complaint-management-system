const express = require("express");
const router = express.Router();
const PatientComplaint = require("../models/patientComplaint");
const {
  authMiddleware,
  verifyAdmin,
} = require("../../middleware/authMiddleware");
const cron = require("node-cron");

router.post("/", async (req, res) => {
  try {
    const {
      name,
      age,
      sex,
      address,
      department,
      unitName,
      wardName,
      complaint,
    } = req.body;

    // Create a new complaint instance
    const newPatientComplaint = new PatientComplaint({
      name,
      age,
      sex,
      address,
      department,
      unitName,
      wardName,
      complaint,
    });

    // Save the updated patient
    await newPatientComplaint.save();

    // Send the updated patient as the response
    res.status(201).json(newPatientComplaint);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const patientComplaints = await PatientComplaint.find();
    res.status(200).json(patientComplaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/department/:departmentId", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const patientComplaints = await PatientComplaint.find({ department : departmentId });
    res.status(200).json(patientComplaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

cron.schedule("0 0 * * *", async () => {
  // Calculate the date one minute ago
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    // Delete complaints that were created more than one minute ago
    const result = await PatientComplaint.deleteMany({
      createdAt: { $lt: threeMonthsAgo },
    });

    console.log(`Deleted ${result.deletedCount} complaints created before ${threeMonthsAgo.toISOString()}`);
  } catch (error) {
    console.error("Error deleting complaints:", error);
  }
});

module.exports = router;
