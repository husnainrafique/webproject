const authButton = document.getElementById("authButton");
const userId = localStorage.getItem("user_id");

function updateAuthButton() {
    if (userId) {
        authButton.textContent = "SIGN OUT";
        authButton.href = "#"; // Prevent navigation
        authButton.addEventListener("click", handleSignOut);
    } else {
        authButton.textContent = "SIGN IN";
        authButton.href = "login.html";
        authButton.removeEventListener("click", handleSignOut);
    }
}

function handleSignOut(event) {
    event.preventDefault();
    localStorage.removeItem("user_id"); // Clear user session
    alert("You have signed out successfully.");
    updateAuthButton(); // Update button state
    window.location.href = "index.html"; // Redirect to home
}

// Initial call to set up the button state
updateAuthButton();



document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch categories from the API
        const response = await fetch('/api/categories'); // Replace with your correct API endpoint
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categories = await response.json();
        
        // Get the dropdown element
        const categorySelect = document.getElementById('product-category');

        // Populate the dropdown with options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;  // Set the value to category ID (Fruits = 1, Vegetables = 2)
            option.textContent = category.name;  // Set the text to category name (Fruits, Vegetables)
            categorySelect.appendChild(option);  // Add the option to the select element
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Error loading categories.');
    }
});

    document.getElementById('product-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        
        try {
            console.log(formData)
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert('Product added successfully');
            window.location.href = 'admin-products.html'; // Redirect to product listing page
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product');
        }
    });