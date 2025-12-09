// IA#2: JavaScript for Vibe & Light E-Commerce
// Student: Jessica Goldson | ID: 2405416
// GROUP PROJECT: Extended for CIT2011 Group Assignment

// IA#2: Cart array to store products
var cart = [];
var currentUser = null;
var invoices = [];

// GROUP PROJECT: Variables
var loginAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 3;
var allProducts = [];

// IA#2: Load data when page loads
window.onload = function() {
    loadProductsFromLocalStorage(); // GROUP PROJECT: Load products first
    loadCart();
    loadCurrentUser();
    loadInvoices();
    showCart();
    showCheckout();
    displayInvoiceHistory();
    updateUIForAuth();
    
    // GROUP PROJECT: Display products dynamically if on products page
    if (document.querySelector('.products-grid')) {
        displayProducts();
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
// GROUP PROJECT: EXTENDED AUTHENTICATION FUNCTIONS
// ===================================

// Load registered users from localStorage
function loadRegisteredUsers() {
    var saved = localStorage.getItem('RegistrationData');
    return saved ? JSON.parse(saved) : [];
}

// Save registered users to localStorage
function saveRegisteredUsers(users) {
    localStorage.setItem('RegistrationData', JSON.stringify(users));
}

// Calculate age from date of birth
function calculateAge(dob) {
    var birthDate = new Date(dob);
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Validate TRN format (000-000-000)
function validateTRN(trn) {
    var trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    return trnPattern.test(trn);
}

// Check if TRN is unique
function isTRNUnique(trn) {
    var users = loadRegisteredUsers();
    for (var i = 0; i < users.length; i++) {
        if (users[i].trn === trn) {
            return false;
        }
    }
    return true;
}

// Reset password function
function resetPassword() {
    var trn = prompt('Enter your TRN to reset password:');
    
    if (!trn) return;
    
    if (!validateTRN(trn)) {
        alert('Invalid TRN format. Must be 000-000-000');
        return;
    }
    
    var users = loadRegisteredUsers();
    var userFound = false;
    
    for (var i = 0; i < users.length; i++) {
        if (users[i].trn === trn) {
            userFound = true;
            var newPassword = prompt('Enter new password (minimum 8 characters):');
            
            if (newPassword && newPassword.length >= 8) {
                var confirmPassword = prompt('Confirm new password:');
                
                if (newPassword === confirmPassword) {
                    users[i].password = newPassword;
                    saveRegisteredUsers(users);
                    alert('Password reset successful!');
                    window.location.href = 'login.html';
                } else {
                    alert('Passwords do not match!');
                }
            } else {
                alert('Password must be at least 8 characters!');
            }
            break;
        }
    }
    
    if (!userFound) {
        alert('TRN not found in our records!');
    }
}

// Cancel registration form
function cancelRegistration() {
    if (confirm('Clear all form data?')) {
        document.getElementById('registrationForm').reset();
    }
}

// Cancel login form
function cancelLogin() {
    if (confirm('Clear login form?')) {
        document.getElementById('loginForm').reset();
    }
}

// ===================================
// GROUP PROJECT: UPDATED REGISTRATION FUNCTION
// ===================================

// IA#2: Validate register form - UPDATED FOR GROUP PROJECT
function validateRegister() {
    // GROUP PROJECT: Get all input values
    var firstName = document.getElementById('firstName') ? document.getElementById('firstName').value : '';
    var lastName = document.getElementById('lastName') ? document.getElementById('lastName').value : '';
    var dob = document.getElementById('dob') ? document.getElementById('dob').value : '';
    var gender = document.getElementById('gender') ? document.getElementById('gender').value : '';
    var phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
    var email = document.getElementById('email') ? document.getElementById('email').value : '';
    var trn = document.getElementById('trn') ? document.getElementById('trn').value : '';
    var password = document.getElementById('regPassword') ? document.getElementById('regPassword').value : '';
    var confirmPassword = document.getElementById('confirmPassword') ? document.getElementById('confirmPassword').value : '';
    
    // For backward compatibility with IA#2 form
    if (!firstName) {
        var name = document.getElementById('fullName') ? document.getElementById('fullName').value : '';
        if (name) {
            var nameParts = name.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
        }
    }
    
    if (!trn) {
        trn = document.getElementById('regUsername') ? document.getElementById('regUsername').value : '';
    }
    
    // Clear all errors
    var errorElements = document.querySelectorAll('.error');
    errorElements.forEach(function(element) {
        element.textContent = '';
    });
    
    var valid = true;
    
    // GROUP PROJECT: Validate first name
    if (firstName === '') {
        var errorEl = document.getElementById('firstNameError') || document.getElementById('nameError');
        if (errorEl) errorEl.textContent = 'First name required';
        valid = false;
    }
    
    // GROUP PROJECT: Validate last name
    if (lastName === '') {
        var errorEl = document.getElementById('lastNameError');
        if (errorEl) errorEl.textContent = 'Last name required';
        valid = false;
    }
    
    // GROUP PROJECT: Validate date of birth
    if (dob === '') {
        var errorEl = document.getElementById('dobError');
        if (errorEl) errorEl.textContent = 'Date of birth required';
        valid = false;
    } else {
        var age = calculateAge(dob);
        if (age < 18) {
            var errorEl = document.getElementById('dobError');
            if (errorEl) errorEl.textContent = 'Must be 18 years or older';
            valid = false;
        }
    }
    
    // GROUP PROJECT: Validate gender
    if (gender === '' && document.getElementById('gender')) {
        var errorEl = document.getElementById('genderError');
        if (errorEl) errorEl.textContent = 'Gender required';
        valid = false;
    }
    
    // GROUP PROJECT: Validate phone
    if (phone === '' && document.getElementById('phone')) {
        var errorEl = document.getElementById('phoneError');
        if (errorEl) errorEl.textContent = 'Phone number required';
        valid = false;
    }
    
    // IA#2: Validate email format
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        var errorEl = document.getElementById('emailError');
        if (errorEl) errorEl.textContent = 'Valid email required';
        valid = false;
    }
    
    // GROUP PROJECT: Validate TRN format
    if (!validateTRN(trn)) {
        var errorEl = document.getElementById('trnError') || document.getElementById('usernameError');
        if (errorEl) errorEl.textContent = 'TRN must be in format 000-000-000';
        valid = false;
    } else if (!isTRNUnique(trn)) {
        var errorEl = document.getElementById('trnError') || document.getElementById('usernameError');
        if (errorEl) errorEl.textContent = 'TRN already registered';
        valid = false;
    }
    
    // GROUP PROJECT: Validate password length
    if (password.length < 8) {
        var errorEl = document.getElementById('passwordError');
        if (errorEl) errorEl.textContent = 'Password must be at least 8 characters';
        valid = false;
    }
    
    // IA#2: Check passwords match
    if (password !== confirmPassword) {
        var errorEl = document.getElementById('confirmError');
        if (errorEl) errorEl.textContent = 'Passwords do not match';
        valid = false;
    }
    
    // If valid, register user
    if (valid) {
        // Get existing users
        var users = loadRegisteredUsers();
        
        // Create user object for GROUP PROJECT
        var newUser = {
            firstName: firstName,
            lastName: lastName,
            fullName: firstName + ' ' + lastName,
            dob: dob,
            age: calculateAge(dob),
            gender: gender,
            phone: phone,
            email: email,
            trn: trn,
            password: password,
            dateRegistered: new Date().toLocaleDateString(),
            cart: [],
            invoices: [],
            username: trn // Use TRN as username
        };
        
        // For backward compatibility with IA#2
        var ia2User = {
            fullName: firstName + ' ' + lastName,
            dob: dob,
            email: email,
            username: trn,
            password: password
        };
        
        // Add to users array
        users.push(newUser);
        saveRegisteredUsers(users);
        
        // Also save to IA#2 format for backward compatibility
        var ia2Users = localStorage.getItem('registeredUsers');
        var ia2UsersList = ia2Users ? JSON.parse(ia2Users) : [];
        ia2UsersList.push(ia2User);
        localStorage.setItem('registeredUsers', JSON.stringify(ia2UsersList));
        
        alert('Registration successful! Welcome ' + firstName + ' ' + lastName);
        window.location.href = 'login.html';
    }
    
    return false;
}

// ===================================
// GROUP PROJECT: UPDATED LOGIN FUNCTION
// ===================================

// IA#2: Validate login form - UPDATED FOR GROUP PROJECT
function validateLogin() {
    // GROUP PROJECT: Get TRN as username
    var trn = document.getElementById('username') ? document.getElementById('username').value : '';
    var password = document.getElementById('password') ? document.getElementById('password').value : '';
    
    // Clear errors
    var usernameError = document.getElementById('usernameError');
    var passwordError = document.getElementById('passwordError');
    if (usernameError) usernameError.textContent = '';
    if (passwordError) passwordError.textContent = '';
    
    var valid = true;
    
    // GROUP PROJECT: Validate TRN format
    if (!validateTRN(trn)) {
        if (usernameError) usernameError.textContent = 'TRN must be in format 000-000-000';
        valid = false;
    }
    
    // IA#2: Check password
    if (password === '') {
        if (passwordError) passwordError.textContent = 'Password required';
        valid = false;
    }
    
    if (valid) {
        // Check login attempts from localStorage
        var storedAttempts = localStorage.getItem('loginAttempts_' + trn);
        if (storedAttempts) {
            loginAttempts = parseInt(storedAttempts);
        }
        
        // Check if account is locked
        if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            alert('Account locked! Too many failed attempts. Please reset your password.');
            window.location.href = 'account-locked.html';
            return false;
        }
        
        // GROUP PROJECT: Try to find user in RegistrationData
        var users = loadRegisteredUsers();
        var foundUser = null;
        
        for (var i = 0; i < users.length; i++) {
            if (users[i].trn === trn && users[i].password === password) {
                foundUser = users[i];
                break;
            }
        }
        
        // For backward compatibility with IA#2 users
        if (!foundUser) {
            var ia2Users = localStorage.getItem('registeredUsers');
            var ia2UsersList = ia2Users ? JSON.parse(ia2Users) : [];
            
            for (var i = 0; i < ia2UsersList.length; i++) {
                if (ia2UsersList[i].username === trn && ia2UsersList[i].password === password) {
                    foundUser = ia2UsersList[i];
                    // Convert to GROUP PROJECT format
                    foundUser = {
                        fullName: foundUser.fullName,
                        email: foundUser.email,
                        trn: foundUser.username,
                        password: foundUser.password,
                        username: foundUser.username
                    };
                    break;
                }
            }
        }
        
        if (foundUser) {
            // Reset login attempts
            loginAttempts = 0;
            localStorage.removeItem('loginAttempts_' + trn);
            
            // Set current user
            currentUser = {
                username: foundUser.trn || foundUser.username,
                fullName: foundUser.fullName,
                email: foundUser.email,
                trn: foundUser.trn || foundUser.username
            };
            saveCurrentUser();
            
            // Load user's cart
            loadCart();
            
            alert('Login successful! Welcome ' + (foundUser.firstName || foundUser.fullName));
            window.location.href = 'index.html';
        } else {
            // Increment login attempts
            loginAttempts++;
            localStorage.setItem('loginAttempts_' + trn, loginAttempts);
            
            var attemptsLeft = MAX_LOGIN_ATTEMPTS - loginAttempts;
            if (attemptsLeft > 0) {
                alert('Invalid TRN or password! ' + attemptsLeft + ' attempt(s) remaining.');
            } else {
                alert('Account locked! Too many failed attempts.');
                window.location.href = 'account-locked.html';
            }
        }
    }
    
    return false;
}

// ===================================
// GROUP PROJECT: PRODUCT CATALOGUE FUNCTIONS
// ===================================

// Initialize products array
function initializeProducts() {
    allProducts = [
        {
            name: 'Lavender Dream',
            price: 15.99,
            description: 'Relaxing lavender essential oil perfect for bedtime',
            image: 'Assets/lavender_dream.jpg',
            category: 'candle'
        },
        {
            name: 'Vanilla Bliss',
            price: 14.99,
            description: 'Sweet vanilla bean for cozy evenings',
            image: 'Assets/Vanilla_Bliss.jpg',
            category: 'candle'
        },
        {
            name: 'Ocean Breeze',
            price: 16.99,
            description: 'Fresh ocean scent for summer vibes',
            image: 'Assets/Ocean_Breeze.jpg',
            category: 'candle'
        },
        {
            name: 'Cinnamon Spice',
            price: 15.99,
            description: 'Warm spice blend for fall season',
            image: 'Assets/Cinnamon_Spice.jpg',
            category: 'candle'
        },
        {
            name: 'Rose Garden',
            price: 17.99,
            description: 'Elegant floral scent for romance',
            image: 'Assets/Rose_Garden.jpg',
            category: 'candle'
        },
        {
            name: 'Citrus Burst',
            price: 14.99,
            description: 'Energizing citrus blend for mornings',
            image: 'Assets/Citrus_Burst.jpg',
            category: 'candle'
        },
        {
            name: 'Fresh Linen Spray',
            price: 9.99,
            description: 'Clean and crisp room spray',
            image: 'Assets/Fresh_Linen.jpg',
            category: 'spray'
        },
        {
            name: 'Eucalyptus Mint Spray',
            price: 10.99,
            description: 'Refreshing spa-like fragrance',
            image: 'Assets/Eucalyptus_Mint.jpg',
            category: 'spray'
        },
        {
            name: 'Tropical Paradise Spray',
            price: 10.99,
            description: 'Exotic tropical fruit blend',
            image: 'Assets/Tropical.jpg',
            category: 'spray'
        }
    ];
}

// Save products to localStorage
function saveProductsToLocalStorage() {
    localStorage.setItem('AllProducts', JSON.stringify(allProducts));
}

// Load products from localStorage
function loadProductsFromLocalStorage() {
    var saved = localStorage.getItem('AllProducts');
    if (saved) {
        allProducts = JSON.parse(saved);
    } else {
        // Initialize with default products if none exist
        initializeProducts();
        saveProductsToLocalStorage();
    }
}

// Display products dynamically
function displayProducts() {
    var candlesGrid = document.getElementById('candlesGrid');
    var spraysGrid = document.getElementById('spraysGrid');
    var productsGrid = document.querySelector('.products-grid:not([id])');
    
    // If using dynamic grids (candlesGrid and spraysGrid)
    if (candlesGrid && spraysGrid) {
        // Clear existing content
        candlesGrid.innerHTML = '';
        spraysGrid.innerHTML = '';
        
        // Display candles
        allProducts.forEach(function(product) {
            if (product.category === 'candle') {
                var productCard = createProductCard(product);
                candlesGrid.appendChild(productCard);
            }
        });
        
        // Display sprays
        allProducts.forEach(function(product) {
            if (product.category === 'spray') {
                var productCard = createProductCard(product);
                spraysGrid.appendChild(productCard);
            }
        });
    } 
    // If using single products grid (for backward compatibility)
    else if (productsGrid) {
        productsGrid.innerHTML = '';
        
        allProducts.forEach(function(product) {
            var productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
}

// Create product card HTML
function createProductCard(product) {
    var card = document.createElement('div');
    card.className = 'product-card';
    
    var badge = '';
    if (product.name === 'Lavender Dream') {
        badge = '<span class="badge">Bestseller</span>';
    } else if (product.name === 'Ocean Breeze') {
        badge = '<span class="badge new">New</span>';
    } else if (product.name === 'Vanilla Bliss') {
        badge = '<span class="badge">Popular</span>';
    }
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Product+Image'">
            ${badge}
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
    
    return card;
}

// ===================================
// IA#2: CART FUNCTIONS (UPDATED FOR GROUP PROJECT)
// ===================================

// IA#2: Function to add product to cart - UPDATED FOR GROUP PROJECT
function addToCart(name, price) {
    // GROUP PROJECT: Find product details
    var product = null;
    for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i].name === name) {
            product = allProducts[i];
            break;
        }
    }
    
    // For backward compatibility
    if (!product) {
        product = {
            name: name,
            price: price,
            description: '',
            image: '',
            category: ''
        };
    }
    
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
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
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

// IA#2: Save cart to localStorage - USER SPECIFIC (UPDATED FOR GROUP PROJECT)
function saveCart() {
    if (currentUser) {
        // Save cart with username/TRN as key
        var key = 'cart_' + (currentUser.trn || currentUser.username);
        localStorage.setItem(key, JSON.stringify(cart));
        
        // Also update user's cart in RegistrationData
        var users = loadRegisteredUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].trn === (currentUser.trn || currentUser.username)) {
                users[i].cart = cart;
                saveRegisteredUsers(users);
                break;
            }
        }
    } else {
        localStorage.setItem('cart_guest', JSON.stringify(cart));
    }
}

