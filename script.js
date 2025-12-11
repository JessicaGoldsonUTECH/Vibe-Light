// IA#2: JavaScript for Vibe & Light E-Commerce
// Student: Jessica Goldson | ID: 2405416

// IA#2: Cart array to store products
var cart = [];
var currentUser = null;
var invoices = [];

// Store all registered customers with TRN, cart & invoices
var REGISTRATION_KEY = 'RegistrationData';
var ALL_INVOICES_KEY = 'AllInvoices';
var ALL_PRODUCTS_KEY = 'AllProducts';

// Helper: safely parse JSON
function safeParse(json, fallback) {
    try {
        return json ? JSON.parse(json) : fallback;
    } catch (e) {
        return fallback;
    }
}

function getRegistrationData() {
    return safeParse(localStorage.getItem(REGISTRATION_KEY), []);
}

function saveRegistrationData(data) {
    localStorage.setItem(REGISTRATION_KEY, JSON.stringify(data));
}

function getAllInvoices() {
    return safeParse(localStorage.getItem(ALL_INVOICES_KEY), []);
}

function saveAllInvoices(data) {
    localStorage.setItem(ALL_INVOICES_KEY, JSON.stringify(data));
}

function initAllProducts() {
    if (localStorage.getItem(ALL_PRODUCTS_KEY)) return;

    var defaultProducts = [
        {
            id: 1,
            name: 'Lavender Dream',
            price: 15.99,
            category: 'Candle',
            description: 'Relaxing lavender essential oil perfect for bedtime',
            image: 'Assets/lavender_dream.jpg'
        },
        {
            id: 2,
            name: 'Vanilla Bliss',
            price: 14.99,
            category: 'Candle',
            description: 'Sweet vanilla bean for cozy evenings',
            image: 'Assets/Vanilla_Bliss.jpg'
        },
        {
            id: 3,
            name: 'Ocean Breeze',
            price: 16.99,
            category: 'Candle',
            description: 'Fresh ocean scent for summer vibes',
            image: 'Assets/Ocean_Breeze.jpg'
        },
        {
            id: 4,
            name: 'Citrus Burst',
            price: 14.99,
            category: 'Candle',
            description: 'Energizing citrus blend for mornings',
            image: 'Assets/Citrus_Burst.jpg'
        },
        {
            id: 5,
            name: 'Fresh Linen Spray',
            price: 9.99,
            category: 'Spray',
            description: 'Clean and crisp room spray',
            image: 'Assets/Fresh_Linen.jpg'
        },
        {
            id: 6,
            name: 'Eucalyptus Mint Spray',
            price: 10.99,
            category: 'Spray',
            description: 'Refreshing spa-like fragrance',
            image: 'Assets/Eucalyptus_Mint.jpg'
        },
        {
            id: 7,
            name: 'Tropical Paradise Spray',
            price: 10.99,
            category: 'Spray',
            description: 'Exotic tropical fruit blend',
            image: 'Assets/Tropical.jpg'
        }
    ];

    localStorage.setItem(ALL_PRODUCTS_KEY, JSON.stringify(defaultProducts));
}
// IA#2: Load data when page loads
window.onload = function() {
    initAllProducts();
    loadCurrentUser();
    loadCart();
    loadInvoices();
    showCart();
    showCheckout();
    displayInvoiceHistory();
    updateUIForAuth();
    ShowUserFrequency();
    // If invoice-history admin table exists on the page, populate it
    if (document.getElementById('invoiceTableBody')) {
        ShowInvoices(true);
    }
};

// ===================================
// IA#2: AUTHENTICATION FUNCTIONS
// ===================================

// Load current user from localStorage
function loadCurrentUser() {
    var user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
    }
}

// Save current user to localStorage
function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser');
    }
}

// Update UI based on authentication status
function updateUIForAuth() {
    var navLinks = document.querySelector('nav ul');
    if (!navLinks) return;
    
    var loginLink = document.querySelector('a[href="login.html"]');
    var registerLink = document.querySelector('a[href="register.html"]');
    
    if (currentUser) {
        // User is logged in
        if (loginLink) {
            loginLink.textContent = 'Logout (' + currentUser.username + ')';
            loginLink.href = '#';
            loginLink.onclick = function() {
                logout();
                return false;
            };
        }
        if (registerLink) {
            registerLink.style.display = 'none';
        }
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        saveCurrentUser();
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    }
}

