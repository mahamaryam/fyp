// Auth utility functions
const Auth = {
    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('token') !== null;
    },

    // Get current user data from API
    getCurrentUser: async function() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch('http://localhost:4201/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    },

    // Check authentication and redirect if needed
    checkAuth: async function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }

        // Verify token is still valid
        try {
            const response = await fetch('http://localhost:4201/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                this.logout();
                return false;
            }
            return true;
        } catch (error) {
            console.error('Auth verification error:', error);
            this.logout();
            return false;
        }
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

    // Logout user
    logout: function() {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }
}; 