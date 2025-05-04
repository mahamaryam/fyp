// Auth utility functions
const Auth = {
    // Check if user is logged in
    isLoggedIn: function() {
        return !!localStorage.getItem('token');
    },

    // Redirect to login if not authenticated
    requireAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    },

    // Redirect to home if already authenticated
    redirectIfLoggedIn: function() {
        if (this.isLoggedIn()) {
            window.location.href = 'homepage.html';
        }
    },

    // Clear auth data
    logout: function() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}; 