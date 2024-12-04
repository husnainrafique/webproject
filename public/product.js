document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');

    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        products.forEach(product => {
            const productCard = document.createElement('li');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                    <figure>
                        <img src="./${product.image_url.replace(/\\/g, '/')}" alt="${product.name}">
                        <figcaption>
                            <b>${product.name}<br>
                            Price: $${product.price.toFixed(2)}<br>
                            <a href="pro-details.html?id=${product.id}"><button class="button">View More</button></a></b>
                        </figcaption>
                    </figure>
                `;


            productList.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});
