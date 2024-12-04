document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/products'); // Fetch the products
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        const container = document.getElementById('product-container');

        // Loop through the products and create HTML dynamically
        products.forEach(product => {
            const productSection = document.createElement('section');
            productSection.classList.add('product-details', 'row');
            
            const productImage = document.createElement('div');
            productImage.classList.add('product-image', 'col-half');
            const imgElement = document.createElement('img');
            imgElement.src = './' + product.image_url; // Assuming image_url is the filename
            imgElement.alt = product.name;
            productImage.appendChild(imgElement);
            
            const productInfo = document.createElement('div');
            productInfo.classList.add('product-info', 'col-half');
            
            const topArea = document.createElement('div');
            topArea.classList.add('top-area');
            
            const productName = document.createElement('h1');
            productName.classList.add('product-name');
            productName.textContent = product.name;

            const description = document.createElement('p');
            description.classList.add('description');
            description.textContent = product.description;

            const extraInfo = document.createElement('p');
            extraInfo.classList.add('extra-info');
            extraInfo.innerHTML = `<b>Dimensions:</b> ${product.dimensions || 'N/A'}`;
            
            const availability = document.createElement('p');
            availability.classList.add('availability');
            availability.innerHTML = `<b>Availability:</b> ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}`;
            
            topArea.appendChild(productName);
            topArea.appendChild(description);
            topArea.appendChild(extraInfo);
            topArea.appendChild(availability);
            
            const bottomArea = document.createElement('div');
            bottomArea.classList.add('bottom-area');
            
            const price = document.createElement('p');
            price.classList.add('price');
            price.innerHTML = `<span>$</span>${product.price}`;

            const addToCart = document.createElement('a');
            addToCart.classList.add('add-to-cart');
            addToCart.href = '#';
            addToCart.textContent = 'Add to Cart';
            addToCart.setAttribute('data-product-id', product.id); // Store product id in data attribute

            // Add click event to handle adding the product to the cart
            addToCart.addEventListener('click', async (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                
                const user_id = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage
                const quantity = 1; // Set default quantity to 1

                if (!user_id) {
                    alert('You need to log in to add items to your cart.');
                    return;
                }

                try {
                    const response = await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id,
                            product_id: product.id,
                            quantity
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add product to cart');
                    }

                    const result = await response.json();
                    alert(result.message); // Show success message
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Error adding to cart.');
                }
            });

            bottomArea.appendChild(price);
            bottomArea.appendChild(addToCart);

            productInfo.appendChild(topArea);
            productInfo.appendChild(bottomArea);

            productSection.appendChild(productImage);
            productSection.appendChild(productInfo);

            container.appendChild(productSection);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Error loading products.');
    }
});