// Check if user is logged in before checkout
function checkAuthForCheckout() {
    if (!currentUser) {
        alert('Please login or register to proceed to checkout!');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ===================================
// IA#2: CART FUNCTIONS
// ===================================

// IA#2: Function to add product to cart
function addToCart(name, price) {
    // IA#2: Check if product already in cart
    var found = false;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].quantity = cart[i].quantity + 1;
            found = true;
            break;
        }
    }
    
    // IA#2: If not found, add new product
    if (!found) {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    alert(name + ' added to cart!');
}

// IA#2: Function to remove item from cart
function removeItem(index) {
    if (confirm('Remove this item?')) {
        cart.splice(index, 1);
        saveCart();
        showCart();
    }
}

// IA#2: Function to update quantity
function updateQty(index, qty) {
    qty = parseInt(qty);
    if (qty > 0) {
        cart[index].quantity = qty;
        saveCart();
        showCart();
    } else {
        removeItem(index);
    }
}

// IA#2: Function to clear cart
function clearCart() {
    if (confirm('Clear entire cart?')) {
        cart = [];
        saveCart();
        showCart();
        alert('Cart cleared!');
    }
}

// IA#2: Save cart to localStorage - USER SPECIFIC
function saveCart() {
    //store cart in RegistrationData
    if (currentUser && currentUser.trn) {
        var regData = getRegistrationData();
        for (var i = 0; i < regData.length; i++) {
            if (regData[i].trn === currentUser.trn) {
                regData[i].cart = cart;
                saveRegistrationData(regData);
                break;
            }
        }
    }

    if (currentUser) {
        localStorage.setItem('cart_' + currentUser.username, JSON.stringify(cart));
    } else {
        localStorage.setItem('cart_guest', JSON.stringify(cart));
    }
}

// IA#2: Load cart from localStorage - USER SPECIFIC
function loadCart() {
    if (currentUser && currentUser.trn) {
        var regData = getRegistrationData();
        for (var i = 0; i < regData.length; i++) {
            if (regData[i].trn === currentUser.trn) {
                if (Array.isArray(regData[i].cart)) {
                    cart = regData[i].cart;
                    return;
                }
            }
        }
    }

    if (currentUser) {
        var saved = localStorage.getItem('cart_' + currentUser.username);
        cart = saved ? JSON.parse(saved) : [];
    } else {
        var guestSaved = localStorage.getItem('cart_guest');
        cart = guestSaved ? JSON.parse(guestSaved) : [];
    }
}

// ===================================
// IA#2: DISPLAY CART
// ===================================

// IA#2: Function to display cart on cart page
function showCart() {
    // IA#2: DOM manipulation - get elements
    var table = document.getElementById('cartTable');
    var empty = document.getElementById('emptyMessage');
    var summary = document.getElementById('cartSummary');
    
    if (!table) return;
    
    // IA#2: Clear table except header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    
    // IA#2: Check if cart is empty
    if (cart.length === 0) {
        empty.style.display = 'block';
        summary.style.display = 'none';
        return;
    }
    
    empty.style.display = 'none';
    summary.style.display = 'block';
    
    // IA#2: Calculate totals
    var subtotal = 0;
    
    // IA#2: Loop through cart items
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.quantity;
        subtotal = subtotal + itemTotal;
        
        // IA#2: Create table row
        var row = table.insertRow();
        row.innerHTML = '<td>' + item.name + '</td>' +
                       '<td>$' + item.price.toFixed(2) + '</td>' +
                       '<td><input type="number" value="' + item.quantity + '" min="1" onchange="updateQty(' + i + ', this.value)" style="width:60px;padding:5px;"></td>' +
                       '<td>$' + itemTotal.toFixed(2) + '</td>' +
                       '<td><button onclick="removeItem(' + i + ')">Remove</button></td>';
    }
    
    // IA#2: Calculate discount and tax
    var discount = subtotal * 0.10;
    var tax = (subtotal - discount) * 0.15;
    var total = subtotal - discount + tax;
    
    // IA#2: Update summary
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('discount').textContent = '$' + discount.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

