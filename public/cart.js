const cartTableBody = document.querySelector(".cart-table tbody");
const summarySection = document.querySelector(".cart-summary");
const user_id = localStorage.getItem("user_id");
// Fetch and display cart items
async function fetchCart(userId) {
  try {
    const response = await fetch(`/api/cart/${userId}`);
    const data = await response.json();
    if (response.ok) {
      if (data.items.length > 0) {
        renderCartItems(data.items, data.cart_id); // Pass cart_id to render function
        updateSummary(data.items);
      }
      else {
        showEmptyCartMessage()
      }
    } else {
      alert(`Error fetching cart: ${data.message}`);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

function showEmptyCartMessage() {
    cartTableBody.innerHTML = ""; // Clear cart table
    summarySection.innerHTML = `
        <div class="empty-cart">
            <p>Your cart is empty.</p>
            <button class="go-back" onclick="window.location.href='/product.html'">Go Back to Shop</button>
        </div>
    `;
}

// Render cart items dynamically
function renderCartItems(items) {
  cartTableBody.innerHTML = ""; // Clear previous items
  items.forEach((item) => {
    const row = document.createElement("tr");
    row.classList.add("cart-single-item");

    // Dynamically get cart_id from each item
    row.innerHTML = `
            <td>
                <div class="cart item-details">
                    <img src="./${item.image_url}" alt="${
      item.name
    }" class="item-image">
                    <div>
                        <h1>${item.name}</h1>
                        <p class="description">${item.description}</p>
                        <p class="item-price">$${item.price}</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="item-quantity">
                    <input class="quantity-value" type="number" min="1" value="${
                      item.quantity
                    }" data-product-id="${item.product_id}" data-cart-id="${
      item.cart_id
    }">
                    <div class="edit-btn-wrapper">
                        <button class="update" data-product-id="${
                          item.product_id
                        }" data-cart-id="${item.cart_id}">Update</button>
                        <button class="remove" data-product-id="${
                          item.product_id
                        }" data-cart-id="${item.cart_id}">Remove</button>
                    </div>
                </div>
            </td>
            <td>
                <p class="item-total">$${(item.price * item.quantity).toFixed(
                  2
                )}</p>
            </td>
        `;

    cartTableBody.appendChild(row);
  });
}

// Update cart summary
function updateSummary(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.0675; // Example tax rate of 6.75%
  const deliveryFee = 5.0;
  const total = subtotal + tax + deliveryFee;

  summarySection.innerHTML = `
        <p><b>Subtotal:</b> $${subtotal.toFixed(2)}</p>
        <p><b>Tax (6.75%):</b> $${tax.toFixed(2)}</p>
        <p><b>Delivery Fee:</b> $${deliveryFee.toFixed(2)}</p>
        <p><b>Total:</b> $${total.toFixed(2)}</p>
        <button class="add-to-cart checkout" data-cart-id="${
          items[0]?.cart_id
        }">Proceed to Checkout</button>
    `;
}

// Add event listeners for update and remove buttons
cartTableBody.addEventListener("click", async (event) => {
  const button = event.target;

  // Update product quantity
  if (button.classList.contains("update")) {
    const productId = button.dataset.productId;
    const cartId = button.dataset.cartId; // Get cart_id from button
    const quantityInput = cartTableBody.querySelector(
      `input[data-product-id="${productId}"][data-cart-id="${cartId}"]`
    );

    try {
      const response = await fetch(`/api/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartId, // Use dynamic cart_id
          product_id: productId,
          quantity: parseInt(quantityInput.value, 10),
        }),
      });

      if (response.ok) {
        alert("Cart updated successfully!");
        fetchCart(user_id); // Refresh cart
      } else {
        const data = await response.json();
        alert(`Error updating cart: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }

  // Remove product from cart
  if (button.classList.contains("remove")) {
    const productId = button.dataset.productId;
    const cartId = button.dataset.cartId; // Get cart_id from button

    try {
      const response = await fetch(`/api/cart/${cartId}/${productId}`, {
        // Use dynamic cart_id
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product removed from cart!");
        fetchCart(user_id); // Refresh cart
      } else {
        const data = await response.json();
        alert(`Error removing product: ${data.message}`);
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  }
});

// Add event listeners for checkout button
summarySection.addEventListener("click", async (event) => {
  const button = event.target;

  // Proceed to checkout
  if (button.classList.contains("checkout")) {
    const cartId = button.dataset.cartId; // Get cart_id dynamically from summary

    try {
      const response = await fetch(`/api/cart/checkout/${cartId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartId, // Use dynamic cart_id
        }),
      });

      if (response.ok) {
        alert("Cart checked out successfully!");
        fetchCart(user_id); // Refresh cart
      } else {
        const data = await response.json();
        alert(`Error during checkout: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  }
});

// Example: Fetch and render cart for user with ID 1 on page load
if(user_id != null)
  fetchCart(user_id);
