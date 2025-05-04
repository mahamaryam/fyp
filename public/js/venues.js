// Venues page functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Load venues
    try {
        const venues = await ApiClient.venues.getAll();
        displayVenues(venues);
    } catch (error) {
        console.error('Error loading venues:', error);
        alert('Failed to load venues. Please try again later.');
    }
});

function displayVenues(venues) {
    const venuesContainer = document.querySelector('.venues-container');
    if (!venuesContainer) return;

    venuesContainer.innerHTML = venues.map(venue => `
        <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
            <div class="card h-100">
                <img src="${venue.image}" class="card-img-top" alt="${venue.name}">
                <div class="card-body">
                    <h5 class="card-title">${venue.name}</h5>
                    <p class="card-text">${venue.description}</p>
                    <p class="card-text"><small class="text-muted">Capacity: ${venue.capacity} guests</small></p>
                    <p class="card-text"><strong>Price: $${venue.price}</strong></p>
                    <button class="btn btn-primary book-venue" data-venue-id="${venue._id}">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');

    // Add booking handlers
    document.querySelectorAll('.book-venue').forEach(button => {
        button.addEventListener('click', async (e) => {
            const venueId = e.target.dataset.venueId;
            try {
                // You might want to show a modal or form here to collect booking details
                const bookingData = {
                    date: new Date().toISOString(), // You should collect this from user
                    numberOfGuests: 100, // You should collect this from user
                    // Add other booking details as needed
                };
                
                const response = await ApiClient.venues.book(venueId, bookingData);
                if (response.success) {
                    alert('Venue booked successfully!');
                    // Optionally redirect to bookings page or show booking details
                } else {
                    alert(response.message || 'Failed to book venue. Please try again.');
                }
            } catch (error) {
                console.error('Booking error:', error);
                alert('Failed to book venue. Please try again later.');
            }
        });
    });
}

// Filter functionality
document.getElementById('search-venue')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.closest('.col-lg-4').style.display = '';
        } else {
            card.closest('.col-lg-4').style.display = 'none';
        }
    });
}); 