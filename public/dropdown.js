// Dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Show dropdown on hover
            dropdown.addEventListener('mouseenter', function() {
                menu.classList.add('show');
                menu.style.display = 'block';
                menu.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
            });
            
            // Hide dropdown when mouse leaves
            dropdown.addEventListener('mouseleave', function() {
                menu.classList.remove('show');
                menu.style.display = 'none';
                menu.style.opacity = '0';
                menu.style.transform = 'translateY(-10px)';
            });

            // Handle click events
            toggle.addEventListener('click', function(e) {
                // If the dropdown is already shown, prevent navigation
                if (menu.classList.contains('show')) {
                    e.preventDefault();
                }
            });
        }
    });
});
