const mongoose = require("mongoose");

// Define the schema for the Faculty model
const facultySchema = new mongoose.Schema({
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
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Department",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt fields to the model
});

// Create the Faculty model using the schema
const Faculty = mongoose.model("Faculty", facultySchema);

// Export the Faculty model for use in other files
module.exports = Faculty;