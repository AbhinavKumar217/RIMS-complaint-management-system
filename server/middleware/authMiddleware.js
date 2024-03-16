const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Missing authorization token" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access forbidden. Only admins are allowed." });
    }
    next();
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
