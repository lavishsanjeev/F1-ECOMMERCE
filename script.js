// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let products = [];
let filteredProducts = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Sample Product Data
const sampleProducts = [
    {
        id: 1,
        name: "Ferrari Team Jersey 2024",
        team: "ferrari",
        category: "jerseys",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        description: "Official Ferrari F1 team jersey with premium fabric and authentic team branding."
    },
    {
        id: 2,
        name: "Red Bull Racing T-Shirt",
        team: "redbull",
        category: "tshirts",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        description: "Comfortable Red Bull Racing t-shirt with iconic team logo."
    },
    {
        id: 3,
        name: "Mercedes AMG Cap",
        team: "mercedes",
        category: "caps",
        price: 35.99,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop",
        description: "Official Mercedes AMG Petronas F1 team cap with adjustable strap."
    },
    {
        id: 4,
        name: "McLaren Team Polo",
        team: "mclaren",
        category: "tshirts",
        price: 65.99,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=300&fit=crop",
        description: "Premium McLaren team polo shirt with moisture-wicking fabric."
    },
    {
        id: 5,
        name: "Ferrari Racing Jacket",
        team: "ferrari",
        category: "jerseys",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
        description: "Premium Ferrari racing jacket with team colors and logos."
    },
    {
        id: 6,
        name: "Red Bull Team Cap",
        team: "redbull",
        category: "caps",
        price: 32.99,
        image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400&h=300&fit=crop",
        description: "Official Red Bull Racing cap with team branding."
    },
    {
        id: 7,
        name: "Mercedes Team Jersey",
        team: "mercedes",
        category: "jerseys",
        price: 85.99,
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
        description: "Mercedes AMG Petronas team jersey with authentic design."
    },
    {
        id: 8,
        name: "McLaren Racing T-Shirt",
        team: "mclaren",
        category: "tshirts",
        price: 42.99,
        image: "https://images.unsplash.com/photo-1583743089695-4b816a340f82?w=400&h=300&fit=crop",
        description: "McLaren racing t-shirt with papaya orange team colors."
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    products = [...sampleProducts];
    filteredProducts = [...products];
    
    initializeApp();
    setupEventListeners();
    renderProducts();
    updateCartCount();
    updateWishlistCount();
    checkUserSession();
});

// Initialize Application
function initializeApp() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter event listeners
    document.getElementById('teamFilter').addEventListener('change', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    
    // Cart and wishlist buttons
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('wishlistBtn').addEventListener('click', toggleWishlist);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('closeWishlist').addEventListener('click', closeWishlist);
    
    // Modal event listeners
    document.getElementById('loginBtn').addEventListener('click', handleLoginClick);
    document.getElementById('checkoutBtn').addEventListener('click', () => openModal('checkoutModal'));
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('signOutBtn').addEventListener('click', signOut);
    
    // Close modal listeners
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchAuthTab(tabName);
        });
    });
    
    // Password toggle
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
    
    // Real-time validation
    setupFormValidation();
    
    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    
    // Dropdown menu filters
    document.querySelectorAll('[data-team]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('teamFilter').value = this.dataset.team;
            applyFilters();
            scrollToSection('shop');
        });
    });
    
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('categoryFilter').value = this.dataset.category;
            applyFilters();
            scrollToSection('shop');
        });
    });
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close modals when clicking overlay
    document.getElementById('overlay').addEventListener('click', closeAllModals);
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-actions">
                <button class="action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" 
                        onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn view-btn" onclick="openProductModal(${product.id})" title="Quick View">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <div class="product-team">${product.team.toUpperCase()}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                ADD TO CART
            </button>
        </div>
    `;
    return card;
}

// Apply Filters
function applyFilters() {
    const teamFilter = document.getElementById('teamFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    filteredProducts = products.filter(product => {
        let matchesTeam = !teamFilter || product.team === teamFilter;
        let matchesCategory = !categoryFilter || product.category === categoryFilter;
        let matchesPrice = true;
        
        if (priceFilter) {
            if (priceFilter === '0-50') {
                matchesPrice = product.price <= 50;
            } else if (priceFilter === '50-100') {
                matchesPrice = product.price > 50 && product.price <= 100;
            } else if (priceFilter === '100+') {
                matchesPrice = product.price > 100;
            }
        }
        
        return matchesTeam && matchesCategory && matchesPrice;
    });
    
    renderProducts();
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    renderCartItems();
    showAddToCartAnimation();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        renderCartItems();
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="qty-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, parseInt(this.value))" min="1">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
    } else {
        wishlist.push(product);
    }
    
    saveWishlist();
    updateWishlistCount();
    renderWishlistItems();
    updateWishlistButtons();
}

function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishlistCount() {
    document.getElementById('wishlistCount').textContent = wishlist.length;
}

function renderWishlistItems() {
    const wishlistItems = document.getElementById('wishlistItems');
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>';
        return;
    }
    
    wishlistItems.innerHTML = '';
    
    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
            <button class="remove-item" onclick="toggleWishlist(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        wishlistItems.appendChild(wishlistItem);
    });
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        if (isInWishlist(productId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    modal.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    if (modalId === 'checkoutModal') {
        updateCheckoutSummary();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    modal.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-modal-info">
                <div class="product-team">${product.team.toUpperCase()}</div>
                <h2>${product.name}</h2>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        ADD TO CART
                    </button>
                    <button class="wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" 
                            onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="size-chart">
                    <h4>Size Chart</h4>
                    <div class="sizes">
                        <span class="size">S</span>
                        <span class="size">M</span>
                        <span class="size">L</span>
                        <span class="size">XL</span>
                        <span class="size">XXL</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    openModal('productModal');
}

// Sidebar Functions
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    
    if (cartSidebar.classList.contains('open')) {
        renderCartItems();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function toggleWishlist() {
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    
    wishlistSidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    
    if (wishlistSidebar.classList.contains('open')) {
        renderWishlistItems();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeWishlist() {
    document.getElementById('wishlistSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Auth Functions
function checkUserSession() {
    if (currentUser) {
        updateUserInterface(currentUser);
    }
}

function handleLoginClick() {
    if (currentUser) {
        // User is logged in, show dropdown
        const dropdown = document.getElementById('userDropdown');
        dropdown.classList.toggle('hidden');
    } else {
        // User not logged in, show login modal
        openModal('loginModal');
    }
}

function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Form`).classList.remove('hidden');
    
    // Clear any existing errors
    clearFormErrors();
}

