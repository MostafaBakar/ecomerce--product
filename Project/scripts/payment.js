function loadCart() {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function displayCartItems() {
    const cart = loadCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountContainer = document.getElementById('totalAmount');
    const shippingCostContainer = document.getElementById('shippingCost');
    const additionalFeeContainer = document.getElementById('additionalFee');
    cartItemsContainer.innerHTML = '';
    let totalAmount = 0;
    const shippingCost = 5.00;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalAmountContainer.innerHTML = '';
        shippingCostContainer.innerHTML = '';
        additionalFeeContainer.innerHTML = '';
        return;
    }

    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <h4>${item.title || item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
            <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
            <button onclick="removeItemFromCart(${index})">Delete</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
        totalAmount += item.price * item.quantity;
    });

    totalAmountContainer.innerHTML = `<p>Total Price of Products: $${totalAmount.toFixed(2)}</p>`;
    shippingCostContainer.innerHTML = `<p>Shipping Cost: $${shippingCost.toFixed(2)}</p>`;
    updateAdditionalFee(totalAmount, shippingCost); 
}

function removeItemFromCart(index) {
    const cart = loadCart();
    cart.splice(index, 1); 
    saveCart(cart); 
    displayCartItems(); 
}

function handlePayment() {
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipcode = document.getElementById('zipcode').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    const shippingCost = 5.00; 
    
    if (loadCart().length === 0) {
        alert('Your cart is empty. Please add items to your cart before proceeding.');
        return; 
    }

    if (!address || !city || !zipcode) {
        alert('Please fill in all shipping address fields.');
        return;
    }

    if (paymentMethod === 'online') {
        const cardNumber = document.getElementById('cardNumber')?.value.trim();
        const expiryDate = document.getElementById('expiryDate')?.value.trim();
        const cvv = document.getElementById('cvv')?.value.trim();

        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all credit card details.');
            return;
        }
    }

    localStorage.setItem('name', document.getElementById('name')?.value.trim());
    localStorage.setItem('mobile', document.getElementById('mobile')?.value.trim());
    localStorage.setItem('address', address);
    localStorage.setItem('city', city);
    localStorage.setItem('zipcode', zipcode);
    
    const totalAmount = loadCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const additionalFee = paymentMethod === 'cash' ? 5.00 : 0.00;

    localStorage.setItem('additionalFee', additionalFee);

    localStorage.setItem('totalAmount', totalAmount);
    localStorage.setItem('shippingCost', shippingCost);
    localStorage.setItem('grandTotal', totalAmount + shippingCost + additionalFee);

    localStorage.removeItem('cart');

    window.location.href = '../pages/confirmation.html';
}

function updateAdditionalFee(totalAmount, shippingCost) {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const additionalFeeContainer = document.getElementById('additionalFee');
    const additionalFee = paymentMethod === 'cash' ? 5.00 : 0.00;
    const grandTotal = totalAmount + shippingCost + additionalFee;

    additionalFeeContainer.innerHTML = `
        <p>Additional Fee: $${additionalFee.toFixed(2)}</p>
        <h3>Grand Total: $${grandTotal.toFixed(2)}</h3>
    `;
}

function validateForm() {
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zipcode = document.getElementById('zipcode').value;
    const payButton = document.getElementById('payButton');

    const isCartNotEmpty = loadCart().length > 0;
    payButton.disabled = !(address && city && zipcode && isCartNotEmpty);
}

function togglePaymentDetails() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const onlinePaymentDetails = document.getElementById('onlinePaymentDetails');
    onlinePaymentDetails.style.display = paymentMethod === 'online' ? 'block' : 'none';

    const totalAmount = loadCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateAdditionalFee(totalAmount, 5.00); 
}

function displayUserInfo() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        const nameField = document.getElementById('name');
        const mobileField = document.getElementById('mobile');

        if (nameField) {
            nameField.value = loggedInUser.name || '';
        }

        if (mobileField) {
            mobileField.value = loggedInUser.mobile || '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayUserInfo();
    displayCartItems();
    togglePaymentDetails();
});


document.querySelectorAll('input[name="paymentMethod"]').forEach((element) => {
    element.addEventListener('change', () => {
        togglePaymentDetails();
    });
});

document.querySelectorAll('#paymentForm input').forEach((input) => {
    input.addEventListener('input', validateForm);
});

document.getElementById('payButton').addEventListener('click', handlePayment);