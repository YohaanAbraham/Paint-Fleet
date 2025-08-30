// User database (in a real app, this would be a backend database)
let usersDB = JSON.parse(localStorage.getItem('paintfleet_users')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Auth Form Handling
    const authContainers = {
        login: document.getElementById('loginContainer'),
        signup: document.getElementById('signupContainer')
    };

    // Show/hide auth forms
    document.querySelectorAll('.auth-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const formType = trigger.dataset.form;
            Object.values(authContainers).forEach(container => {
                container.style.display = 'none';
            });
            authContainers[formType].style.display = 'flex';
        });
    });

    // Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value.trim();
        const password = this.querySelector('input[type="password"]').value.trim();
        
        // Validate inputs
        if (!email || !password) {
            showAuthError('Please fill in all fields');
            return;
        }

        // Find user
        const user = usersDB.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Successful login
            localStorage.setItem('paintfleet_currentUser', JSON.stringify(user));
            window.location.href = 'customer-dashboard.html';
        } else {
            showAuthError('Invalid email or password');
        }
    });

    // Signup Form Submission
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const password = this.querySelector('input[type="password"]').value.trim();
        
        // Validate inputs
        if (!name || !email || !password) {
            showAuthError('Please fill in all fields');
            return;
        }

        // Check if user already exists
        if (usersDB.some(u => u.email === email)) {
            showAuthError('Email already registered');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            joinDate: new Date().toISOString()
        };

        // Save to database
        usersDB.push(newUser);
        localStorage.setItem('paintfleet_users', JSON.stringify(usersDB));
        
        // Auto-login and redirect
        //localStorage.setItem('paintfleet_currentUser', JSON.stringify(newUser));
        //window.location.href = 'customer-dashboard.html';
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close auth forms when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.auth-container') && !e.target.closest('.auth-trigger')) {
            Object.values(authContainers).forEach(container => {
                container.style.display = 'none';
            });
        }
    });

    // Check if user is already logged in
    checkLoggedInStatus();
});

function showAuthError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'auth-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--secondary-color)';
    errorElement.style.marginTop = '1rem';
    errorElement.style.textAlign = 'center';
    
    // Remove existing error if any
    document.querySelectorAll('.auth-error').forEach(el => el.remove());
    
    // Add new error
    document.querySelector('.auth-form').appendChild(errorElement);
}

function checkLoggedInStatus() {
    const currentUser = JSON.parse(localStorage.getItem('paintfleet_currentUser'));
    if (currentUser && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'customer-dashboard.html';
    }
}