// ===================================
// IA#2: CHECKOUT DISPLAY
// ===================================

// IA#2: Function to show checkout items
function showCheckout() {
    var orderDiv = document.getElementById('orderItems');
    
    if (!orderDiv) return;
    
    // Check authentication
    if (!checkAuthForCheckout()) return;
    
    if (cart.length === 0) {
        orderDiv.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    orderDiv.innerHTML = '';
    var subtotal = 0;
    
    // IA#2: Loop through items
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.quantity;
        subtotal = subtotal + itemTotal;
        
        orderDiv.innerHTML += '<p>' + item.name + ' x ' + item.quantity + ' - $' + itemTotal.toFixed(2) + '</p>';
    }
    
    // IA#2: Calculate totals
    var discount = subtotal * 0.10;
    var tax = (subtotal - discount) * 0.15;
    var total = subtotal - discount + tax;
    
    // IA#2: Update checkout totals
    document.getElementById('checkoutSubtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('checkoutDiscount').textContent = '$' + discount.toFixed(2);
    document.getElementById('checkoutTax').textContent = '$' + tax.toFixed(2);
    document.getElementById('checkoutTotal').textContent = '$' + total.toFixed(2);
    
    // IA#2: Set amount field
    var amountField = document.getElementById('amountPaid');
    if (amountField) {
        amountField.value = total.toFixed(2);
    }
    
    // Pre-fill user info if logged in
    if (currentUser) {
        var nameField = document.getElementById('shippingName');
        var emailField = document.getElementById('shippingEmail');
        if (nameField && currentUser.fullName) nameField.value = currentUser.fullName;
        if (emailField && currentUser.email) emailField.value = currentUser.email;
    }
}

// ===================================
// IA#2: FORM VALIDATION
// ===================================

// IA#2: Validate login form
function validateLogin() {
    // Read TRN & password (TRN uses the old username field)
    var trnOrUsername = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    var valid = true;
    var trnPattern = /^\d{3}-\d{3}-\d{3}$/;

    if (trnOrUsername === '') {
        document.getElementById('usernameError').textContent = 'TRN required';
        valid = false;
    } else if (!trnPattern.test(trnOrUsername)) {
        document.getElementById('usernameError').textContent = 'TRN must be in the format 000-000-000';
        valid = false;
    }
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password required';
        valid = false;
    }

    if (!valid) return false;

    var regData = getRegistrationData();
    var regUser = null;
    for (var i = 0; i < regData.length; i++) {
        if (regData[i].trn === trnOrUsername && regData[i].password === password) {
            regUser = regData[i];
            break;
        }
    }

    if (regUser) {
        currentUser = {
            username: regUser.trn,
            fullName: regUser.firstName + ' ' + (regUser.lastName || ''),
            email: regUser.email,
            trn: regUser.trn
        };
        saveCurrentUser();
        // Clear login attempts on successful login
        localStorage.removeItem('loginAttempts');
        alert('Login successful! Welcome ' + currentUser.fullName);
        window.location.href = 'products.html';
        return false;
    }

    var users = localStorage.getItem('registeredUsers');
    var usersList = users ? JSON.parse(users) : [];
    var foundUser = null;
    for (var j = 0; j < usersList.length; j++) {
        if (usersList[j].username === trnOrUsername && usersList[j].password === password) {
            foundUser = usersList[j];
            break;
        }
    }

    if (foundUser) {
        currentUser = {
            username: foundUser.username,
            fullName: foundUser.fullName,
            email: foundUser.email,
            trn: foundUser.username // treat as TRN
        };
        saveCurrentUser();
        // Clear login attempts on successful login
        localStorage.removeItem('loginAttempts');
        alert('Login successful! Welcome ' + currentUser.username);
        window.location.href = 'products.html';
    } else {
        // Invalid credentials - increment failed attempt counter
        var attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
        localStorage.setItem('loginAttempts', attempts.toString());

        if (attempts >= 3) {
            // Redirect to account locked page after 3 failed attempts
            window.location.href = 'account-locked.html';
        } else {
            // Show remaining attempts
            var attemptsLeft = 3 - attempts;
            alert('Invalid TRN or password! ' + attemptsLeft + ' attempt(s) remaining.');
        }
    }

    return false;
}

