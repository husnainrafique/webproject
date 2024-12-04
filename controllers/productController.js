const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./my_database.db');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use unique filename
    }
});

const upload = multer({ storage: storage });

// Get All Products
const getAllProducts = (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM products').all(); // Fetch products from the database
        console.log('Products fetched from database:', products); // Debug: Log fetched products
        res.json(products); // Send JSON response for CSR
    } catch (error) {
        console.error('Error retrieving products:', error.message); // Debug: Log error
        res.status(500).json({ message: 'Error retrieving products', error: error.message }); // Respond with error
    }
};

// Get Product by ID
const getProductById = (req, res) => {
    try {
        const { id } = req.params; // Extract product ID from the URL params
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id); // Fetch product by ID

        if (product) {
            console.log('Product fetched:', product); // Debug: Log fetched product
            res.json(product); // Send the product details as the response
        } else {
            res.status(404).json({ message: 'Product not found' }); // Return 404 if product not found
        }
    } catch (error) {
        console.error('Error retrieving product by ID:', error.message); // Debug: Log error
        res.status(500).json({ message: 'Error retrieving product', error: error.message }); // Return 500 for errors
    }
};

const createProduct = (req, res) => {
    try {
        console.log(req.body); // Debug: log the request body
        const { name, price, category_id, description } = req.body;
        
        // Ensure the path is stored correctly
        let image_url = null;
        if (req.file) {
            // Extract only the relative path from the file stored in public/images/
            image_url = 'images/' + req.file.filename; // Use req.file.filename for the file name
        }

        // Insert product data into the database
        const stmt = db.prepare('INSERT INTO products (name, price, category_id, description, image_url) VALUES (?, ?, ?, ?, ?)');
        stmt.run(name, price, category_id, description, image_url); // Insert new product into the database

        console.log('Product created:', { name, price, category_id, description, image_url }); // Debug: Log created product
        res.status(201).json({ message: 'Product created successfully', product: { name, price, category_id, description, image_url } });
    } catch (error) {
        console.error('Error creating product:', error.message); // Debug: Log error
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Search Products by Name
const searchProductsByName = (req, res) => {
    try {
        const { name } =  req.params;;
        console.log('Query executed:', `SELECT * FROM products WHERE name LIKE COLLATE NOCASE`);

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: 'Search term is required' });
        }

        // Use a case-insensitive query with wildcards
        const query = 'SELECT * FROM products WHERE name LIKE ? COLLATE NOCASE';
        const products = db.prepare(query).all(`%${name.trim()}%`);
        console.log('Query executed:', `SELECT * FROM products WHERE name LIKE '%${name.trim()}%' COLLATE NOCASE`);

        if (products.length > 0) {
            console.log('Search results:', products); // Debug
            res.json(products);
        } else {
            res.status(404).json({ message: 'No products found matching the search criteria' });
        }
    } catch (error) {
        console.error('Error searching for products:', error.message);
        res.status(500).json({ message: 'Error searching for products', error: error.message });
    }
};


// Update Product
const updateProduct = (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category_id, description } = req.body;

        // Initialize query and parameters
        let query = 'UPDATE products SET name = ?, price = ?, category_id = ?, description = ?';
        let params = [name, price, category_id, description];
        console.log("file",req.file)
        // If a file is file, include the image_url in the query and parameters
        if (req.file) {
            const image_url = 'images/' + req.file.filename;
            query += ', image_url = ?';
            console.log("imggg",image_url)
            params.push(image_url);
        }

        // Add the WHERE condition to specify the product to update
        query += ' WHERE id = ?';
        params.push(id);

        // Prepare the SQL statement
        const stmt = db.prepare(query);
        const result = stmt.run(...params);  // Use the spread operator to pass the params dynamically

        if (result.changes > 0) {
            console.log('Product updated:', { id, name, price, category_id, description });
            res.json({ message: 'Product updated successfully', product: { id, name, price, category_id, description } });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};


// Delete Product
const deleteProduct = (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        const result = stmt.run(id); // Delete product from the database

        if (result.changes > 0) {
            console.log('Product deleted:', { id }); // Debug: Log deleted product
            res.json({ message: 'Product deleted successfully', id });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error.message); // Debug: Log error
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct,getProductById,searchProductsByName, upload };
