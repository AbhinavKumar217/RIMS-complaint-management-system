const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/faculty");
const Department = require("../models/department");
const sendEmail = require("../../config/sendEmail");
const router = express.Router();
const { authMiddleware } = require("../../middleware/authMiddleware");
const tokenBlacklist = require("../../models/tokenBlacklist");

// JWT secret (should be a strong, secret key stored in an environment variable)
const jwtSecret = process.env.JWT_SECRET;

// Register route
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      departmentId,
      firstName,
      lastName,
      dob,
      address,
    } = req.body;

    // Check if a faculty member with the given username or email already exists
    const existingFaculty = await Faculty.findOne({
      $or: [{ username }, { email }],
    });
    if (existingFaculty) {
      return res
        .status(400)
        .json({ message: "Username or email already exists." });
    }

    // Verify that the department ID exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({ message: "Invalid department ID." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new faculty member
    const newFaculty = new Faculty({
      username,
      email,
      password: hashedPassword,
      department: departmentId, // Store the reference to the Department model
      firstName,
      lastName,
      dob,
      address,
    });

    // Save the new faculty member to the database
    await newFaculty.save();

    await sendEmail(
      email,
      "Account Created!",
      "Your account has been successfully created. Feel free to login to your account."
    );

    // Send a success response
    res.status(201).json({ message: "Faculty registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the faculty member by email
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create a JWT token
    const token = jwt.sign({ facultyId: faculty._id }, jwtSecret, { expiresIn: "1h" });

    const visibleFaculty = {
      username: faculty.username,
      email: faculty.email,
      department: faculty.department,
      firstName: faculty.firstName,
      lastName: faculty.lastName,
      dob: faculty.dob,
      address: faculty.address,
    };

    // Send the token as the response
    res
      .status(200)
      .json({ token, message: "Login successful.", visibleFaculty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const blacklistToken = new tokenBlacklist({
      token,
      expiresAt: expirationTime,
    });
    await blacklistToken.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
