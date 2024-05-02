const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Faculty = require("../feedbackPatient/models/faculty");
const TokenBlacklist = require("../models/tokenBlacklist");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Missing authorization token" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Unauthorized. Token has been invalidated." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user; // Set user in request object
    } else if (decoded.facultyId) {
      const faculty = await Faculty.findById(decoded.facultyId);
      if (!faculty) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      req.faculty = faculty; // Set faculty in request object
    } else {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    // Check if the logged-in user is a faculty member or a user
    if (req.user) {
      // If the user has a role attribute, verify if the role is "admin"
      if (req.user.role && req.user.role === "admin") {
        return next(); // Continue if the user is an admin
      }
    }
    
    // If the logged-in user is a faculty member, treat them as a normal user without admin role
    if (req.faculty) {
      return res
        .status(403)
        .json({ message: "Access forbidden. Only admins are allowed." });
    }
    
    // If the user is neither an admin nor a faculty member, deny access
    return res
      .status(403)
      .json({ message: "Access forbidden. Only admins are allowed." });
  } catch (error) {
    console.error("Error verifying admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyContractor = (req, res, next) => {
  try {
    if (req.user.role !== "contractor") {
      return res
        .status(403)
        .json({ message: "Access forbidden. Only contractors are allowed." });
    }
    next();
  } catch (error) {
    console.error("Error verifying contractor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authMiddleware, verifyAdmin, verifyContractor };