function clearLoginForm() {
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var usernameError = document.getElementById('usernameError');
    var passwordError = document.getElementById('passwordError');

    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (usernameError) usernameError.textContent = '';
    if (passwordError) passwordError.textContent = '';
}

// Clear login attempts
function clearLoginAttempts() {
    localStorage.removeItem('loginAttempts');
}

// Clear login attempts and redirect to login page
function clearLoginAttemptsAndReturn() {
    localStorage.removeItem('loginAttempts');
    window.location.href = 'login.html';
}

// IA#2: Validate register form
function validateRegister() {
    // IA#2: Get input values
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var dob = document.getElementById('dob').value;
    var gender = document.getElementById('gender').value;
    var phone = document.getElementById('phone').value;
    var email = document.getElementById('email').value;
    var username = document.getElementById('regUsername').value;   // used as TRN
    var password = document.getElementById('regPassword').value;
    var confirm = document.getElementById('confirmPassword').value;

    // IA#2: Clear errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('dobError').textContent = '';
    document.getElementById('genderError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmError').textContent = '';

    var valid = true;

    // IA#2: Validate names
    if (firstName === '' || lastName === '') {
        document.getElementById('nameError').textContent = 'First and last name required';
        valid = false;
    }

    // IA#2: Validate DOB and age >= 18
    if (dob === '') {
        document.getElementById('dobError').textContent = 'Date of birth required';
        valid = false;
    } else {
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            document.getElementById('dobError').textContent = 'You must be at least 18 years old to register';
            valid = false;
        }
    }

    // IA#2: Validate gender
    if (gender === '') {
        document.getElementById('genderError').textContent = 'Gender required';
        valid = false;
    }

    // IA#2: Validate phone
    if (phone === '') {
        document.getElementById('phoneError').textContent = 'Phone number required';
        valid = false;
    }

    // IA#2: Validate email format
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Valid email required';
        valid = false;
    }

    // IA#2: Validate TRN (stored in username field) with format 000-000-000
    var trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (username === '') {
        document.getElementById('usernameError').textContent = 'TRN required';
        valid = false;
    } else if (!trnPattern.test(username)) {
        document.getElementById('usernameError').textContent = 'TRN must be in the format 000-000-000';
        valid = false;
    }

    // IA#2: Validate password length (8+ characters)
    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be 8+ characters';
        valid = false;
    }

    // IA#2: Check passwords match
    if (password !== confirm) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
        valid = false;
    }

    // IA#2: If valid, register
    if (valid) {
        var users = localStorage.getItem('registeredUsers');
        var usersList = users ? JSON.parse(users) : [];

        // Check if TRN already exists in registeredUsers
        var exists = false;
        for (var i = 0; i < usersList.length; i++) {
            if (usersList[i].username === username) {
                exists = true;
                break;
            }
        }

        // Check if TRN already exists in RegistrationData
        var regData = getRegistrationData();
        if (!exists) {
            for (var j = 0; j < regData.length; j++) {
                if (regData[j].trn === username) {
                    exists = true;
                    break;
                }
            }
        }

        if (exists) {
            alert('This TRN is already registered!');
            return false;
        }

        // Add new user (used by legacy login)
        var fullName = firstName + ' ' + lastName;
        var newUser = {
            fullName: fullName,
            dob: dob,
            email: email,
            username: username,   // treat as TRN
            password: password
        };
        usersList.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(usersList));

        // Add full registration record to RegistrationData
        var regUser = {
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            gender: gender,
            phone: phone,
            email: email,
            trn: username,
            password: password,
            dateRegistered: new Date().toISOString().slice(0, 10),
            cart: [],
            invoices: []
        };

        regData.push(regUser);
        saveRegistrationData(regData);

        alert('Registration successful! Welcome ' + fullName);
        window.location.href = 'login.html';
    }

    return false;
}

