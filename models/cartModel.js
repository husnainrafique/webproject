const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./my_database.db');

// Get all items in a cart
const getCartItems = (cartId) => {
    return db.prepare(`
        SELECT cp.cart_id, cp.product_id, p.name,p.image_url,p.description, p.price, cp.quantity
        FROM cart_products cp
        JOIN products p ON cp.product_id = p.id
        WHERE cp.cart_id = ?;
    `).all(cartId);
};

// Get a specific cart by user ID
const getCartByUserId = (userId) => {
    return db.prepare('SELECT * FROM carts WHERE user_id = ? AND status = \'new\'').get(userId);
};


// Create a new cart
const createCart = (userId) => {
    const stmt = db.prepare('INSERT INTO carts (user_id, status) VALUES (?, \'new\')');
    return stmt.run(userId);
};

// Add a product to the cart
const addProductToCart = (cartId, productId, quantity) => {
    const cartProduct = db.prepare('SELECT * FROM cart_products WHERE cart_id = ? AND product_id = ?').get(cartId, productId);
    if (cartProduct) {
        // Update quantity if the product exists in the cart
        const stmt = db.prepare('UPDATE cart_products SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?');
        return stmt.run(quantity, cartId, productId);
    } else {
        // Add a new product to the cart
        const stmt = db.prepare('INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)');
        return stmt.run(cartId, productId, quantity);
    }
};

// Update product quantity in the cart
const updateProductQuantity = (cartId, productId, quantity) => {
    const stmt = db.prepare('UPDATE cart_products SET quantity = ? WHERE cart_id = ? AND product_id = ?');
    return stmt.run(quantity, cartId, productId);
};

// Remove a product from the cart
const removeProductFromCart = (cartId, productId) => {
    const stmt = db.prepare('DELETE FROM cart_products WHERE cart_id = ? AND product_id = ?');
    return stmt.run(cartId, productId);
};

// Checkout a cart
const checkoutCart = (cartId) => {
    const stmt = db.prepare('UPDATE carts SET status = \'purchased\' WHERE id = ?');
    return stmt.run(cartId);
};

module.exports = {
    getCartItems,
    getCartByUserId,
    createCart,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    checkoutCart
};
