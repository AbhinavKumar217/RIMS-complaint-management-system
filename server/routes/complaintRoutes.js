const express = require("express");
const router = express.Router();
const Complaint = require("../models/complaint");
const { authMiddleware, verifyAdmin, verifyContractor } = require("../middleware/authMiddleware");
const sendEmail = require("../config/sendEmail");
const User = require("../models/user");

// Create a new complaint
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Extract the user object from the decoded token
    const user = req.user;

    // Extract other necessary information from the request body
    const { description, address, category, complaintImageUrl } = req.body;

    // Create a new complaint instance
    const newComplaint = new Complaint({
      user: user,
      description,
      address,
      category,
      complaintImageUrl,
    });

    // Save the complaint to the database
    await newComplaint.save();

    await sendEmail(
      user.email,
      "Complaint Request Notification",
      "Your complaint has been successfully logged."
    );
    // Send a success response
    res.status(201).json({
      message: "Complaint created successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get all complaints
router.get("/", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a complaint by ID
router.get("/:complaintId", authMiddleware, async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a complaint
router.put("/:complaintId", authMiddleware, async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const { description, address, category, complaintImageUrl } = req.body;
    let complaint = await Complaint.findById(complaintId);
    let loggedUser = req.user;
    let user = complaint.user;

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    console.log(loggedUser._id);
    console.log(user);

    if (loggedUser._id.toString() !== complaint.user.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your complaint" });
    }

    if (description) complaint.description = description;
    if (address) complaint.address = address;
    if (category) complaint.category = category;
    if (complaintImageUrl) complaint.complaintImageUrl = complaintImageUrl;
    complaint.status = "logged";

    await complaint.save();
    complaint = complaint.toObject();

    await sendEmail(
      loggedUser.email,
      "Complaint Update Notification",
      "Your complaint has been successfully updated and logged again."
    );

    res.status(200).json(complaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a complaint
router.delete("/:complaintId", authMiddleware, async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const complaint = await Complaint.findById(complaintId);
    let loggedUser = req.user;

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (loggedUser._id.toString() !== complaint.user.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your complaint" });
    }

    await Complaint.findByIdAndDelete(complaintId);

    await sendEmail(
      loggedUser.email,
      "Complaint Deleted Notification",
      "Your complaint has been successfully deleted."
    );

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/admin/:complaintId", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const complaintId = req.params.complaintId;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await Complaint.findByIdAndDelete(complaintId);

    const userId = complaint.user;
    const user = await User.findById(userId);

    await sendEmail(user.email, "Complaint Delete Notification", "Admin has deleted your complaint.");

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/assign/:complaintId", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const { contractorId } = req.body;
    const { complaintId } = req.params;

    // Validate contractorId and complaintId
    if (!contractorId) {
      return res
        .status(400)
        .json({ message: "Contractor ID is required" });
    }

    if (!complaintId) {
      return res
        .status(400)
        .json({ message: "Complaint ID is required" });
    }

    // Check if the complaint exists
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    let complainteeId = complaint.user;
    const complaintee = await User.findById(complainteeId);
    let complainteeEmail = complaintee.email;
    let complainteeAddress = complaint.address;

    const contractor = await User.findById(contractorId);
    let contractorMail = contractor.email;
    

    // Update the complaint status to "assigned" and assign the contractor
    complaint.status = "assigned";
    complaint.contractor = contractorId;
    await complaint.save();

    await sendEmail(complainteeEmail, "Contractor Assigned", "A contractor has been assigned to your complaint. They will take a visit shortly.");
    await sendEmail(contractorMail, "Contractor Assigned", `You have been assigned a task. Please visit ${complainteeAddress} between 9:00 AM to 1:00 PM tomorrow.`);

    res
      .status(200)
      .json({ message: "Complaint status updated successfully", complaint });
  } catch (error) {
    console.error("Error assigning contractor to complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to mark a complaint as solved
router.post("/solved/:complaintId", authMiddleware, verifyContractor, async (req, res) => {
  try {
    const { complaintId } = req.params;

    // Check if the complaint exists
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    console.log(complaint.contractor)
    console.log(req.user._id.toString())

    // Check if the contractor is assigned to the complaint
    if (complaint.contractor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access forbidden. Only the assigned contractor can change the status." });
    }

    let complainteeId = complaint.user;
    const complaintee = await User.findById(complainteeId);
    let complainteeEmail = complaintee.email;

    // Update the complaint status to "solved"
    complaint.status = "solved";
    await complaint.save();

    await sendEmail(complainteeEmail, "Issue Resolved", "Your issue has been resolved. Please feel free to review the contractor's work.");

    res.status(200).json({ message: "Complaint marked as solved", complaint });
  } catch (error) {
    console.error("Error marking complaint as solved:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to mark a complaint as failed
router.post("/failed/:complaintId", authMiddleware, verifyContractor, async (req, res) => {
  try {
    const { complaintId } = req.params;

    // Check if the complaint exists
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.contractor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access forbidden. Only the assigned contractor can change the status." });
    }

    let complainteeId = complaint.user;
    const complaintee = await User.findById(complainteeId);
    let complainteeEmail = complaintee.email;

    // Update the complaint status to "failed"
    complaint.status = "failed";
    await complaint.save();

    await sendEmail(complainteeEmail, "Issue Unresolved", "Your issue was unable to be resolved. Please feel free to review the contractor's work.");

    res.status(200).json({ message: "Complaint marked as failed", complaint });
  } catch (error) {
    console.error("Error marking complaint as failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/review/:complaintId", authMiddleware, async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { review, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access forbidden. Only the user who created the complaint can post a review" });
    }

    if (complaint.status !== "solved" && complaint.status !== "failed") {
      return res.status(400).json({ message: "Cannot post review. Complaint must be solved or failed" });
    }


    complaint.review = review;
    complaint.rating = rating;
    await complaint.save();

    res.status(200).json({ message: "Review added successfully", complaint });
  } catch (error) {
    console.error("Error adding review to complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch complaints created by the user
    const complaints = await Complaint.find({ user: userId });

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/category/:categoryId", authMiddleware, async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Fetch complaints belonging to the specified category
    const complaints = await Complaint.find({ category: categoryId });

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this category" });
    }

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/contractor/:contractorId", authMiddleware, verifyContractor, async (req, res) => {
  try {
    const { contractorId } = req.params;

    // Ensure the authenticated user is the contractor specified in the request
    if (req.user._id.toString() !== contractorId) {
      return res.status(403).json({ message: "Access forbidden. You can only view complaints assigned to you" });
    }

    // Fetch complaints assigned to the contractor
    const complaints = await Complaint.find({ contractor: contractorId });

    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this contractor" });
    }

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints by contractor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
