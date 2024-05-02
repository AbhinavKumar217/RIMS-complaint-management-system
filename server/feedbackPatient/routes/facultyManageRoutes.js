const express = require("express");
const router = express.Router();
const Faculty = require("../models/faculty");
const {
  authMiddleware,
  verifyAdmin,
} = require("../../middleware/authMiddleware");
const sendEmail = require("../../config/sendEmail");

// Route to get all faculty members
router.get("/", async (req, res) => {
  try {
    const faculties = await Faculty.find().populate("department");
    res.status(200).json(faculties);
  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get a faculty member by ID
router.get("/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).populate(
      "department"
    );
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get faculty members by department
router.get("/department/:departmentId", async (req, res) => {
  try {
    const faculties = await Faculty.find({
      department: req.params.departmentId,
    }).populate("department");
    res.status(200).json(faculties);
  } catch (error) {
    console.error("Error fetching faculties by department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update a faculty member (only the faculty themselves can update their account)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Ensure the faculty can only update their own account
    if (req.faculty && req.faculty._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this faculty" });
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated faculty
    ).populate("department");

    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const loggedFacultyId = req.faculty._id;
    const loggedFaculty = await Faculty.findById(loggedFacultyId);
    const loggedFacultyEmail = loggedFaculty.email;

    await sendEmail(
      loggedFacultyEmail,
      "Account Updated!",
      "Your account has been successfully updated."
    );

    res.status(200).json(updatedFaculty);
  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete a faculty member (only the faculty themselves can delete their account)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Ensure the faculty can only delete their own account
    if (req.faculty && req.faculty._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this faculty" });
    }

    const loggedFacultyId = req.faculty._id;
    const loggedFaculty = await Faculty.findById(loggedFacultyId);
    const loggedFacultyEmail = loggedFaculty.email;

    await sendEmail(
      loggedFacultyEmail,
      "Account Deleted!",
      "Your account has been successfully deleted."
    );

    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id);

    if (!deletedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty account deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete(
  "/admin/:facultyId",
  authMiddleware,
  verifyAdmin,
  async (req, res) => {
    try {
      const facultyId = req.params.facultyId;
      const faculty = await Faculty.findById(facultyId);
      if (!faculty) {
        return res.status(404).json({ message: "Faculty not found" });
      }

      await Faculty.findByIdAndDelete(facultyId);

      await sendEmail(
        faculty.email,
        "Profile Delete Notification",
        "Admin has deleted your account."
      );

      res.status(200).json({ message: "Faculty deleted successfully" });
    } catch (error) {
      console.error("Error deleting faculty:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
