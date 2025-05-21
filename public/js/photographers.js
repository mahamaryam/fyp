// Photographers page functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!ApiClient.helpers.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Load photographers
    try {
        const photographers = await ApiClient.services.getAll('photographers');
        displayPhotographers(photographers);
    } catch (error) {
        console.error('Error loading photographers:', error);
        alert('Failed to load photographers. Please try again later.');
    }
});

function displayPhotographers(photographers) {
    const photographersContainer = document.querySelector('.photographers-container');
    if (!photographersContainer) return;

    photographersContainer.innerHTML = photographers.map(photographer => `
        <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
            <div class="card h-100" data-city="${photographer.city}" data-price="${photographer.price}">
                <img src="${photographer.image}" class="card-img-top" alt="${photographer.name}">
                <div class="card-body">
                    <h5 class="card-title">${photographer.name}</h5>
                    <p class="card-text">${photographer.description}</p>
                    <p class="card-text"><small class="text-muted">Location: ${photographer.city}</small></p>
                    <p class="card-text"><strong>Starting from: $${photographer.price}</strong></p>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary book-photographer" data-photographer-id="${photographer._id}" 
                                data-bs-toggle="modal" data-bs-target="#bookingModal">
                            Book Now
                        </button>
                        <a href="${photographer.portfolio}" target="_blank" class="btn btn-outline-primary">View Portfolio</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add booking handlers
    document.querySelectorAll('.book-photographer').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('photographerId').value = this.dataset.photographerId;
        });
    });
}

// Handle booking form submission
document.getElementById('confirmBooking')?.addEventListener('click', async function() {
    const photographerId = document.getElementById('photographerId').value;
    const bookingData = {
        date: document.getElementById('bookingDate').value,
        eventType: document.getElementById('eventType').value,
        package: document.getElementById('package').value,
        additionalNotes: document.getElementById('additionalNotes').value
    };

    try {
        const response = await ApiClient.services.book('photographers', photographerId, bookingData);
        if (response.success) {
            alert('Photographer booked successfully!');
            $('#bookingModal').modal('hide');
        } else {
            alert(response.message || 'Failed to book photographer. Please try again.');
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('Failed to book photographer. Please try again later.');
    }
});

// Search functionality
document.getElementById('search-photographer')?.addEventListener('input', function(e) {
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

// Filter functionality
const filterInputs = document.querySelectorAll('input[type="checkbox"]');
filterInputs.forEach(input => {
    input.addEventListener('change', function() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            let show = true;
            
            // City filter
            const selectedCities = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.id);
            
            if (selectedCities.length > 0) {
                const photographerCity = card.dataset.city;
                show = selectedCities.includes(photographerCity.toLowerCase());
            }

            // Price range filter
            const selectedPriceRanges = Array.from(document.querySelectorAll('input[id^="price"]:checked'))
                .map(cb => cb.id);
            
            if (selectedPriceRanges.length > 0 && show) {
                const photographerPrice = parseInt(card.dataset.price);
                show = selectedPriceRanges.some(range => {
                    const [min, max] = range.match(/\d+/g).map(Number);
                    return photographerPrice >= min && (!max || photographerPrice <= max);
                });
            }

            card.closest('.col-lg-4').style.display = show ? '' : 'none';
        });
    });
}); 