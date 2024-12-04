// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Define Routes
router.get("/categories", categoryController.getAllCategories); // Get all categories
router.get("/categories/:id", categoryController.getCategoryById); // Get a category by ID
router.post("/categories", categoryController.createCategory); // Create a new category
router.put("/categories/:id", categoryController.updateCategory); // Update an existing category
router.delete("/categories/:id", categoryController.deleteCategory); // Delete a category by ID

module.exports = router;