// Process password reset request from reset-password.html
function processPasswordReset() {
    var trn = document.getElementById('resetTrn').value.trim();
    var email = document.getElementById('resetEmail').value.trim();
    var password = document.getElementById('resetPassword').value;
    var confirm = document.getElementById('resetConfirm').value;

    // Clear errors
    var trnErr = document.getElementById('resetTrnError'); if (trnErr) trnErr.textContent = '';
    var emailErr = document.getElementById('resetEmailError'); if (emailErr) emailErr.textContent = '';
    var passErr = document.getElementById('resetPasswordError'); if (passErr) passErr.textContent = '';
    var confErr = document.getElementById('resetConfirmError'); if (confErr) confErr.textContent = '';

    var valid = true;
    var trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        if (trnErr) trnErr.textContent = 'TRN must be in the format 000-000-000';
        valid = false;
    }
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        if (emailErr) emailErr.textContent = 'Valid email required';
        valid = false;
    }
    if (password.length < 8) {
        if (passErr) passErr.textContent = 'Password must be 8+ characters';
        valid = false;
    }
    if (password !== confirm) {
        if (confErr) confErr.textContent = 'Passwords do not match';
        valid = false;
    }

    if (!valid) return false;

    // Normalize
    var regData = getRegistrationData();
    var foundInReg = null;
    for (var i = 0; i < regData.length; i++) {
        if (regData[i].trn === trn && regData[i].email === email) {
            foundInReg = regData[i];
            break;
        }
    }

    var users = localStorage.getItem('registeredUsers');
    var usersList = users ? JSON.parse(users) : [];
    var foundInUsers = null;
    for (var j = 0; j < usersList.length; j++) {
        if (usersList[j].username === trn && usersList[j].email === email) {
            foundInUsers = usersList[j];
            break;
        }
    }

    if (!foundInReg && !foundInUsers) {
        alert('No matching account found for that TRN and email.');
        return false;
    }

    // Update passwords where present
    if (foundInReg) {
        foundInReg.password = password;
        saveRegistrationData(regData);
    }
    if (foundInUsers) {
        foundInUsers.password = password;
        localStorage.setItem('registeredUsers', JSON.stringify(usersList));
    }

    alert('Password reset successful. You may now login with your new password.');
    window.location.href = 'login.html';
    return false;
}

function clearRegisterForm() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('dob').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('regUsername').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('confirmPassword').value = '';

    document.getElementById('nameError').textContent = '';
    document.getElementById('dobError').textContent = '';
    document.getElementById('genderError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmError').textContent = '';
}


// ===================================
// IA#2: CHECKOUT PROCESS & INVOICE
// ===================================

// Load invoices from localStorage
function loadInvoices() {
    var saved = localStorage.getItem('invoices');
    invoices = saved ? JSON.parse(saved) : [];

    var allInv = getAllInvoices();
    if (!allInv.length && invoices.length) {
        saveAllInvoices(invoices);
    } else if (allInv.length && !invoices.length) {
        invoices = allInv;
    }
}

// Save invoices to localStorage
function saveInvoices() {
    localStorage.setItem('invoices', JSON.stringify(invoices));
    // Keep AllInvoices in sync
    saveAllInvoices(invoices);
}

// Generate invoice number
function generateInvoiceNumber() {
    var date = new Date();
    var timestamp = date.getTime();
    return 'INV-' + timestamp;
}

