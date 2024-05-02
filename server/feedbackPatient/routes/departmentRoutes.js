const express = require("express");
const router = express.Router();
const Department = require("../models/department");
const {
  authMiddleware,
  verifyAdmin,
} = require("../../middleware/authMiddleware");

router.post("/", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new department
    const newDepartment = new Department({
      name
    });

    // Save the department to the database
    await newDepartment.save();

    // Send a response with the newly created department
    res.status(201).json(newDepartment);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: error.message });
  }
});

// Get a list of all departments
router.get("/", async (req, res) => {
  try {
    // Find all departments in the database
    const departments = await Department.find();

    // Send the list of departments as the response
    res.status(200).json(departments);
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ error: error.message });
  }
});

router.get("/:DepartmentId", async(req, res) => {
  try {

    const { DepartmentId } = req.params;

    const department = await Department.findById(DepartmentId);

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a department by ID
router.put(
  "/:DepartmentId",
  authMiddleware,
  verifyAdmin,
  async (req, res) => {
    try {
      const { DepartmentId } = req.params;
      const { name } = req.body;

      // Find the department by ID and update it
      const updatedDepartment = await Department.findByIdAndUpdate(
        DepartmentId,
        {
          name
        },
        { new: true } // Return the updated department
      );

      // Check if the department exists
      if (!updatedDepartment) {
        return res.status(404).json({ error: "Department not found" });
      }

      // Send the updated department as the response
      res.status(200).json(updatedDepartment);
    } catch (error) {
      // Handle errors and send an appropriate response
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete a department by ID
router.delete(
  "/:DepartmentId",
  authMiddleware,
  verifyAdmin,
  async (req, res) => {
    try {
      const { DepartmentId } = req.params;

      // Find the department by ID and delete it
      const deletedDepartment = await Department.findByIdAndDelete(DepartmentId);

      // Check if the department exists
      if (!deletedDepartment) {
        return res.status(404).json({ error: "Department not found" });
      }

      // Send a success response
      res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      // Handle errors and send an appropriate response
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;