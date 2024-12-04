async function fetchProducts() {
    try {

        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categoriesRes = await fetch('/api/categories'); // Replace with your correct API endpoint
        if (!categoriesRes.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categories = await categoriesRes.json();
        const products = await response.json();
        const productTable = document.getElementById('product-list');
        
        products.forEach(product => {
            const row = document.createElement('tr');
            const category = categories.find(cat => cat.id === product.category_id);
            const categoryName = category ? category.name : 'Unknown'; // Default to 'Unknown' if no category is found

            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${categoryName}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <a href="product-edit.html?id=${product.id}">Edit</a> | 
                    <a href="#" onclick="deleteProduct(${product.id})">Delete</a> | 
                    <a href="#">Archive</a>
                </td>
            `;
            productTable.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert('Product deleted successfully');
        location.reload();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
    }
}

document.addEventListener('DOMContentLoaded', fetchProducts);