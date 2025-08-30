document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.querySelector('.quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = quoteForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--danger)';
                    isValid = false;
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                // Form is valid - process submission
                alert('Thank you! Your quote request has been submitted. We will contact you within 24 hours.');
                quoteForm.reset();
                
                // In a real app, you would send data to your backend here
                // fetch('/api/quotes', { method: 'POST', body: new FormData(quoteForm) });
            } else {
                alert('Please fill in all required fields.');
            }
        });
        
        // Add input validation styling
        const inputs = quoteForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#ddd';
                }
            });
        });
    }
});
