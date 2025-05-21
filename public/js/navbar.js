// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add logout button to navbar
    const navbar = document.querySelector('.navbar-nav');
    if (navbar && Auth.isLoggedIn()) {
        const logoutItem = document.createElement('li');
        logoutItem.className = 'nav-item';
        logoutItem.innerHTML = `
            <a class="nav-link" href="#" onclick="Auth.logout()">Logout</a>
        `;
        navbar.appendChild(logoutItem);
    }
}); 