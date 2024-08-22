function loadData() {
    const userName = localStorage.getItem('name');
    const userPhone = localStorage.getItem('mobile');
    const address = localStorage.getItem('address');
    const city = localStorage.getItem('city');
    const zipcode = localStorage.getItem('zipcode');
    const additionalFee = localStorage.getItem('additionalFee');
    const totalAmount = localStorage.getItem('totalAmount');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const shippingCost = 5.00; 
    const grandTotal = totalAmount ? parseFloat(totalAmount) + shippingCost + parseFloat(additionalFee || '0') : 0;

    return {
        userName,
        userPhone,
        address,
        city,
        zipcode,
        cart,
        totalAmount: parseFloat(totalAmount || '0'),
        shippingCost,
        additionalFee: parseFloat(additionalFee || '0'),
        grandTotal
    };
}

function displayConfirmation() {
    const data = loadData();

    if (!data.userName || !data.address || !data.city || !data.zipcode) {
        alert('Incomplete order details. Please complete the payment process.');
        window.location.href = 'payment.html';
        return;
    }

    const congratulationsMessage = document.getElementById('congratulationsMessage');
    const orderedItems = document.getElementById('orderedItems');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userPhoneDisplay = document.getElementById('userPhoneDisplay');
    const shippingAddress = document.getElementById('shippingAddress');
    const totalPrice = document.getElementById('totalPrice');

    if (congratulationsMessage) {
        congratulationsMessage.textContent = `Congratulations ${data.userName}! Your order has been placed successfully.`;
    }

    if (orderedItems) {
        data.cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <h4>${item.title || item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
            `;
            orderedItems.appendChild(itemDiv);
        });
    }

    if (userNameDisplay) {
        userNameDisplay.textContent = `Name: ${data.userName}`;
    }

    if (userPhoneDisplay) {
        userPhoneDisplay.textContent = `Phone: ${data.userPhone}`;
    }

    if (shippingAddress) {
        shippingAddress.textContent = `Address: ${data.address}, ${data.city}, ${data.zipcode}`;
    }

    if (totalPrice) {
        totalPrice.innerHTML = `
            <p>Total Price of Products: $${data.totalAmount.toFixed(2)}</p>
            <p>Shipping Cost: $${data.shippingCost.toFixed(2)}</p>
            <p>Additional Fee: $${data.additionalFee.toFixed(2)}</p>
            <h3>Grand Total: $${data.grandTotal.toFixed(2)}</h3>
        `;
    }
}

function goBackToShopping() {
    window.location.href = '../pages/customer.html';
}

function clearLocalStorage() {
    localStorage.removeItem('name');
    localStorage.removeItem('mobile');
    localStorage.removeItem('address');
    localStorage.removeItem('city');
    localStorage.removeItem('zipcode');
    localStorage.removeItem('additionalFee');
    localStorage.removeItem('totalAmount');
    localStorage.removeItem('cart');
}

document.addEventListener('DOMContentLoaded', () => {
    displayConfirmation();
    clearLocalStorage();

    const backToShoppingButton = document.getElementById('backToShopping');
    if (backToShoppingButton) {
        backToShoppingButton.addEventListener('click', goBackToShopping);
    }
});