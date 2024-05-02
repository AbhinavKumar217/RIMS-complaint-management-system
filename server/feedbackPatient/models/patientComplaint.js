const mongoose = require("mongoose");
const patientComplaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"], // You can specify allowed values
    },
    address: {
      type: String,
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
    wardName: {
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
const PatientComplaint = mongoose.model(
  "PatientComplaint",
  patientComplaintSchema
);
module.exports = PatientComplaint;
