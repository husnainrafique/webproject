const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./my_database.db');

// Get all categories
const getAllCategories = () => {
    return db.prepare('SELECT * FROM categories').all(); // Fetch all categories
};

// Get a category by ID
const getCategoryById = (id) => {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id); // Fetch a category by ID
};

// Create a new category
const createCategory = (name, priority) => {
    const stmt = db.prepare('INSERT INTO categories (name, priority) VALUES (?, ?)');
    return stmt.run(name, priority); // Insert new category into the database
};

// Update an existing category
const updateCategory = (id, name, priority) => {
    const stmt = db.prepare('UPDATE categories SET name = ?, priority = ? WHERE id = ?');
    return stmt.run(name, priority, id); // Update category based on ID
};

// Delete a category by ID
const deleteCategory = (id) => {
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    return stmt.run(id); // Delete category based on ID
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
