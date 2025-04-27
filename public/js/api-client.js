// API Client for handling all backend interactions
const API_BASE_URL = 'http://localhost:4201/api'; // Update this to match your backend server port

const ApiClient = {
    // Auth endpoints
    auth: {
        login: async (email, password) => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
                    throw new Error(errorData.message || 'Login failed');
                }
                
                return await response.json();
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },
        signup: async (userData) => {
            try {
                // Add required fields if not provided
                const signupData = {
                    fullName: userData.fullName || 'User',
                    dateOfBirth: userData.dateOfBirth || new Date().toISOString(),
                    ...userData
                };

                const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(signupData),
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
                    throw new Error(errorData.message || 'Registration failed');
                }
                
                return await response.json();
            } catch (error) {
                console.error('Signup error:', error);
                throw error;
            }
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Venues endpoints
    venues: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/venues`);
            return await response.json();
        },
        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/venues/${id}`);
            return await response.json();
        },
        book: async (venueId, bookingData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/venues/${venueId}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });
            return await response.json();
        }
    },

    // Services endpoints (photographers, decorators, etc.)
    services: {
        getAll: async (type) => {
            const response = await fetch(`${API_BASE_URL}/services/${type}`);
            return await response.json();
        },
        getById: async (type, id) => {
            const response = await fetch(`${API_BASE_URL}/services/${type}/${id}`);
            return await response.json();
        },
        book: async (type, serviceId, bookingData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/services/${type}/${serviceId}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });
            return await response.json();
        }
    },

    // User profile endpoints
    profile: {
        get: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await response.json();
        },
        update: async (userData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });
            return await response.json();
        },
        getBookings: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await response.json();
        }
    },

    // Helper methods
    helpers: {
        setAuthToken: (token) => {
            localStorage.setItem('token', token);
        },
        getAuthToken: () => {
            return localStorage.getItem('token');
        },
        isAuthenticated: () => {
            return !!localStorage.getItem('token');
        }
    }
}; 