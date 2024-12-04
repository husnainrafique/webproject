const express = require("express");
const router = express.Router();

const {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout,
} = require("../controllers/cartController");

router.get("/cart/:user_id", getUserCart);
router.post("/cart", addToCart);
router.put("/cart/update", updateCartItem);
router.delete("/cart/:cart_id/:product_id", removeFromCart);
router.post("/cart/checkout/:cart_id", checkout);
module.exports = router;
