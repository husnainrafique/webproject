// controllers/categoryController.js
const Category = require('../models/categoryModel');

// Get all categories
const getAllCategories = (req, res) => {
    try {
        const categories = Category.getAllCategories(); // Get all categories from the model
        res.json(categories); // Return the categories in the response
    } catch (error) {
        console.error('Error retrieving categories:', error.message);
        res.status(500).json({ message: 'Error retrieving categories', error: error.message });
    }
};

// Get a category by ID
const getCategoryById = (req, res) => {
    const { id } = req.params;
    try {
        const category = Category.getCategoryById(id); // Get category by ID from the model
        if (category) {
            res.json(category); // Return the category in the response
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error retrieving category by ID:', error.message);
        res.status(500).json({ message: 'Error retrieving category', error: error.message });
    }
};

// Create a new category
const createCategory = (req, res) => {
    const { name, priority } = req.body;
    try {
        Category.createCategory(name, priority); // Create category in the model
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        console.error('Error creating category:', error.message);
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

// Update an existing category
const updateCategory = (req, res) => {
    const { id } = req.params;
    const { name, priority } = req.body;
    try {
        const result = Category.updateCategory(id, name, priority); // Update category in the model
        if (result.changes > 0) {
            res.json({ message: 'Category updated successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating category:', error.message);
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

// Delete a category by ID
const deleteCategory = (req, res) => {
    const { id } = req.params;
    try {
        const result = Category.deleteCategory(id); // Delete category in the model
        if (result.changes > 0) {
            res.json({ message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error deleting category:', error.message);
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