// IA#2: Load cart from localStorage - USER SPECIFIC (UPDATED FOR GROUP PROJECT)
function loadCart() {
    if (currentUser) {
        // Try to load from user's RegistrationData first
        var users = loadRegisteredUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].trn === (currentUser.trn || currentUser.username)) {
                cart = users[i].cart || [];
                break;
            }
        }
        
        // Also load from localStorage for backward compatibility
        var key = 'cart_' + (currentUser.trn || currentUser.username);
        var saved = localStorage.getItem(key);
        if (saved) {
            cart = JSON.parse(saved);
        }
    } else {
        var saved = localStorage.getItem('cart_guest');
        if (saved) {
            cart = JSON.parse(saved);
        } else {
            cart = [];
        }
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
        if (empty) empty.style.display = 'block';
        if (summary) summary.style.display = 'none';
        return;
    }
    
    if (empty) empty.style.display = 'none';
    if (summary) summary.style.display = 'block';
    
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
    var subtotalEl = document.getElementById('subtotal');
    var discountEl = document.getElementById('discount');
    var taxEl = document.getElementById('tax');
    var totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (discountEl) discountEl.textContent = '$' + discount.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
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
    var checkoutSubtotal = document.getElementById('checkoutSubtotal');
    var checkoutDiscount = document.getElementById('checkoutDiscount');
    var checkoutTax = document.getElementById('checkoutTax');
    var checkoutTotal = document.getElementById('checkoutTotal');
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = '$' + subtotal.toFixed(2);
    if (checkoutDiscount) checkoutDiscount.textContent = '$' + discount.toFixed(2);
    if (checkoutTax) checkoutTax.textContent = '$' + tax.toFixed(2);
    if (checkoutTotal) checkoutTotal.textContent = '$' + total.toFixed(2);
    
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
// IA#2: CHECKOUT PROCESS & INVOICE
// ===================================

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
        username: currentUser.username,
        trn: currentUser.trn || currentUser.username // GROUP PROJECT: Add TRN
    };
    
    // IA#2: Confirm order
    if (confirm('Confirm order of $' + total.toFixed(2) + '?')) {
        // Save invoice first
        invoices.push(invoice);
        saveInvoices();
        
        // GROUP PROJECT: Also save invoice to user's RegistrationData
        var users = loadRegisteredUsers();
        for (var i = 0; i < users.length; i++) {
            if (users[i].trn === (currentUser.trn || currentUser.username)) {
                if (!users[i].invoices) users[i].invoices = [];
                users[i].invoices.push(invoice);
                saveRegisteredUsers(users);
                break;
            }
        }
        
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
    html += '<p><strong>TRN:</strong> ' + (invoice.trn || 'N/A') + '</p>'; // GROUP PROJECT: Add TRN
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
    
    // Filter invoices for current user
    var userInvoices = [];
    for (var i = 0; i < invoices.length; i++) {
        if (invoices[i].username === currentUser.username || invoices[i].trn === (currentUser.trn || currentUser.username)) {
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
