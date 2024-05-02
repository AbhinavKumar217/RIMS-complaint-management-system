const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create a model for the Department using the schema
const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
