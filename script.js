// IA#2: JavaScript for Vibe & Light E-Commerce
// Student: Jessica Goldson | ID: 2210723

// IA#2: Cart array to store products
var cart = [];

// IA#2: Load cart when page loads
window.onload = function() {
    loadCart();
    showCart();
    showCheckout();
};

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

// IA#2: Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// IA#2: Load cart from localStorage
function loadCart() {
    var saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
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
        alert('Login successful! Welcome ' + username);
        window.location.href = 'index.html';
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
        alert('Registration successful! Welcome ' + name);
        window.location.href = 'login.html';
    }
    
    return false;
}

// ===================================
// IA#2: CHECKOUT PROCESS
// ===================================

// IA#2: Process checkout
function processCheckout() {
    // IA#2: Get form values
    var name = document.getElementById('shippingName').value;
    var email = document.getElementById('shippingEmail').value;
    var amount = parseFloat(document.getElementById('amountPaid').value);
    
    // IA#2: Get total
    var totalText = document.getElementById('checkoutTotal').textContent;
    var total = parseFloat(totalText.replace('$', ''));
    
    // IA#2: Check amount
    if (amount < total) {
        alert('Amount paid is less than total!');
        return false;
    }
    
    // IA#2: Confirm order
    if (confirm('Confirm order of $' + total.toFixed(2) + '?')) {
        alert('Order confirmed! Thank you ' + name);
        cart = [];
        saveCart();
        window.location.href = 'index.html';
    }
    
    return false;
}

// IA#2: Cancel checkout
function cancelCheckout() {
    if (confirm('Cancel checkout?')) {
        window.location.href = 'cart.html';
    }
}