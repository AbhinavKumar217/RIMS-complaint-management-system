const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userImageUrl: String,
  role: {
    type: String,
    enum: ["user", "admin", "contractor"],
    default: "user",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: function () {
      return this.role === "contractor";
    },
  },
  assignedComplaints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;