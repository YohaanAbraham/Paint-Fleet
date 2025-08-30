document.addEventListener('DOMContentLoaded', () => {
    // Auth Form Handling
    const authContainers = {
        login: document.getElementById('loginContainer'),
        signup: document.getElementById('signupContainer')
    };

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

    // Form Submission Handling
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Add login logic here
        
      
        window.location.href = 'customer-dashboard.html'; // Redirects to oute.html
    });

    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Add signup logic here
        alert('Signup functionality coming soon!');
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close auth forms when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.auth-container') && !e.target.closest('.auth-trigger')) {
            Object.values(authContainers).forEach(container => {
                container.style.display = 'none';
            });
        }
    });
});
