document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);

        document.getElementById('registerName').addEventListener('blur', validateName);
        document.getElementById('registerMobile').addEventListener('blur', validateMobile);
        document.getElementById('registerEmail').addEventListener('blur', validateEmail);
        document.getElementById('registerPassword').addEventListener('blur', validatePassword);
        document.getElementById('registerConfirmPassword').addEventListener('blur', validateConfirmPassword);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function validateName() {
    const name = document.getElementById('registerName');
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)+$/;
    if (!nameRegex.test(name.value)) {
        name.setCustomValidity('Please enter your full name (minimum two names).');
    } else {
        name.setCustomValidity('');
    }
    name.reportValidity();
}

function validateMobile() {
    const mobile = document.getElementById('registerMobile');
    const mobileRegex = /^(?:\+201|01)[0125][0-9]{8}$/;
    if (!mobileRegex.test(mobile.value)) {
        mobile.setCustomValidity('Please enter a valid Egyptian mobile number.');
    } else {
        mobile.setCustomValidity('');
    }
    mobile.reportValidity();
}

function validateEmail() {
    const email = document.getElementById('registerEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|co|ai|io)$/;
    if (!emailRegex.test(email.value)) {
        email.setCustomValidity('Please enter an email with a valid domain (com, net, org, co, ai, io).');
    } else {
        email.setCustomValidity('');
    }
    email.reportValidity();
}

function validatePassword() {
    const password = document.getElementById('registerPassword');
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password.value)) {
        password.setCustomValidity('Password must be at least 8 characters long, include 1 number, 1 uppercase letter, 1 lowercase letter, 1 special character, and be in English only.');
    } else {
        password.setCustomValidity('');
    }
    password.reportValidity();
}

function validateConfirmPassword() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword');
    if (confirmPassword.value !== password) {
        confirmPassword.setCustomValidity('Passwords do not match!');
    } else {
        confirmPassword.setCustomValidity('');
    }
    confirmPassword.reportValidity();
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const mobile = document.getElementById('registerMobile').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    const form = document.querySelector('form');
    if (!form.checkValidity()) {
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert('User already exists!');
    } else {
        users.push({ name, mobile, email, password, userType });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful!');
        window.location.href = 'login.html';
    }
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Login successful!');
        if (user.userType === 'seller') {
            window.location.href = '../pages/admin.html';
        } else {
            window.location.href = '../pages/customer.html';
        }
    } else {
        alert('Invalid email or password!');
    }
}