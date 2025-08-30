document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('paintfleet_currentUser'));
    
    if (!currentUser || currentUser.role !== 'painter') {
        window.location.href = 'index.html';
        return;
    }

    // Update user initials and welcome message
    document.querySelector('.user-profile span').textContent = currentUser.name.split(' ')[0][0] + '.';
    document.querySelector('.welcome-banner h1').textContent = `Welcome back, ${currentUser.name.split(' ')[0]}!`;

    // Load job quotes assigned to the painter or available
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('paintfleet_quotes_'));
    const quoteContainer = document.getElementById('pending-quote-projects');

    allKeys.forEach(key => {
        const quotes = JSON.parse(localStorage.getItem(key)) || [];
        
        quotes.forEach(quote => {
            if (quote.status === 'Available' || quote.assignedTo === currentUser.email) {
                const card = document.createElement('div');
                card.className = 'project-card';

                card.innerHTML = `
                    <div class="project-header">
                        <h3>${quote.title}</h3>
                        <span class="status ${quote.status.toLowerCase()}">${quote.status}</span>
                    </div>
                    <div class="project-details">
                        <p><i class="fas fa-home"></i> Sqft: ${quote.sqft}</p>
                        <p><i class="fas fa-paint-roller"></i> Coats: ${quote.coats}</p>
                        <p><i class="fas fa-map-marker-alt"></i> Metro: ${quote.metroArea}</p>
                        <p><i class="fas fa-calendar-alt"></i> Requested: ${quote.startDate}</p>
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-outline"><i class="fas fa-file-alt"></i> View Details</button>
                        <button class="btn btn-primary"><i class="fas fa-check-circle"></i> Accept Job</button>
                    </div>
                `;

                quoteContainer.appendChild(card);
            }
        });
    });

    // Logout button
    const logoutBtn = document.createElement('div');
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('paintfleet_currentUser');
        window.location.href = 'index.html';
    });

    document.querySelector('.user-profile').appendChild(logoutBtn);
});
