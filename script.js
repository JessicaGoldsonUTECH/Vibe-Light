// IA#2: JavaScript for Vibe & Light E-Commerce
// Student: Jessica Goldson | ID: 2405416

// ===================================
// Question 1: USER AUTHENTICATION FUNCTIONS
// ===================================

// Question 1.a: Registration Data Storage
var RegistrationData = [];
var currentUser = null;
var cart = [];
var invoices = [];
var AllProducts = [];
var AllInvoices = [];
var loginAttempts = {};

// Question 1.a.ii: Load all data when page loads
window.onload = function() {
    loadRegistrationData();
    loadCurrentUser();
    loadCart();
    loadInvoices();
    loadAllProducts();
    loadAllInvoices();
    showCart();
    showCheckout();
    displayInvoiceHistory();
    updateUIForAuth();
    
    // Initialize products if empty
    if (AllProducts.length === 0) {
        initializeProducts();
    }
    
    // Display products dynamically
    displayProducts();
};

// Question 1.a.ii: Load Registration Data from localStorage
function loadRegistrationData() {
    var saved = localStorage.getItem('RegistrationData');
    if (saved) {
        RegistrationData = JSON.parse(saved);
    }
}

// Question 1.a.ii: Save Registration Data to localStorage
function saveRegistrationData() {
    localStorage.setItem('RegistrationData', JSON.stringify(RegistrationData));
}

// Question 1.a.ii: Load All Products from localStorage
function loadAllProducts() {
    var saved = localStorage.getItem('AllProducts');
    if (saved) {
        AllProducts = JSON.parse(saved);
    }
}

// Question 1.a.ii: Save All Products to localStorage
function saveAllProducts() {
    localStorage.setItem('AllProducts', JSON.stringify(AllProducts));
}

// Question 1.a.ii: Load All Invoices from localStorage
function loadAllInvoices() {
    var saved = localStorage.getItem('AllInvoices');
    if (saved) {
        AllInvoices = JSON.parse(saved);
    }
}

// Question 1.a.ii: Save All Invoices to localStorage
function saveAllInvoices() {
    localStorage.setItem('AllInvoices', JSON.stringify(AllInvoices));
}

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

// Load invoices from localStorage
function loadInvoices() {
    var saved = localStorage.getItem('invoices');
    if (saved) {
        invoices = JSON.parse(saved);
    }
}

// Save invoices to localStorage
function saveInvoices() {
    localStorage.setItem('invoices', JSON.stringify(invoices));
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
            loginLink.textContent = 'Logout (' + currentUser.firstName + ')';
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

// Question 1.a.viii: Cancel button for registration form
function clearRegisterForm() {
    if (confirm('Clear all form data?')) {
        document.getElementById('registerForm').reset();
        // Clear all error messages
        var errors = document.getElementsByClassName('error');
        for (var i = 0; i < errors.length; i++) {
            errors[i].textContent = '';
        }
    }
}

// Question 1.b.v: Cancel button for login form
function clearLoginForm() {
    if (confirm('Clear login form?')) {
        document.getElementById('loginForm').reset();
        // Clear error messages
        document.getElementById('trnError').textContent = '';
        document.getElementById('passwordError').textContent = '';
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
// Question 1.a: REGISTRATION VALIDATION
// ===================================

// Question 1.a.ii: Validate register form
function validateRegister() {
    // Get input values
    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var dob = document.getElementById('dob').value;
    var gender = document.getElementById('gender').value;
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var trn = document.getElementById('trn').value.trim();
    var password = document.getElementById('regPassword').value;
    var confirm = document.getElementById('confirmPassword').value;
    
    // Clear errors
    document.getElementById('firstNameError').textContent = '';
    document.getElementById('lastNameError').textContent = '';
    document.getElementById('dobError').textContent = '';
    document.getElementById('genderError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('trnError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmError').textContent = '';
    
    var valid = true;
    
    // Question 1.a.ii.iii: Validate all fields are filled
    if (firstName === '') {
        document.getElementById('firstNameError').textContent = 'First name required';
        valid = false;
    }
    
    if (lastName === '') {
        document.getElementById('lastNameError').textContent = 'Last name required';
        valid = false;
    }
    
    if (dob === '') {
        document.getElementById('dobError').textContent = 'Date of birth required';
        valid = false;
    }
    
    if (gender === '') {
        document.getElementById('genderError').textContent = 'Gender required';
        valid = false;
    }
    
    if (phone === '') {
        document.getElementById('phoneError').textContent = 'Phone number required';
        valid = false;
    }
    
    if (email === '') {
        document.getElementById('emailError').textContent = 'Email required';
        valid = false;
    }
    
    if (trn === '') {
        document.getElementById('trnError').textContent = 'TRN required';
        valid = false;
    }
    
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password required';
        valid = false;
    }
    
    if (confirm === '') {
        document.getElementById('confirmError').textContent = 'Confirm password required';
        valid = false;
    }
    
    // Question 1.a.ii.iv: Validate password length (8+ characters)
    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long';
        valid = false;
    }
    
    // Question 1.a.ii.v: Calculate age - must be over 18
    if (dob !== '') {
        var birthDate = new Date(dob);
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            document.getElementById('dobError').textContent = 'You must be at least 18 years old to register';
            valid = false;
        }
    }
    
    // Question 1.a.ii.v: Validate TRN format (000-000-000)
    var trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        document.getElementById('trnError').textContent = 'TRN must be in format 000-000-000';
        valid = false;
    }
    
    // Check passwords match
    if (password !== confirm) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
        valid = false;
    }
    
    // Validate email format
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Valid email required';
        valid = false;
    }
    
    // If valid, register user
    if (valid) {
        // Check if TRN already exists
        var trnExists = false;
        for (var i = 0; i < RegistrationData.length; i++) {
            if (RegistrationData[i].trn === trn) {
                trnExists = true;
                break;
            }
        }
        
        if (trnExists) {
            alert('TRN already registered! Please use a different TRN.');
            document.getElementById('trnError').textContent = 'TRN already registered';
            return false;
        }
        
        // Question 1.a.ii.vi: Create registration record as JavaScript object
        var newUser = {
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            gender: gender,
            phone: phone,
            email: email,
            trn: trn,
            password: password,
            dateOfRegistration: new Date().toLocaleString(),
            cart: [],
            invoices: []
        };
        
        // Question 1.a.ii.vi: Append to RegistrationData array
        RegistrationData.push(newUser);
        
        // Question 1.a.ii.vi: Store in localStorage
        saveRegistrationData();
        
        alert('Registration successful! Welcome ' + firstName + ' ' + lastName);
        window.location.href = 'login.html';
    }
    
    return false;
}

