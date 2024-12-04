const {
    getCartItems,
    getCartByUserId,
    createCart,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    checkoutCart
} = require('../models/cartModel');

// Get user's cart
const getUserCart = (req, res) => {
    const { user_id } = req.params;

    try {
        let cart = getCartByUserId(user_id);

        if (!cart) {
            // Create a new cart if none exists
            const result = createCart(user_id);
            cart = { id: result.lastInsertRowid };
        }

        const items = getCartItems(cart.id);
        res.json({ cart, items });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Unable to fetch cart', error });
    }
};

// Add product to cart
const addToCart = (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    try {
        let cart = getCartByUserId(user_id);

        if (!cart) {
            const result = createCart(user_id);
            cart = { id: result.lastInsertRowid };
        }

        addProductToCart(cart.id, product_id, quantity);
        res.status(201).json({ message: 'Product added to cart', cart_id: cart.id });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Unable to add product to cart', error });
    }
};

// Update product quantity in cart
const updateCartItem = (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    try {
        updateProductQuantity(cart_id, product_id, quantity);
        res.json({ message: 'Cart item updated successfully' });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Unable to update cart item', error });
    }
};

// Remove product from cart
const removeFromCart = (req, res) => {
    const { cart_id, product_id } = req.params;

    try {
        removeProductFromCart(cart_id, product_id);
        res.json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Unable to remove product from cart', error });
    }
};

// Checkout
const checkout = (req, res) => {
    const { cart_id } = req.params;

    try {
        checkoutCart(cart_id);
        res.json({ message: 'Cart checked out successfully' });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Unable to checkout', error });
    }
};

module.exports = {
    getUserCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    checkout
};
