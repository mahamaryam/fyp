// Venues page functionality
let allVenues = []; // Store all venues for filtering

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch('http://localhost:4201/api/venues', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch venues');
        }

        const data = await response.json();
        // Handle both array and object response formats
        allVenues = Array.isArray(data) ? data : (data.venues || []);
        displayVenues(allVenues);
        setupFilterHandlers();
    } catch (error) {
        console.error('Error loading venues:', error);
        document.querySelector('.venues-container').innerHTML = 
            `<div class="alert alert-danger">Failed to load venues. ${error.message}</div>`;
    }
});

function displayVenues(venues) {
    const venuesContainer = document.querySelector('.venues-container');
    if (!venuesContainer) return;

    if (venues.length === 0) {
        venuesContainer.innerHTML = '<div class="col-12 text-center"><h4>No venues found matching your criteria</h4></div>';
        return;
    }

    venuesContainer.innerHTML = venues.map(venue => `
        <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" 
             data-city="${venue.addressCity}" 
             data-price="${venue.price}"
             data-area="${venue.addressArea}">
            <div class="card h-100">
                <img src="${venue.imagePath}" class="card-img-top" alt="${venue.name}" 
                     onerror="this.src='img/venues/default.jpg'">
                <div class="card-body">
                    <h5 class="card-title">${venue.name}</h5>
                    <p class="card-text">${venue.description}</p>
                    <p class="card-text">
                        <small class="text-muted">
                            ${venue.addressArea}, ${venue.addressCity}
                        </small>
                    </p>
                    <p class="card-text">
                        <small class="text-muted">
                            Open: ${venue.openAtTiming} (${venue.openAtDays})
                        </small>
                    </p>
                    <p class="card-text">
                        <strong>Price: PKR ${venue.price.toLocaleString()}</strong>
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary book-venue" 
                                data-venue-id="${venue._id}"
                                data-bs-toggle="modal" 
                                data-bs-target="#bookingModal">
                            Book Now
                        </button>
                        ${venue.renderPath ? `
                            <a href="3d.html?venue=${venue._id}" 
                               class="btn btn-outline-primary">
                                View in 3D
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add booking handlers
    document.querySelectorAll('.book-venue').forEach(button => {
        button.addEventListener('click', function() {
            const venueId = this.dataset.venueId;
            document.getElementById('venueId').value = venueId;
        });
    });
}

function setupFilterHandlers() {
    // Add event listeners to all filter inputs
    const cityCheckboxes = ['lahore', 'karachi', 'islamabad', 'rawalpindi'].map(city => 
        document.getElementById(city));
    const priceCheckboxes = ['price1', 'price2', 'price3', 'price4', 'price5'].map(price => 
        document.getElementById(price));
    const timingCheckboxes = ['morning', 'afternoon', 'evening'].map(timing => 
        document.getElementById(timing));
    const areaSearch = document.getElementById('areaSearch');

    // Add change event listeners
    [...cityCheckboxes, ...priceCheckboxes, ...timingCheckboxes].forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener('change', applyFilters);
        }
    });

    // Add input event listener for area search
    if (areaSearch) {
        areaSearch.addEventListener('input', applyFilters);
    }
}

function applyFilters() {
    // Get selected cities
    const selectedCities = ['lahore', 'karachi', 'islamabad', 'rawalpindi']
        .filter(city => document.getElementById(city)?.checked)
        .map(city => city.charAt(0).toUpperCase() + city.slice(1));

    // Get area search term
    const areaSearchTerm = document.getElementById('areaSearch')?.value.toLowerCase() || '';

    // Get selected price ranges with non-overlapping boundaries
    const priceRanges = {
        'price1': { min: 0, max: 1999 },
        'price2': { min: 2000, max: 2999 },
        'price3': { min: 3000, max: 3999 },
        'price4': { min: 4000, max: 4999 },
        'price5': { min: 5000, max: Infinity }
    };

    const selectedPriceRanges = Object.entries(priceRanges)
        .filter(([id]) => document.getElementById(id)?.checked)
        .map(([, range]) => range);

    // Get selected timing preferences
    const selectedTimings = ['morning', 'afternoon', 'evening']
        .filter(timing => document.getElementById(timing)?.checked);

    // Helper function to parse time string
    function parseTimeString(timeStr) {
        timeStr = timeStr.toLowerCase().trim();
        
        // Handle special cases
        if (timeStr.includes('morning')) return 0;
        if (timeStr.includes('afternoon')) return 12;
        if (timeStr.includes('evening')) return 17;
        
        // Extract hours from various formats
        const timeMatch = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);
        if (!timeMatch) return -1;
        
        let hours = parseInt(timeMatch[1]);
        const isPM = timeMatch[3]?.toLowerCase() === 'pm';
        
        // Convert to 24-hour format
        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        
        return hours;
    }

    // Filter venues
    const filteredVenues = allVenues.filter(venue => {
        // City filter
        if (selectedCities.length > 0 && !selectedCities.includes(venue.addressCity)) {
            return false;
        }

        // Area filter
        if (areaSearchTerm && !venue.addressArea.toLowerCase().includes(areaSearchTerm)) {
            return false;
        }

        // Price filter
        if (selectedPriceRanges.length > 0) {
            const matchesPrice = selectedPriceRanges.some(range => 
                venue.price >= range.min && venue.price <= range.max
            );
            if (!matchesPrice) return false;
        }

        // Timing filter
        if (selectedTimings.length > 0) {
            const timingStr = venue.openAtTiming.toLowerCase();
            const openingHour = parseTimeString(timingStr.split('-')[0]);
            
            const matchesTiming = selectedTimings.some(timing => {
                switch(timing) {
                    case 'morning':
                        return openingHour >= 6 && openingHour < 12;
                    case 'afternoon':
                        return openingHour >= 12 && openingHour < 17;
                    case 'evening':
                        return openingHour >= 17 || openingHour < 6; // Including night hours
                    default:
                        return true;
                }
            });
            if (!matchesTiming) return false;
        }

        return true;
    });

    // Display filtered venues
    displayVenues(filteredVenues);
}

// Handle booking form submission
document.getElementById('confirmBooking')?.addEventListener('click', async function() {
    const venueId = document.getElementById('venueId').value;
    const bookingData = {
        date: document.getElementById('bookingDate').value,
        numberOfGuests: parseInt(document.getElementById('guestCount').value),
        eventType: document.getElementById('eventType').value,
        additionalNotes: document.getElementById('additionalNotes').value
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4201/api/venues/${venueId}/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Venue booked successfully!');
            $('#bookingModal').modal('hide');
        } else {
            alert(data.message || 'Failed to book venue. Please try again.');
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('Failed to book venue. Please try again later.');
    }
}); 