function setupFormValidation() {
    // Login form validation
    const loginEmail = document.querySelector('#loginForm input[name="email"]');
    const loginPassword = document.querySelector('#loginForm input[name="password"]');
    
    loginEmail.addEventListener('blur', () => validateEmail(loginEmail, 'loginEmailError'));
    loginPassword.addEventListener('blur', () => validatePassword(loginPassword, 'loginPasswordError'));
    
    // Register form validation
    const registerName = document.querySelector('#registerForm input[name="name"]');
    const registerEmail = document.querySelector('#registerForm input[name="email"]');
    const registerPassword = document.querySelector('#registerForm input[name="password"]');
    const confirmPassword = document.querySelector('#registerForm input[name="confirmPassword"]');
    
    registerName.addEventListener('blur', () => validateName(registerName, 'registerNameError'));
    registerEmail.addEventListener('blur', () => validateEmail(registerEmail, 'registerEmailError'));
    registerPassword.addEventListener('blur', () => validatePassword(registerPassword, 'registerPasswordError'));
    confirmPassword.addEventListener('blur', () => validateConfirmPassword(registerPassword, confirmPassword, 'registerConfirmPasswordError'));
}

function validateEmail(input, errorId) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById(errorId);
    
    if (!email) {
        showFieldError(input, errorElement, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showFieldError(input, errorElement, 'Please enter a valid email');
        return false;
    } else {
        clearFieldError(input, errorElement);
        return true;
    }
}

function validatePassword(input, errorId) {
    const password = input.value;
    const errorElement = document.getElementById(errorId);
    
    if (!password) {
        showFieldError(input, errorElement, 'Password is required');
        return false;
    } else if (password.length < 6) {
        showFieldError(input, errorElement, 'Password must be at least 6 characters');
        return false;
    } else {
        clearFieldError(input, errorElement);
        return true;
    }
}

function validateName(input, errorId) {
    const name = input.value.trim();
    const errorElement = document.getElementById(errorId);
    
    if (!name) {
        showFieldError(input, errorElement, 'Name is required');
        return false;
    } else if (name.length < 2) {
        showFieldError(input, errorElement, 'Name must be at least 2 characters');
        return false;
    } else {
        clearFieldError(input, errorElement);
        return true;
    }
}

function validateConfirmPassword(passwordInput, confirmInput, errorId) {
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const errorElement = document.getElementById(errorId);
    
    if (!confirmPassword) {
        showFieldError(confirmInput, errorElement, 'Please confirm your password');
        return false;
    } else if (password !== confirmPassword) {
        showFieldError(confirmInput, errorElement, 'Passwords do not match');
        return false;
    } else {
        clearFieldError(confirmInput, errorElement);
        return true;
    }
}

