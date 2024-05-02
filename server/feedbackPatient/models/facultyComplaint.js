const mongoose = require("mongoose");
const facultyComplaintSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    unitName: {
      type: String,
      required: true,
    },
    complaint: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model for the Patient using the schema
const FacultyComplaint = mongoose.model(
  "FacultyComplaint",
  facultyComplaintSchema
);
module.exports = FacultyComplaint;
