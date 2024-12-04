       // Extract the 'id' from the URL
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

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id'); // Extract the product ID from the URL

        if (productId) {
            try {
                // Fetch the product details using the product ID
                const response = await fetch(`/api/products/${productId}`);

                if (!response.ok) {
                    throw new Error('Product not found');
                }

                const product = await response.json();

                // Populate the form with the product data
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-category').value = product.category_id;
                document.getElementById('current-product-image').src = './' + product.image_url.replace(/\\/g, '/');

            } catch (error) {
                console.error('Error fetching product data:', error);
                alert('Error fetching product data');
            }
        } else {
            alert('No product ID in URL');
        }
    });

    // Form submission (handles both updating text data and image upload)
    document.getElementById('edit-product-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id'); // Get the product ID from the URL

        if (productId) {
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'PUT',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to update product');
                }

                alert('Product updated successfully!');
            } catch (error) {
                console.error('Error updating product:', error);
                alert('Error updating product');
            }
        }
    });