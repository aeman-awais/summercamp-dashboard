// Mediatiz Summer Camp Global JS Script

document.addEventListener('DOMContentLoaded', () => {
    // Highlight Active Navigation Links
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
        }
    });

    // Auto-dismiss Flash Messages after 4 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 500);
        }, 4000);
    });
});

// Utility function to create a Toast Notification
function showToast(message, type = 'info') {
    let alertContainer = document.querySelector('.alerts');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.className = 'alerts';
        // Insert after header or at top of body
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentElement('afterend', alertContainer);
        } else {
            document.body.prepend(alertContainer);
        }
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    // Choose appropriate icon
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    
    alert.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <span>${message}</span>
    `;
    
    alertContainer.appendChild(alert);

    // Fade in
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        alert.style.opacity = '1';
    }, 10);

    // Auto-dismiss
    setTimeout(() => {
        alert.style.transition = 'opacity 0.5s ease';
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.remove();
        }, 500);
    }, 3500);
}
