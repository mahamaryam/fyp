// Venues page functionality
let allVenues = []; // Store all venues for filtering

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    console.log('Fetching venues from API...');
    const response = await fetch('http://localhost:4201/api/venues', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch venues');

    const data = await response.json();

    // Normalize data in case API returns object with venues key or array directly
    allVenues = Array.isArray(data) ? data : (data.venues || []);

    displayVenues(allVenues);
    setupFilterHandlers();
  } catch (error) {
    console.error('Error loading venues:', error);
    const container = document.querySelector('.venues-container');
    if (container) {
      container.innerHTML = `<div class="alert alert-danger">Failed to load venues. ${error.message}</div>`;
    }
  }
});

function displayVenues(venues) {
  const container = document.querySelector('.venues-container');
  if (!container) return;

  if (venues.length === 0) {
    container.innerHTML = '<div class="col-12 text-center"><h4>No venues found matching your criteria</h4></div>';
    return;
  }

  container.innerHTML = venues.map(venue => `
    <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" 
         data-city="${venue.addressCity}" 
         data-price="${venue.price}"
         data-area="${venue.addressArea}">
      <div class="card h-100 shadow-sm">
        <img src="${venue.imagePath || 'img/venues/default.jpg'}" class="card-img-top" alt="${venue.name}" 
             onerror="this.src='img/venues/default.jpg'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${venue.name}</h5>
          <p class="card-text flex-grow-1">${venue.description}</p>
          <p class="card-text mb-1"><small class="text-muted">${venue.addressArea}, ${venue.addressCity}</small></p>
          <p class="card-text mb-1"><small class="text-muted">Open: ${venue.openAtTiming} (${venue.openAtDays})</small></p>
          <p class="card-text mb-3"><strong>Price: PKR ${venue.price.toLocaleString()}</strong></p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <button class="btn btn-primary book-venue" 
                    data-venue-id="${venue._id}"
                    data-bs-toggle="modal" 
                    data-bs-target="#bookingModal">
              Book Now
            </button>
            ${venue.renderPath ? `<a href="3d.html?venue=${venue._id}" class="btn btn-outline-primary">View in 3D</a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Add booking button event listeners
  container.querySelectorAll('.book-venue').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('venueId').value = button.dataset.venueId;
    });
  });
}

function setupFilterHandlers() {
  const cityIds = ['lahore', 'karachi', 'islamabad', 'rawalpindi'];
  const priceIds = ['price1', 'price2', 'price3', 'price4', 'price5'];
  const timingIds = ['morning', 'afternoon', 'evening'];

  const areaSearch = document.getElementById('areaSearch');

  [...cityIds, ...priceIds, ...timingIds].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });

  if (areaSearch) areaSearch.addEventListener('input', applyFilters);
}

function applyFilters() {
  // Selected cities (capitalize first letter)
  const selectedCities = ['lahore', 'karachi', 'islamabad', 'rawalpindi']
    .filter(city => document.getElementById(city)?.checked)
    .map(city => city.charAt(0).toUpperCase() + city.slice(1));

  // Area search term (lowercase)
  const areaSearchTerm = document.getElementById('areaSearch')?.value.toLowerCase() || '';

  // Price ranges
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

  // Selected timings
  const selectedTimings = ['morning', 'afternoon', 'evening']
    .filter(timing => document.getElementById(timing)?.checked);

  // Parse time string helper
  function parseTimeString(timeStr) {
    timeStr = timeStr.toLowerCase().trim();

    if (timeStr.includes('morning')) return 8; // 8 AM
    if (timeStr.includes('afternoon')) return 13; // 1 PM
    if (timeStr.includes('evening')) return 18; // 6 PM

    const timeMatch = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);
    if (!timeMatch) return -1;

    let hours = parseInt(timeMatch[1]);
    const isPM = timeMatch[3]?.toLowerCase() === 'pm';

    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return hours;
  }

  // Filter venues
  const filtered = allVenues.filter(venue => {
    if (selectedCities.length && !selectedCities.includes(venue.addressCity)) return false;

    if (areaSearchTerm && !venue.addressArea.toLowerCase().includes(areaSearchTerm)) return false;

    if (selectedPriceRanges.length) {
      const matchesPrice = selectedPriceRanges.some(range => venue.price >= range.min && venue.price <= range.max);
      if (!matchesPrice) return false;
    }

    if (selectedTimings.length) {
      const openingHour = parseTimeString(venue.openAtTiming.split('-')[0]);
      const matchesTiming = selectedTimings.some(timing => {
        switch (timing) {
          case 'morning': return openingHour >= 6 && openingHour < 12;
          case 'afternoon': return openingHour >= 12 && openingHour < 17;
          case 'evening': return openingHour >= 17 || openingHour < 6;
          default: return true;
        }
      });
      if (!matchesTiming) return false;
    }

    return true;
  });

  displayVenues(filtered);
}

// Booking form submission
document.getElementById('confirmBooking')?.addEventListener('click', async () => {
  const venueId = document.getElementById('venueId').value;
  const bookingData = {
    date: document.getElementById('bookingDate').value,
    numberOfGuests: parseInt(document.getElementById('guestCount').value),
    eventType: document.getElementById('eventType').value,
    additionalNotes: document.getElementById('additionalNotes').value
  };

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

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
      // Assuming Bootstrap modal with jQuery:
      if (window.$) {
        $('#bookingModal').modal('hide');
      }
    } else {
      alert(data.message || 'Failed to book venue. Please try again.');
    }
  } catch (error) {
    console.error('Booking error:', error);
    alert('Failed to book venue. Please try again later.');
  }
});
