const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const { authMiddleware, verifyAdmin } = require("../middleware/authMiddleware");

// Create a new category
router.post("/", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create a new category instance
    const newCategory = new Category({ name });

    // Save the category to the database
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a category by ID
router.get("/:categoryId", authMiddleware, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a category
router.put("/:categoryId", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name } = req.body;

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the category name
    category.name = name;

    // Save the updated category to the database
    await category.save();

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a category
router.delete("/:categoryId", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the category from the database
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