// IA#2: Process checkout - UPDATED TO PROPERLY CLEAR CART
function processCheckout() {
    // Check authentication
    if (!currentUser) {
        alert('Please login to complete checkout!');
        window.location.href = 'login.html';
        return false;
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'products.html';
        return false;
    }
    
    // IA#2: Get form values
    var name = document.getElementById('shippingName').value;
    var email = document.getElementById('shippingEmail').value;
    var phone = document.getElementById('shippingPhone').value;
    var address = document.getElementById('shippingAddress').value;
    var city = document.getElementById('shippingCity').value;
    var postal = document.getElementById('postalCode').value;
    var paymentMethod = document.getElementById('paymentMethod').value;
    var amount = parseFloat(document.getElementById('amountPaid').value);
    
    // IA#2: Get total
    var totalText = document.getElementById('checkoutTotal').textContent;
    var total = parseFloat(totalText.replace('$', ''));
    
    // IA#2: Check amount
    if (amount < total) {
        alert('Amount paid is less than total!');
        return false;
    }
    
    // Calculate values
    var subtotal = 0;
    for (var i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }
    var discount = subtotal * 0.10;
    var tax = (subtotal - discount) * 0.15;
    
    // Create invoice with deep copy of cart items
    var invoice = {
        invoiceNumber: generateInvoiceNumber(),
        date: new Date().toLocaleString(),
        customer: {
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            postal: postal
        },
        items: JSON.parse(JSON.stringify(cart)), // Deep copy to prevent reference issues
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total,
        amountPaid: amount,
        change: amount - total,
        paymentMethod: paymentMethod,
        username: currentUser.username
    };
    
    // IA#2: Confirm order
    if (confirm('Confirm order of $' + total.toFixed(2) + '?')) {
        // Save invoice first
        invoices.push(invoice);
        if (currentUser && currentUser.trn) {
        var regData = getRegistrationData();
        for (var r = 0; r < regData.length; r++) {
            if (regData[r].trn === currentUser.trn) {
                if (!Array.isArray(regData[r].invoices)) {
                    regData[r].invoices = [];
                }
                regData[r].invoices.push(invoice);
                saveRegistrationData(regData);
                break;
            }
        }
    }
        saveInvoices();
        
        // IMPORTANT: Clear cart immediately after saving invoice
        cart = [];
        saveCart();
        
        alert('Order confirmed! Invoice #' + invoice.invoiceNumber + '\nThank you ' + name + '!\n\nYour cart has been cleared.');
        
        // Print invoice
        printInvoice(invoice);
        
        // Redirect to invoice history
        setTimeout(function() {
            window.location.href = 'invoice-history.html';
        }, 500);
    }
    
    return false;
}

// Print invoice
function printInvoice(invoice) {
    var printWindow = window.open('', '', 'width=800,height=600');
    
    var html = '<html><head><title>Invoice - ' + invoice.invoiceNumber + '</title>';
    html += '<style>';
    html += 'body { font-family: Arial, sans-serif; margin: 40px; }';
    html += '.header { text-align: center; margin-bottom: 30px; }';
    html += '.company-name { font-size: 28px; color: #6B3410; margin-bottom: 5px; }';
    html += '.invoice-title { font-size: 20px; color: #666; }';
    html += '.info-section { margin: 20px 0; }';
    html += '.info-section h3 { color: #6B3410; border-bottom: 2px solid #D2691E; padding-bottom: 5px; }';
    html += 'table { width: 100%; border-collapse: collapse; margin: 20px 0; }';
    html += 'th { background: #6B3410; color: white; padding: 12px; text-align: left; }';
    html += 'td { padding: 10px; border-bottom: 1px solid #ddd; }';
    html += '.totals { text-align: right; margin-top: 20px; }';
    html += '.totals p { margin: 8px 0; font-size: 16px; }';
    html += '.total-amount { font-size: 20px; font-weight: bold; color: #6B3410; }';
    html += '.footer { margin-top: 50px; text-align: center; color: #666; font-size: 14px; }';
    html += '@media print { button { display: none; } }';
    html += '</style></head><body>';
    
    html += '<div class="header">';
    html += '<div class="company-name">🕯️ Vibe & Light</div>';
    html += '<div class="invoice-title">Custom Candles & Room Scents</div>';
    html += '<p>Email: jessicaagoldson@students.utech.edu.jm</p>';
    html += '</div>';
    
    html += '<div class="info-section">';
    html += '<h3>Invoice Details</h3>';
    html += '<p><strong>Invoice Number:</strong> ' + invoice.invoiceNumber + '</p>';
    html += '<p><strong>Date:</strong> ' + invoice.date + '</p>';
    html += '<p><strong>Payment Method:</strong> ' + invoice.paymentMethod + '</p>';
    html += '</div>';
    
    html += '<div class="info-section">';
    html += '<h3>Customer Information</h3>';
    html += '<p><strong>Name:</strong> ' + invoice.customer.name + '</p>';
    html += '<p><strong>Email:</strong> ' + invoice.customer.email + '</p>';
    html += '<p><strong>Phone:</strong> ' + invoice.customer.phone + '</p>';
    html += '<p><strong>Address:</strong> ' + invoice.customer.address + ', ' + invoice.customer.city + ' ' + invoice.customer.postal + '</p>';
    html += '</div>';
    
    html += '<div class="info-section">';
    html += '<h3>Order Items</h3>';
    html += '<table>';
    html += '<tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th></tr>';
    
    for (var i = 0; i < invoice.items.length; i++) {
        var item = invoice.items[i];
        html += '<tr>';
        html += '<td>' + item.name + '</td>';
        html += '<td>$' + item.price.toFixed(2) + '</td>';
        html += '<td>' + item.quantity + '</td>';
        html += '<td>$' + (item.price * item.quantity).toFixed(2) + '</td>';
        html += '</tr>';
    }
    
    html += '</table>';
    html += '</div>';
    
    html += '<div class="totals">';
    html += '<p><strong>Subtotal:</strong> $' + invoice.subtotal.toFixed(2) + '</p>';
    html += '<p><strong>Discount (10%):</strong> -$' + invoice.discount.toFixed(2) + '</p>';
    html += '<p><strong>Tax (15%):</strong> $' + invoice.tax.toFixed(2) + '</p>';
    html += '<p class="total-amount"><strong>Total:</strong> $' + invoice.total.toFixed(2) + '</p>';
    html += '<p><strong>Amount Paid:</strong> $' + invoice.amountPaid.toFixed(2) + '</p>';
    html += '<p><strong>Change:</strong> $' + invoice.change.toFixed(2) + '</p>';
    html += '</div>';
    
    html += '<div class="footer">';
    html += '<p>Thank you for shopping with Vibe & Light!</p>';
    html += '<p>Creating memorable moments through scent</p>';
    html += '</div>';
    
    html += '<div style="text-align: center; margin-top: 30px;">';
    html += '<button onclick="window.print()" style="padding: 15px 40px; background: #D2691E; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Print Invoice</button>';
    html += '</div>';
    
    html += '</body></html>';
    
    printWindow.document.write(html);
    printWindow.document.close();
}