function showFieldError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearFieldError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
    document.querySelectorAll('input.error').forEach(input => {
        input.classList.remove('error');
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[name="email"]').value.trim();
    const password = e.target.querySelector('input[name="password"]').value;
    const submitBtn = e.target.querySelector('.auth-btn');
    
    // Validate form
    const isEmailValid = validateEmail(e.target.querySelector('input[name="email"]'), 'loginEmailError');
    const isPasswordValid = validatePassword(e.target.querySelector('input[name="password"]'), 'loginPasswordError');
    
    if (!isEmailValid || !isPasswordValid) {
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = '';
    
    // Simulate login (check against stored users or demo credentials)
    setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const user = storedUsers.find(u => u.email === email && u.password === password);
        
        if (user || (email === 'demo@f1store.com' && password === 'demo123')) {
            const userData = user || {
                name: 'Demo User',
                email: 'demo@f1store.com',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
            };
            
            loginUser(userData);
            showMessage('Login successful!', 'success');
            closeModal('loginModal');
        } else {
            showFieldError(e.target.querySelector('input[name="email"]'), document.getElementById('loginEmailError'), 'Invalid email or password');
        }
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'LOGIN';
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = e.target.querySelector('input[name="name"]').value.trim();
    const email = e.target.querySelector('input[name="email"]').value.trim();
    const password = e.target.querySelector('input[name="password"]').value;
    const confirmPassword = e.target.querySelector('input[name="confirmPassword"]').value;
    const submitBtn = e.target.querySelector('.auth-btn');
    
    // Validate all fields
    const isNameValid = validateName(e.target.querySelector('input[name="name"]'), 'registerNameError');
    const isEmailValid = validateEmail(e.target.querySelector('input[name="email"]'), 'registerEmailError');
    const isPasswordValid = validatePassword(e.target.querySelector('input[name="password"]'), 'registerPasswordError');
    const isConfirmPasswordValid = validateConfirmPassword(
        e.target.querySelector('input[name="password"]'),
        e.target.querySelector('input[name="confirmPassword"]'),
        'registerConfirmPasswordError'
    );
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        return;
    }
    
    // Check if email already exists
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (storedUsers.find(u => u.email === email)) {
        showFieldError(e.target.querySelector('input[name="email"]'), document.getElementById('registerEmailError'), 'Email already registered');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = '';
    
    // Simulate registration
    setTimeout(() => {
        const newUser = {
            name,
            email,
            password,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff1e1e&color=fff&size=100`
        };
        
        // Store user
        storedUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        
        // Auto login
        loginUser(newUser);
        showMessage('Registration successful!', 'success');
        closeModal('loginModal');
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'REGISTER';
    }, 1500);
}

// Google Sign-In Handler
function handleGoogleSignIn(response) {
    try {
        // Decode the JWT token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const userData = {
            name: payload.name,
            email: payload.email,
            avatar: payload.picture,
            googleId: payload.sub
        };
        
        loginUser(userData);
        showMessage('Google Sign-In successful!', 'success');
        closeModal('loginModal');
    } catch (error) {
        console.error('Google Sign-In error:', error);
        showMessage('Google Sign-In failed. Please try again.', 'error');
    }
}

function loginUser(userData) {
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserInterface(currentUser);
}

function updateUserInterface(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userDropdown = document.getElementById('userDropdown');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    // Update login button to show user name
    loginBtn.innerHTML = `<img src="${user.avatar}" alt="${user.name}" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 0.5rem; object-fit: cover;"> ${user.name.split(' ')[0]}`;
    
    // Update dropdown content
    userName.textContent = user.name;
    userEmail.textContent = user.email;
    userAvatar.src = user.avatar;
    userAvatar.alt = user.name;
    
    // Show dropdown on hover
    userDropdown.classList.remove('hidden');
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Reset UI
    const loginBtn = document.getElementById('loginBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    loginBtn.textContent = 'Login';
    userDropdown.classList.add('hidden');
    
    showMessage('Signed out successfully!', 'success');
}

// Checkout Functions
function updateCheckoutSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 9.99;
    const total = subtotal + shipping;
    
    document.getElementById('checkoutSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('checkoutTotal').textContent = total.toFixed(2);
}

function handleCheckout(e) {
    e.preventDefault();
    
    // Simulate payment processing
    const orderNumber = 'F1-' + Date.now().toString().slice(-6);
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 9.99;
    
    setTimeout(() => {
        document.getElementById('orderNumber').textContent = orderNumber;
        document.getElementById('orderTotal').textContent = total.toFixed(2);
        
        closeModal('checkoutModal');
        openModal('confirmationModal');
        
        // Clear cart after successful order
        clearCart();
        closeCart();
    }, 2000);
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showAddToCartAnimation() {
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.transform = 'scale(1.2)';
    cartBtn.style.color = '#ff1e1e';
    
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
        cartBtn.style.color = '';
    }, 300);
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Initialize cart and wishlist on page load
window.addEventListener('load', function() {
    renderCartItems();
    renderWishlistItems();
    updateWishlistButtons();
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-menu').classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
    }
});

// Close user dropdown when clicking outside
document.addEventListener('click', function(e) {
    const userMenu = document.getElementById('userMenu');
    const userDropdown = document.getElementById('userDropdown');
    
    if (currentUser && !userMenu.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllModals();
        closeCart();
        closeWishlist();
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.product-card, .feature');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Make Google Sign-In handler globally available
window.handleGoogleSignIn = handleGoogleSignIn;

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}