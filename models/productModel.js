// Mock data
let products = [
    { id: 1, name: "Product A", price: 100 },
    { id: 2, name: "Product B", price: 200 },
];

// Stub methods
exports.getAllProducts = () => {
    return products;
};

exports.createProduct = (data) => {
    const newProduct = { id: products.length + 1, ...data };
    products.push(newProduct);
    return newProduct;
};

exports.updateProduct = (id, data) => {
    const index = products.findIndex(product => product.id == id);
    if (index !== -1) {
        products[index] = { ...products[index], ...data };
        return products[index];
    }
    return null;
};

exports.deleteProduct = (id) => {
    const index = products.findIndex(product => product.id == id);
    if (index !== -1) {
        return products.splice(index, 1);
    }
    return null;
};