// ===================================
// Question 1.b: LOGIN VALIDATION
// ===================================

// Question 1.b.ii: Validate login form
function validateLogin() {
    var trn = document.getElementById('trn').value.trim();
    var password = document.getElementById('password').value;
    
    // Clear errors
    document.getElementById('trnError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
    var valid = true;
    
    // Check TRN format
    var trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        document.getElementById('trnError').textContent = 'TRN must be in format 000-000-000';
        valid = false;
    }
    
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password required';
        valid = false;
    }
    
    // Question 1.b.iii: Check login attempts
    if (!loginAttempts[trn]) {
        loginAttempts[trn] = { count: 0, lastAttempt: Date.now() };
    }
    
    // Reset attempts if more than 15 minutes have passed
    var timeSinceLastAttempt = Date.now() - loginAttempts[trn].lastAttempt;
    if (timeSinceLastAttempt > 15 * 60 * 1000) { // 15 minutes
        loginAttempts[trn].count = 0;
    }
    
    // Check if account is locked
    if (loginAttempts[trn].count >= 3) {
        alert('Account locked! Too many failed attempts. Please try again later.');
        window.location.href = 'account-locked.html';
        return false;
    }
    
    // If valid, check credentials
    if (valid) {
        var foundUser = null;
        
        // Find user by TRN and password
        for (var i = 0; i < RegistrationData.length; i++) {
            if (RegistrationData[i].trn === trn && RegistrationData[i].password === password) {
                foundUser = RegistrationData[i];
                break;
            }
        }
        
        if (foundUser) {
            // Reset login attempts on successful login
            loginAttempts[trn].count = 0;
            
            currentUser = foundUser;
            saveCurrentUser();
            
            // Load user's cart
            cart = currentUser.cart || [];
            saveCart();
            
            alert('Login successful! Welcome ' + foundUser.firstName);
            window.location.href = 'products.html';
        } else {
            // Increment failed attempts
            loginAttempts[trn].count++;
            loginAttempts[trn].lastAttempt = Date.now();
            
            var attemptsLeft = 3 - loginAttempts[trn].count;
            
            if (attemptsLeft > 0) {
                alert('Invalid TRN or password! ' + attemptsLeft + ' attempts remaining.');
            } else {
                alert('Account locked! Too many failed attempts.');
                window.location.href = 'account-locked.html';
            }
        }
    }
    
    return false;
}