// Display invoice history
function displayInvoiceHistory() {
    var historyDiv = document.getElementById('invoiceHistory');
    if (!historyDiv) return;

    if (!currentUser) {
        historyDiv.innerHTML = '<div style="text-align: center; padding: 50px;"><p>Please login to view invoice history</p><a href="login.html" class="btn-primary">Login</a></div>';
        return;
    }

    var userInvoices = GetUserInvoices();

    if (userInvoices.length === 0) {
        historyDiv.innerHTML = '<div style="text-align: center; padding: 50px;"><p>No invoices found</p><a href="products.html" class="btn-primary">Start Shopping</a></div>';
        return;
    }

    var html = '<h2 class="section-title">My Invoice History</h2>';
    html += '<div style="overflow-x: auto;">';
    html += '<table id="invoiceTable">';
    html += '<tr><th>Invoice #</th><th>Date</th><th>Total</th><th>Payment Method</th><th>Actions</th></tr>';

    for (var i = userInvoices.length - 1; i >= 0; i--) {
        var inv = userInvoices[i];
        html += '<tr>';
        html += '<td>' + inv.invoiceNumber + '</td>';
        html += '<td>' + inv.date + '</td>';
        html += '<td>$' + inv.total.toFixed(2) + '</td>';
        html += '<td>' + inv.paymentMethod + '</td>';
        html += '<td><button onclick="reprintInvoice(\'' + inv.invoiceNumber + '\')">Print</button></td>';
        html += '</tr>';
    }

    html += '</table>';
    html += '</div>';

    historyDiv.innerHTML = html;
}

