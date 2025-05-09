// Constant
const API_BASE_URL = 'http://localhost:4201/api';
let currentVenueId = null;

console.log('Admin panel initialized with API URL:', API_BASE_URL);

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing admin panel...');
    checkAuth();
    loadVenues();
    setupEventListeners();
});

// Authentication check
function checkAuth() {
    console.log('Checking authentication...');
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No authentication token found, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    console.log('Authentication token found');
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    console.log('Logout button listener attached');

    // Save venue button
    document.getElementById('saveVenue').addEventListener('click', handleSaveVenue);
    console.log('Save venue button listener attached');

    // Delete confirmation button
    document.getElementById('confirmDelete').addEventListener('click', handleDeleteVenue);
    console.log('Delete confirmation button listener attached');

    // Reset form when modal is closed
    document.getElementById('addVenueModal').addEventListener('hidden.bs.modal', () => {
        console.log('Modal closed - Resetting form');
        document.getElementById('venueForm').reset();
        document.getElementById('modalTitle').textContent = 'Add New Venue';
        currentVenueId = null;
        console.log('Form reset complete, currentVenueId cleared');
    });
}

// Load Venues
async function loadVenues() {
    console.log('Loading venues...');
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No auth token found');
            showAlert('Please login again', 'warning');
            window.location.href = 'login.html';
            return;
        }

        console.log('Making API request to fetch venues...');
        const response = await fetch(`${API_BASE_URL}/venues`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Venues API response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            throw new Error(errorData.message || 'Failed to fetch venues');
        }
        
        const venues = await response.json();
        console.log('Venues loaded successfully:', venues.length, 'venues found');
        displayVenues(venues);
    } catch (error) {
        console.error('Error loading venues:', error);
        showAlert(error.message || 'Failed to load venues', 'danger');
    }
}

// Check if venue exists
async function checkVenueExists(venueName, addressCity, addressArea) {
    console.log('Checking if venue exists:', { venueName, addressCity, addressArea });
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/venues`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to check venue existence');
        }

        const venues = await response.json();
        
        const exists = venues.some(venue => 
            venue.name.toLowerCase() === venueName.toLowerCase() &&
            venue.addressCity.toLowerCase() === addressCity.toLowerCase() &&
            venue.addressArea.toLowerCase() === addressArea.toLowerCase()
        );
        
        console.log('Venue existence check result:', exists);
        return exists;
    } catch (error) {
        console.error('Error checking venue existence:', error);
        throw error;
    }
}

// Display Venues
function displayVenues(venues) {
    console.log('Displaying venues:', venues.length, 'total venues');
    const venuesList = document.getElementById('venuesList');
    
    if (!venues.length) {
        console.log('No venues to display');
        venuesList.innerHTML = '<div class="col-12 text-center"><h4>No venues found</h4></div>';
        return;
    }

    venuesList.innerHTML = venues.map(venue => `
        <div class="col-md-4 mb-4">
            <div class="card venue-card">
                <img src="${venue.imagePath || 'img/venues/default.jpg'}" 
                     class="card-img-top" 
                     alt="${venue.name}"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${venue.name}</h5>
                    <p class="card-text">${venue.description}</p>
                    <p class="card-text">
                        <small class="text-muted">
                            ${venue.addressArea}, ${venue.addressCity}
                        </small>
                    </p>
                    <p class="card-text">
                        <strong>Price: PKR ${venue.price?.toLocaleString() || 'Not set'}</strong>
                    </p>
                    <div class="venue-actions">
                        <button class="btn btn-primary btn-sm" onclick="handleEdit('${venue._id}')">
                            <i class="fas fa-edit me-1"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="handleDelete('${venue._id}')">
                            <i class="fas fa-trash me-1"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    console.log('Venues display completed');
}