// Question 1.b.vi: Reset Password function
// Question 1.b.vi: Reset Password function - UPDATED
function resetPassword() {
    var trn = prompt('Enter your TRN to reset password:');
    
    if (!trn) return;
    
    // Find user by TRN
    var userIndex = -1;
    for (var i = 0; i < RegistrationData.length; i++) {
        if (RegistrationData[i].trn === trn) {
            userIndex = i;
            break;
        }
    }
    
    if (userIndex === -1) {
        alert('TRN not found!');
        return;
    }
    
    // Reset login attempts when resetting password
    if (loginAttempts[trn]) {
        loginAttempts[trn].count = 0;
    }
    
    var newPassword = prompt('Enter new password (min. 8 characters):');
    
    if (!newPassword || newPassword.length < 8) {
        alert('Password must be at least 8 characters long!');
        return;
    }
    
    var confirmPassword = prompt('Confirm new password:');
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Update password
    RegistrationData[userIndex].password = newPassword;
    saveRegistrationData();
    
    alert('Password reset successfully! Your account has been unlocked. Please login with your new password.');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// ===================================
// Question 2: PRODUCT CATALOGUE
// ===================================

// Question 2.a: Initialize product array
function initializeProducts() {
    AllProducts = [
        {
            name: 'Lavender Dream',
            price: 15.99,
            description: 'Relaxing lavender essential oil perfect for bedtime',
            image: 'Assets/lavender_dream.jpg'
        },
        {
            name: 'Vanilla Bliss',
            price: 14.99,
            description: 'Sweet vanilla bean for cozy evenings',
            image: 'Assets/Vanilla_Bliss.jpg'
        },
        {
            name: 'Ocean Breeze',
            price: 16.99,
            description: 'Fresh ocean scent for summer vibes',
            image: 'Assets/Ocean_Breeze.jpg'
        },
        {
            name: 'Cinnamon Spice',
            price: 15.99,
            description: 'Warm spice blend for fall season',
            image: 'Assets/Cinnamon_Spice.jpg'
        },
        {
            name: 'Rose Garden',
            price: 17.99,
            description: 'Elegant floral scent for romance',
            image: 'Assets/Rose_Garden.jpg'
        },
        {
            name: 'Citrus Burst',
            price: 14.99,
            description: 'Energizing citrus blend for mornings',
            image: 'Assets/Citrus_Burst.jpg'
        },
        {
            name: 'Fresh Linen Spray',
            price: 9.99,
            description: 'Clean and crisp room spray',
            image: 'Assets/Fresh_Linen.jpg'
        },
        {
            name: 'Eucalyptus Mint Spray',
            price: 10.99,
            description: 'Refreshing spa-like fragrance',
            image: 'Assets/Eucalyptus_Mint.jpg'
        },
        {
            name: 'Tropical Paradise Spray',
            price: 10.99,
            description: 'Exotic tropical fruit blend',
            image: 'Assets/Tropical.jpg'
        }
    ];
    
    saveAllProducts();
}

// Question 2.c: Display product list dynamically
function displayProducts() {
    var productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    for (var i = 0; i < AllProducts.length; i++) {
        var product = AllProducts[i];
        
        var productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${i < 3 ? '<span class="badge">' + (i === 0 ? 'Bestseller' : i === 2 ? 'New' : 'Popular') + '</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="product-footer">
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn-cart" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    }
}

// ===================================
// CART FUNCTIONS (Updated for Question 2.e)
// ===================================

// Question 2.e.i: Add product to cart
function addToCart(name, price) {
    // Check if user is logged in
    if (!currentUser) {
        if (confirm('You need to login to add items to cart. Login now?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    // Find product in AllProducts array
    var product = null;
    for (var i = 0; i < AllProducts.length; i++) {
        if (AllProducts[i].name === name) {
            product = AllProducts[i];
            break;
        }
    }
    
    if (!product) {
        alert('Product not found!');
        return;
    }
    
    // Check if product already in cart
    var found = false;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].quantity = cart[i].quantity + 1;
            found = true;
            break;
        }
    }
    
    // If not found, add new product
    if (!found) {
        cart.push({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            quantity: 1
        });
    }
    
    // Update user's cart in RegistrationData
    updateUserCart();
    
    saveCart();
    alert(product.name + ' added to cart!');
}

// Update user's cart in RegistrationData
function updateUserCart() {
    if (!currentUser) return;
    
    // Find user in RegistrationData and update cart
    for (var i = 0; i < RegistrationData.length; i++) {
        if (RegistrationData[i].trn === currentUser.trn) {
            RegistrationData[i].cart = cart;
            break;
        }
    }
    
    saveRegistrationData();
}

// Save cart to localStorage - USER SPECIFIC
function saveCart() {
    if (currentUser) {
        // Save cart with username as key
        localStorage.setItem('cart_' + currentUser.trn, JSON.stringify(cart));
    } else {
        // Guest cart (cleared on logout)
        localStorage.setItem('cart_guest', JSON.stringify(cart));
    }
}

// Load cart from localStorage - USER SPECIFIC
function loadCart() {
    if (currentUser) {
        // Load user-specific cart
        var saved = localStorage.getItem('cart_' + currentUser.trn);
        if (saved) {
            cart = JSON.parse(saved);
        } else {
            cart = currentUser.cart || [];
        }
    } else {
        // Load guest cart
        var saved = localStorage.getItem('cart_guest');
        if (saved) {
            cart = JSON.parse(saved);
        } else {
            cart = [];
        }
    }
}

// Function to remove item from cart
function removeItem(index) {
    if (confirm('Remove this item?')) {
        cart.splice(index, 1);
        updateUserCart();
        saveCart();
        showCart();
    }
}

// Function to update quantity
function updateQty(index, qty) {
    qty = parseInt(qty);
    if (qty > 0) {
        cart[index].quantity = qty;
        updateUserCart();
        saveCart();
        showCart();
    } else {
        removeItem(index);
    }
}

// Function to clear cart
function clearCart() {
    if (confirm('Clear entire cart?')) {
        cart = [];
        updateUserCart();
        saveCart();
        showCart();
        alert('Cart cleared!');
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
        
        // IA#2: Create table row - FIXED: Added remove button column
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
        if (nameField && currentUser.firstName) nameField.value = currentUser.firstName + ' ' + currentUser.lastName;
        if (emailField && currentUser.email) emailField.value = currentUser.email;
    }
}

// ===================================
// CHECKOUT AND INVOICE FUNCTIONS
// ===================================

// Generate invoice number
function generateInvoiceNumber() {
    var date = new Date();
    var timestamp = date.getTime();
    return 'INV-' + timestamp;
}

// Process checkout
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
    
    // Get form values
    var name = document.getElementById('shippingName').value;
    var email = document.getElementById('shippingEmail').value;
    var phone = document.getElementById('shippingPhone').value;
    var address = document.getElementById('shippingAddress').value;
    var city = document.getElementById('shippingCity').value;
    var postal = document.getElementById('postalCode').value;
    var paymentMethod = document.getElementById('paymentMethod').value;
    var amount = parseFloat(document.getElementById('amountPaid').value);
    
    // Get total
    var totalText = document.getElementById('checkoutTotal').textContent;
    var total = parseFloat(totalText.replace('$', ''));
    
    // Check amount
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
    
    // Create invoice
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
        items: JSON.parse(JSON.stringify(cart)),
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total,
        amountPaid: amount,
        change: amount - total,
        paymentMethod: paymentMethod,
        trn: currentUser.trn
    };
    
    // Confirm order
    if (confirm('Confirm order of $' + total.toFixed(2) + '?')) {
        // Save to user's invoices
        currentUser.invoices.push(invoice);
        
        // Save to AllInvoices
        AllInvoices.push(invoice);
        saveAllInvoices();
        
        // Update user in RegistrationData
        for (var i = 0; i < RegistrationData.length; i++) {
            if (RegistrationData[i].trn === currentUser.trn) {
                RegistrationData[i].invoices.push(invoice);
                RegistrationData[i].cart = []; // Clear cart after checkout
                break;
            }
        }
        
        saveRegistrationData();
        
        // Clear cart
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
    html += '<p><strong>TRN:</strong> ' + invoice.trn + '</p>';
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
    html += '<p><em>Invoice sent to: ' + invoice.customer.email + '</em></p>';
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
    
    // Filter invoices for current user
    var userInvoices = [];
    for (var i = 0; i < invoices.length; i++) {
        if (invoices[i].username === currentUser.trn) {
            userInvoices.push(invoices[i]);
        }
    }
    
    if (userInvoices.length === 0) {
        historyDiv.innerHTML = '<div style="text-align: center; padding: 50px;"><p>No invoices found</p><a href="products.html" class="btn-primary">Start Shopping</a></div>';
        return;
    }
    
    var html = '<h2 class="section-title">Invoice History</h2>';
    html += '<div style="overflow-x: auto;">';
    html += '<table id="invoiceTable">';
    html += '<tr><th>Invoice #</th><th>Date</th><th>Total</th><th>Payment Method</th><th>Actions</th></tr>';
    
    // Reverse to show newest first
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

// IA#2: Cancel checkout
function cancelCheckout() {
    if (confirm('Cancel checkout?')) {
        window.location.href = 'cart.html';
    }
}

// Function to proceed to checkout
function proceedToCheckout() {
    if (!currentUser) {
        if (confirm('You need to login or register to proceed to checkout. Would you like to login now?')) {
            window.location.href = 'login.html';
        }
    } else {
        window.location.href = 'checkout.html';
    }
}


