// IA#2: JavaScript for Vibe & Light E-Commerce
// Student: Jessica Goldson | ID: 2405416

// IA#2: Cart array to store products
var cart = [];
var currentUser = null;
var invoices = [];

// IA#2: Load data when page loads
window.onload = function() {
    loadCart();
    loadCurrentUser();
    loadInvoices();
    showCart();
    showCheckout();
    displayInvoiceHistory();
    updateUIForAuth();
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
    if (currentUser) {
        // Save cart with username as key
        localStorage.setItem('cart_' + currentUser.username, JSON.stringify(cart));
    } else {
        // Guest cart (cleared on logout)
        localStorage.setItem('cart_guest', JSON.stringify(cart));
    }
}

// IA#2: Load cart from localStorage - USER SPECIFIC
function loadCart() {
    if (currentUser) {
        // Load user-specific cart
        var saved = localStorage.getItem('cart_' + currentUser.username);
        if (saved) {
            cart = JSON.parse(saved);
        } else {
            cart = [];
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
    // IA#2: Get input values
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    // IA#2: Clear errors
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
    var valid = true;
    
    // IA#2: Check username
    if (username === '') {
        document.getElementById('usernameError').textContent = 'Username required';
        valid = false;
    }
    
    // IA#2: Check password
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password required';
        valid = false;
    }
    
    // IA#2: If valid, login
    if (valid) {
        // Get registered users
        var users = localStorage.getItem('registeredUsers');
        var usersList = users ? JSON.parse(users) : [];
        
        // Find user
        var foundUser = null;
        for (var i = 0; i < usersList.length; i++) {
            if (usersList[i].username === username && usersList[i].password === password) {
                foundUser = usersList[i];
                break;
            }
        }
        
        if (foundUser) {
            currentUser = foundUser;
            saveCurrentUser();
            alert('Login successful! Welcome ' + username);
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password!');
        }
    }
    
    return false;
}

// IA#2: Validate register form
function validateRegister() {
    // IA#2: Get input values
    var name = document.getElementById('fullName').value;
    var dob = document.getElementById('dob').value;
    var email = document.getElementById('email').value;
    var username = document.getElementById('regUsername').value;
    var password = document.getElementById('regPassword').value;
    var confirm = document.getElementById('confirmPassword').value;
    
    // IA#2: Clear errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('dobError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmError').textContent = '';
    
    var valid = true;
    
    // IA#2: Validate name
    if (name === '') {
        document.getElementById('nameError').textContent = 'Name required';
        valid = false;
    }
    
    // IA#2: Validate DOB
    if (dob === '') {
        document.getElementById('dobError').textContent = 'Date of birth required';
        valid = false;
    }
    
    // IA#2: Validate email format
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Valid email required';
        valid = false;
    }
    
    // IA#2: Validate username
    if (username === '') {
        document.getElementById('usernameError').textContent = 'Username required';
        valid = false;
    }
    
    // IA#2: Validate password length
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be 6+ characters';
        valid = false;
    }
    
    // IA#2: Check passwords match
    if (password !== confirm) {
        document.getElementById('confirmError').textContent = 'Passwords do not match';
        valid = false;
    }
    
    // IA#2: If valid, register
    if (valid) {
        // Get existing users
        var users = localStorage.getItem('registeredUsers');
        var usersList = users ? JSON.parse(users) : [];
        
        // Check if username exists
        var exists = false;
        for (var i = 0; i < usersList.length; i++) {
            if (usersList[i].username === username) {
                exists = true;
                break;
            }
        }
        
        if (exists) {
            alert('Username already exists!');
            return false;
        }
        
        // Add new user
        var newUser = {
            fullName: name,
            dob: dob,
            email: email,
            username: username,
            password: password
        };
        usersList.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(usersList));
        
        alert('Registration successful! Welcome ' + name);
        window.location.href = 'login.html';
    }
    
    return false;
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
        username: currentUser.username
    };
    
    // IA#2: Confirm order
    if (confirm('Confirm order of $' + total.toFixed(2) + '?')) {
        // Save invoice first
        invoices.push(invoice);
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
    
    // Filter invoices for current user
    var userInvoices = [];
    for (var i = 0; i < invoices.length; i++) {
        if (invoices[i].username === currentUser.username) {
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
