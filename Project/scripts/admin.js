document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const productForm = document.getElementById('productForm');
    const logoutButton = document.getElementById('logoutButton');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
        loadProducts();
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

async function fetchApiProducts() {
    try {
        const response = await fetch('https://fakestoreapi.in/api/products');
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Error fetching API products:', error);
        return [];
    }
}

async function loadProducts() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const productTableBody = document.querySelector('#productTable tbody');
    productTableBody.innerHTML = '';

    const apiProducts = await fetchApiProducts();
    const localProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    const adminProducts = localProducts.filter(product => product.adminEmail === loggedInUser.email);
    const allProducts = [...apiProducts, ...adminProducts];

    allProducts.forEach(product => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td><img src="${product.image}" alt="${product.name}" width="50"></td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;

        productTableBody.appendChild(row);
    });
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    alert('Logged out successfully!');
    window.location.href = '../index.html';
}

function handleRegister(event) {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert('User already exists!');
    } else {
        users.push({ email, password, role: 'admin' });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful!');
        window.location.href = 'login.html';
    }
}

function handleProductSubmit(event) {
    event.preventDefault();

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productImage = document.getElementById('productImage').value;
    const productCategory = document.getElementById('productCategory').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productStock = document.getElementById('productStock').value;

    let products = JSON.parse(localStorage.getItem('products')) || [];

    if (productId) {
        products = products.map(product => product.id === parseInt(productId) && product.adminEmail === loggedInUser.email ? {
            id: parseInt(productId),
            name: productName,
            image: productImage,
            category: productCategory,
            price: productPrice,
            description: productDescription,
            stock: productStock,
            adminEmail: loggedInUser.email
        } : product);
    } else {
        const newProduct = {
            id: Date.now(),
            name: productName,
            image: productImage,
            category: productCategory,
            price: productPrice,
            description: productDescription,
            stock: productStock,
            adminEmail: loggedInUser.email
        };
        products.push(newProduct);
    }

    localStorage.setItem('products', JSON.stringify(products));
    alert('Product saved successfully!');
    loadProducts();
    productForm.reset();
}

function editProduct(id) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.id === id && product.adminEmail === loggedInUser.email);

    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productStock').value = product.stock;
    } else {
        alert('You do not have permission to edit this product.');
    }
}

function deleteProduct(id) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    const product = products.find(product => product.id === id);

    if (product && product.adminEmail === loggedInUser.email) {
        products = products.filter(product => product.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        alert('Product deleted successfully!');
        loadProducts();
    } else {
        alert('You do not have permission to delete this product.');
    }
}
