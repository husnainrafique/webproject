const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  searchProductsByName,
  upload,
} = require("../controllers/productController");

// Define Routes
router.get("/products", getAllProducts); // Get all products
router.get("/products/:id", getProductById); // Get all products
router.post("/products", upload.single("productImage"), createProduct); // Create a new product with image upload
router.put("/products/:id", upload.single("productImage"), updateProduct); // Update product by ID with optional image upload
router.delete("/products/:id", deleteProduct); // Delete product by ID
router.get('/products/search/:name', searchProductsByName);
module.exports = router;
