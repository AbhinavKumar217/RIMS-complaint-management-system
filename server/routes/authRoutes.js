const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const validateEmail = require("../validations/emailValidation");
const validatePassword = require("../validations/passwordValidation");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/sendEmail");
const crypto = require("crypto");
const cron = require("node-cron");
const tokenBlacklist = require("../models/tokenBlacklist");
const { authMiddleware } = require("../middleware/authMiddleware");

const otpMap = new Map(); // Map to store email-OTP pairs in memory
const otpExpiryMap = new Map(); // Map to store OTP expiration timestamps

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, category, userImageUrl } =
      req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-digit OTP

    // Send OTP to user's email
    const subject = "Email Verification OTP";
    const html = `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`;
    await sendEmail(email, subject, html);

    // Store OTP data in Redis with expiration time (e.g., 5 minutes)
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpMap.set(email, otp);
    otpExpiryMap.set(email, expirationTime);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      category,
      userImageUrl,
    });

    await newUser.save();

    const visibleUser = {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      category: newUser.category,
      userImageUrl: newUser.userImageUrl,
    };

    res
      .status(201)
      .json({ message: "User registered successfully", user: visibleUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify email route
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOTP = otpMap.get(email);
    const expirationTime = otpExpiryMap.get(email);

    if (!storedOTP || !expirationTime || expirationTime < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    if (storedOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await User.updateOne({ email }, { $set: { emailVerified: true } });

    otpMap.delete(email);
    otpExpiryMap.delete(email);

    await sendEmail(
      email,
      "Email Verified Notification",
      "Your account has been successfully verified. Feel free to login to your account."
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user's email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const visibleUser = {
      username: user.username,
      email: user.email,
      role: user.role,
      category: user.category,
      userImageUrl: user.userImageUrl,
    };

    res.status(200).json({ message: "Login successful", token, visibleUser });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
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

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    const result = await tokenBlacklist.deleteMany({ expiresAt: { $lt: now } });

    console.log(`Removed ${result.deletedCount} expired blacklisted tokens.`);
  } catch (error) {
    console.error("Error removing expired blacklisted tokens:", error);
  }
});

module.exports = router;