// Reprint invoice by invoice number
function reprintInvoice(invoiceNumber) {
    for (var i = 0; i < invoices.length; i++) {
        if (invoices[i].invoiceNumber === invoiceNumber) {
            printInvoice(invoices[i]);
            return;
        }
    }
    alert('Invoice not found!');
}
function ShowUserFrequency() {
    var genderDiv = document.getElementById('genderChart');
    var ageDiv = document.getElementById('ageChart');
    if (!genderDiv && !ageDiv) return;

    var regData = getRegistrationData();
    var genders = { Male: 0, Female: 0, Other: 0 };
    var ages = { '18-25': 0, '26-35': 0, '36-50': 0, '50+': 0 };

    var today = new Date();

    for (var i = 0; i < regData.length; i++) {
        var u = regData[i];

        // Gender
        var g = (u.gender || '').trim();
        if (!genders.hasOwnProperty(g)) {
            g = 'Other';
        }
        genders[g]++;

        // Age Group
        if (u.dob) {
            var dob = new Date(u.dob);
            var age = today.getFullYear() - dob.getFullYear();
            var mDiff = today.getMonth() - dob.getMonth();
            if (mDiff < 0 || (mDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            if (age >= 18 && age <= 25) ages['18-25']++;
            else if (age >= 26 && age <= 35) ages['26-35']++;
            else if (age >= 36 && age <= 50) ages['36-50']++;
            else if (age > 50) ages['50+']++;
        }
    }

    function renderBars(container, dataObj) {
        if (!container) return;
        container.innerHTML = '';
        for (var key in dataObj) {
            var count = dataObj[key];
            var row = document.createElement('div');
            row.className = 'bar-row';
            row.innerHTML =
                '<span class="bar-label">' + key + '</span>' +
                '<div class="bar" style="width:' + (count * 30) + 'px;"></div>' +
                '<span class="bar-value">' + count + '</span>';
            container.appendChild(row);
        }
    }

    renderBars(genderDiv, genders);
    renderBars(ageDiv, ages);
}

// Show all stored invoices or filter by TRN/username
function ShowInvoices(showAll) {
    var tbody = document.getElementById('invoiceTableBody');
    if (!tbody) return;

    var allInv = getAllInvoices() || [];
    var input = document.getElementById('searchTrn');
    var rawQuery = input ? input.value.trim() : '';
    var normalizedQuery = rawQuery.replace(/\D/g, ''); // remove non-digits for TRN matching

    var rows = [];

    function normalizeCandidate(s) {
        return (s || '').toString().replace(/\D/g, '');
    }

    for (var i = 0; i < allInv.length; i++) {
        var inv = allInv[i];

        // Determine if this invoice should be shown
        var show = !!showAll;
        if (!show) {
            if (normalizedQuery === '') {
                // nothing to search for and not asking for all => skip
                show = false;
            } else {
                // check several candidate TRN/username fields
                var candidates = [inv.trn, inv.username];
                // also consider username stored inside customer object (if present)
                if (inv.customer && inv.customer.trn) candidates.push(inv.customer.trn);

                for (var c = 0; c < candidates.length; c++) {
                    var candNorm = normalizeCandidate(candidates[c]);
                    if (candNorm && candNorm.indexOf(normalizedQuery) !== -1) {
                        show = true;
                        break;
                    }
                }
            }
        }

        if (!show) continue;

        var trnDisplay = inv.trn || inv.username || '';
        var custName = '';
        if (inv.customer) {
            custName = inv.customer.name || ((inv.customer.firstName ? (inv.customer.firstName + ' ' + (inv.customer.lastName||'')) : '')) || '';
        }
        var date = inv.date || '';
        var total = inv.total !== undefined ? '$' + parseFloat(inv.total).toFixed(2) : '$0.00';

        rows.push('<tr>' +
            '<td>' + (inv.invoiceNumber || '') + '</td>' +
            '<td>' + trnDisplay + '</td>' +
            '<td>' + custName + '</td>' +
            '<td>' + date + '</td>' +
            '<td>' + total + '</td>' +
            '<td><button onclick="reprintInvoice(\'' + (inv.invoiceNumber || '') + '\')">Print</button></td>' +
            '</tr>');
    }

    if (rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No invoices found</td></tr>';
    } else {
        tbody.innerHTML = rows.join('');
    }
}


// Get all invoices for the current user
function GetUserInvoices() {
    if (!currentUser) return [];

    var allInv = getAllInvoices();
    if (currentUser.trn) {
        return allInv.filter(function(inv) {
            return inv.username === currentUser.username || inv.trn === currentUser.trn;
        });
    } else {
        return allInv.filter(function(inv) {
            return inv.username === currentUser.username;
        });
    }
}
// IA#2: Cancel checkout
function cancelCheckout() {
    if (confirm('Cancel checkout?')) {
        window.location.href = 'cart.html';
    }
}










