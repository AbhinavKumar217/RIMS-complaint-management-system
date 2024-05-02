const express = require("express");
const router = express.Router();
const FacultyComplaint = require("../models/facultyComplaint");
const {
  authMiddleware,
  verifyAdmin,
} = require("../../middleware/authMiddleware");
const cron = require("node-cron");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const faculty = req.faculty;

    const { department, unitName, complaint } = req.body;

    const newFacultyComplaint = new FacultyComplaint({
      faculty: faculty,
      department,
      unitName,
      complaint,
    });

    await newFacultyComplaint.save();

    res.status(201).json(newFacultyComplaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const facultyComplaints = await FacultyComplaint.find();
    res.status(200).json(facultyComplaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/department/:departmentId",
  authMiddleware,
  verifyAdmin,
  async (req, res) => {
    try {
      const departmentId = req.params.departmentId;
      const facultyComplaints = await FacultyComplaint.find({
        department: departmentId,
      });
      res.status(200).json(facultyComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/faculty/:facultyId",
  authMiddleware,
  verifyAdmin,
  async (req, res) => {
    try {
      const facultyId = req.params.facultyId;
      const facultyComplaints = await FacultyComplaint.find({
        faculty: facultyId,
      });
      res.status(200).json(facultyComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

cron.schedule("0 0 * * *", async () => {
  // Calculate the date one minute ago
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  try {
    // Delete complaints that were created more than one minute ago
    const result = await FacultyComplaint.deleteMany({
      createdAt: { $lt: oneYearAgo },
    });

    console.log(
      `Deleted ${
        result.deletedCount
      } complaints created before ${oneYearAgo.toISOString()}`
    );
  } catch (error) {
    console.error("Error deleting complaints:", error);
  }
});

module.exports = router;
