const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/sendEmail");
const { authMiddleware, verifyAdmin } = require("../middleware/authMiddleware");

// Route to get all users
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get a single user by userId
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update a user by userId
router.put("/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, userImageUrl, category, password } = req.body;
    let user = await User.findById(userId);
    let loggedUser = req.user;
    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(loggedUser._id);
    console.log(userId);

    if(loggedUser._id != userId) {
      return res.status(403).json({ message: "You can only update your account" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (userImageUrl) user.userImageUrl = userImageUrl;
    if (category) user.category = category;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    user = user.toObject();
    delete user.password;

    await sendEmail(user.email, "Profile Update Notification", "Your profile has been successfully updated.");

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    let loggedUser = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(loggedUser._id != userId) {
      return res.status(403).json({ message: "You can only delete your account" });
    }

    await User.findByIdAndDelete(userId);

    await sendEmail(user.email, "Profile Delete Notification", "Your profile has been successfully deleted.");

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/admin/:userId", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    await sendEmail(user.email, "Profile Delete Notification", "Admin has deleted your account.");

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
