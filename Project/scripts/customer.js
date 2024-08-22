let cart = [];
let allProducts = [];
let categories = new Set();

async function fetchProducts() {
    try {
        const apiResponse = await fetch('https://fakestoreapi.in/api/products');
        const apiData = await apiResponse.json();
        const apiProducts = apiData.products || [];
        
        const localProducts = JSON.parse(localStorage.getItem('products')) || [];
        
        allProducts = [...apiProducts, ...localProducts];

        allProducts.forEach(product => categories.add(product.category));
        populateCategoryDropdown();
        
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function populateCategoryDropdown() {
    const categoryDropdown = document.getElementById('categoryDropdown');
    categoryDropdown.innerHTML = '<option value="">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });
}

function displayProducts(products) {
    const productContainer = document.getElementById('productList');
    productContainer.innerHTML = '';

    if (products.length === 0) {
        productContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-card');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title || product.name}">
            <h4 class="product-title">${product.title || product.name}</h4>
            <p>Category: ${product.category}</p>
            <p>Description: ${product.description}</p>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productDiv);
    });
}


function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        displayCart();
    }
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateLocalStorage();
    displayCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateLocalStorage();
    displayCart();
}

function displayCart() {
    const cartContainer = document.getElementById('shoppingCart');
    const cartHeader = document.querySelector('h3');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        cartHeader.style.display = 'none';
        return;
    }

    cartContainer.style.display = 'block';
    cartHeader.style.display = 'block';

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <h4>${item.title || item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
            <p>Total: $${item.price * item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove from Cart</button>`
        ;
        cartContainer.appendChild(cartItemDiv);
    });

    const paymentButton = document.createElement('button');
    paymentButton.id = 'continueToPaymentButton';
    paymentButton.textContent = 'Continue to Payment';
    paymentButton.onclick = () => redirectToPayment();
    cartContainer.appendChild(paymentButton);
}

function redirectToPayment() {
    updateLocalStorage();
    window.location.href = '../pages/payment.html';
}

function filterProducts() {
    const filterValue = document.getElementById('filterCategory').value.trim().toLowerCase();
    const selectedCategory = document.getElementById('categoryDropdown').value;

    let filteredProducts = allProducts;

    if (filterValue.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const words = (product.title || product.name).toLowerCase().split(' ');
            return words.some(word => word.startsWith(filterValue));
        });
    }

    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    displayProducts(filteredProducts);

    if (filteredProducts.length === 0) {
        const productContainer = document.getElementById('productList');
        productContainer.innerHTML = '<p>No products found.</p>';
    }
}

function displayWelcomeMessage() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        if (user) {
            const welcomeMessage = `Welcome ${user.name}`;
            const header = document.createElement('h2');
            header.textContent = welcomeMessage;

            const mainHeader = document.querySelector('h1');
            if (mainHeader) {
                mainHeader.insertAdjacentElement('afterend', header);
            }
        }
    }
}

document.getElementById('filterCategory').addEventListener('input', filterProducts);
document.getElementById('categoryDropdown').addEventListener('change', filterProducts);
document.getElementById('filterButton').addEventListener('click', filterProducts);

fetchProducts();
loadCartFromLocalStorage();
displayWelcomeMessage();

function handleLogout() {
    localStorage.removeItem('cart');
    window.location.href = '../index.html';
}

document.getElementById('logoutButton').addEventListener('click', handleLogout);