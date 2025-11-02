const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel");

// 🟢 Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/description", async (req, res) => {
  try {
    // Check if a type filter is provided in query
    const { type } = req.query;

    let filter = {};
    if (type) {
      filter.description = type; // Filter by description field (Section Based / Indication Based)
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});


// 🟢 Add a category
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCat = new Category({ name, description });
    await newCat.save();
    res.json({ message: "Category added successfully", category: newCat });
  } catch (err) {
    res.status(400).json({ error: "Error adding category" });
  }
});

// 🟠 Delete category
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

module.exports = router;