// Handle Edit Venue
async function handleEdit(venueId) {
    console.log('Editing venue:', venueId);
    try {
        const token = localStorage.getItem('token');
        console.log('Fetching venue details...');
        
        const response = await fetch(`${API_BASE_URL}/venue/${venueId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Venue details API response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch venue details');
        
        const venue = await response.json();
        console.log('Venue details loaded:', venue);
        
        populateForm(venue.data);
        
        document.getElementById('modalTitle').textContent = 'Edit Venue';
        currentVenueId = venueId;
        console.log('Form populated and modal prepared for editing');
        
        new bootstrap.Modal(document.getElementById('addVenueModal')).show();
    } catch (error) {
        console.error('Error fetching venue details:', error);
        showAlert('Failed to load venue details', 'danger');
    }
}

// Populate Form
function populateForm(venue) {
    console.log('Populating form with venue data:', venue);
    document.getElementById('venueName').value = venue.name;
    document.getElementById('venueDescription').value = venue.description || '';
    document.getElementById('venuePrice').value = venue.price || '';
    document.getElementById('venueCountry').value = venue.addressCountry;
    document.getElementById('venueCity').value = venue.addressCity;
    document.getElementById('venueArea').value = venue.addressArea;
    document.getElementById('venueZip').value = venue.addressZip;
    document.getElementById('venueTimings').value = venue.openAtTiming || '';
    document.getElementById('venueDays').value = venue.openAtDays || '';
    document.getElementById('venueImage').value = venue.imagePath || '';
    document.getElementById('venueRender').value = venue.renderPath || '';
    console.log('Form population completed');
}

// Handle Save Venue
async function handleSaveVenue() {
    console.log('Handling venue save...');
    try {
        const venueData = {
            name: document.getElementById('venueName').value,
            description: document.getElementById('venueDescription').value,
            price: Number(document.getElementById('venuePrice').value),
            addressCountry: document.getElementById('venueCountry').value,
            addressCity: document.getElementById('venueCity').value,
            addressArea: document.getElementById('venueArea').value,
            addressZip: document.getElementById('venueZip').value,
            openAtTiming: document.getElementById('venueTimings').value,
            openAtDays: document.getElementById('venueDays').value,
            imagePath: document.getElementById('venueImage').value,
            renderPath: document.getElementById('venueRender').value
        };
        
        console.log('Venue data collected:', venueData);

        if (!currentVenueId) {
            console.log('New venue - checking for duplicates...');
            const exists = await checkVenueExists(
                venueData.name,
                venueData.addressCity,
                venueData.addressArea
            );

            if (exists) {
                console.warn('Duplicate venue detected');
                showAlert('A venue with this name already exists in this location', 'warning');
                return;
            }
        }

        const token = localStorage.getItem('token');
        const url = currentVenueId 
            ? `${API_BASE_URL}/venue/${currentVenueId}`
            : `${API_BASE_URL}/venues`;
            
        console.log(`Making ${currentVenueId ? 'PUT' : 'POST'} request to:`, url);
        
        const response = await fetch(url, {
            method: currentVenueId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(venueData)
        });

        console.log('Save venue API response status:', response.status);

        if (!response.ok) throw new Error('Failed to save venue');

        bootstrap.Modal.getInstance(document.getElementById('addVenueModal')).hide();
        showAlert(`Venue ${currentVenueId ? 'updated' : 'added'} successfully`, 'success');
        console.log('Venue saved successfully, reloading venues...');
        loadVenues();
    } catch (error) {
        console.error('Error saving venue:', error);
        showAlert('Failed to save venue', 'danger');
    }
}

// Handle Delete Button Click
function handleDelete(venueId) {
    console.log('Preparing to delete venue:', venueId);
    currentVenueId = venueId;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

// Handle Delete Confirmation
async function handleDeleteVenue() {
    console.log('Confirming venue deletion for:', currentVenueId);
    try {
        const token = localStorage.getItem('token');
        console.log('Making DELETE request...');
        
        const response = await fetch(`${API_BASE_URL}/venue/${currentVenueId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Delete venue API response status:', response.status);

        if (!response.ok) throw new Error('Failed to delete venue');

        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        showAlert('Venue deleted successfully', 'success');
        console.log('Venue deleted successfully, reloading venues...');
        loadVenues();
    } catch (error) {
        console.error('Error deleting venue:', error);
        showAlert('Failed to delete venue', 'danger');
    }
}

// Handle Logout
function handleLogout() {
    console.log('Handling logout...');
    localStorage.removeItem('token');
    console.log('Token removed, redirecting to login page');
    window.location.href = 'login.html';
}

// Show Alert
function showAlert(message, type = 'info') {
    console.log('Showing alert:', { message, type });
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    
    console.log('Alert created, setting auto-dismiss timer');
    setTimeout(() => {
        alertDiv.remove();
        console.log('Alert removed');
    }, 3000);
} 
