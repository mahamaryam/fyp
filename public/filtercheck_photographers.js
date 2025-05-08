// Photographer data
const photographers = [
    {
        name: "Elite Photography",
        location: "DHA Phase 5, Lahore",
        city: "Lahore",
        price: 50000,
        contact: "+92 300 1234567",
        staff: ["male"],
        image: "img/people/person1.jpg"
    },
    {
        name: "Royal Shots",
        location: "Gulberg, Lahore",
        city: "Lahore",
        price: 45000,
        contact: "+92 300 2345678",
        staff: ["male", "female"],
        image: "img/people/person2.jpg"
    },
    {
        name: "Capture Moments",
        location: "Clifton, Karachi",
        city: "Karachi",
        price: 60000,
        contact: "+92 300 3456789",
        staff: ["female"],
        image: "img/people/person3.jpg"
    },
    {
        name: "Lens Masters",
        location: "F-7, Islamabad",
        city: "Islamabad",
        price: 55000,
        contact: "+92 300 4567890",
        staff: ["male"],
        image: "img/people/person4.jpg"
    },
    {
        name: "Perfect Frames",
        location: "Bahria Town, Rawalpindi",
        city: "Rawalpindi",
        price: 40000,
        contact: "+92 300 5678901",
        staff: ["male", "female"],
        image: "img/people/person5.jpg"
    },
    {
        name: "Memories Studio",
        location: "Defence, Karachi",
        city: "Karachi",
        price: 65000,
        contact: "+92 300 6789012",
        staff: ["female"],
        image: "img/people/person6.jpg"
    },
    {
        name: "Shutter Magic",
        location: "Model Town, Lahore",
        city: "Lahore",
        price: 48000,
        contact: "+92 300 7890123",
        staff: ["male"],
        image: "img/people/person1.jpg"
    },
    {
        name: "Frame Perfect",
        location: "Blue Area, Islamabad",
        city: "Islamabad",
        price: 52000,
        contact: "+92 300 8901234",
        staff: ["male", "female"],
        image: "img/people/person2.jpg"
    }
];

// Function to create photographer card HTML
function createPhotographerCard(photographer) {
    return `
        <div class="col-lg-6 col-md-12 mb-4">
            <div class="venue-card">
                <img src="${photographer.image}" alt="Photographer Image">
                <div class="venue-info">
                    <h6>${photographer.name}</h6>
                    <p class="text-muted">${photographer.location}</p>
                    <p class="mb-1">${photographer.contact}</p>
                    <p class="mb-1">Starting at PKR ${photographer.price.toLocaleString()}</p>
                    <button class="explore-btn">View Details</button>
                </div>
            </div>
        </div>
    `;
}

// Function to apply filters
function applyFilters() {
    // Get all filter values
    const selectedCities = [];
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked && ['lahore', 'karachi', 'islamabad', 'rawalpindi'].includes(checkbox.id)) {
            selectedCities.push(checkbox.id.charAt(0).toUpperCase() + checkbox.id.slice(1));
        }
    });

    const selectedStaff = [];
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked && ['male', 'female', 'trans'].includes(checkbox.id)) {
            selectedStaff.push(checkbox.id.toLowerCase());
        }
    });

    const budgetRanges = {
        'budget1': { min: 0, max: 15000 },
        'budget2': { min: 15001, max: 40000 },
        'budget3': { min: 40001, max: 70000 },
        'budget4': { min: 70001, max: 100000 },
        'budget5': { min: 100000, max: Infinity }
    };

    const selectedBudgets = [];
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked && checkbox.id.startsWith('budget')) {
            selectedBudgets.push(budgetRanges[checkbox.id]);
        }
    });

    // Filter photographers
    let filteredPhotographers = photographers.filter(photographer => {
        // City filter
        if (selectedCities.length > 0 && !selectedCities.includes(photographer.city)) {
            return false;
        }

        // Budget filter
        if (selectedBudgets.length > 0) {
            const matchesBudget = selectedBudgets.some(range => 
                photographer.price >= range.min && photographer.price <= range.max
            );
            if (!matchesBudget) return false;
        }

        // Staff filter
        if (selectedStaff.length > 0) {
            const hasMatchingStaff = selectedStaff.some(staffType => 
                photographer.staff.includes(staffType)
            );
            if (!hasMatchingStaff) return false;
        }

        return true;
    });

    // If no filters are selected, show all photographers
    if (selectedCities.length === 0 && selectedBudgets.length === 0 && selectedStaff.length === 0) {
        filteredPhotographers = photographers;
    }

    // Find the container and update it with filtered results
    const resultsContainer = document.querySelector('.col-md-8 .row');
    if (resultsContainer) {
        // Clear existing content
        resultsContainer.innerHTML = '';
        
        // Add filtered photographers
        if (filteredPhotographers.length > 0) {
            filteredPhotographers.forEach(photographer => {
                resultsContainer.innerHTML += createPhotographerCard(photographer);
            });
        } else {
            resultsContainer.innerHTML = '<div class="col-12 text-center"><h4>No photographers found matching your criteria</h4></div>';
        }
    }
}

// Initialize filters when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Apply initial filters
    applyFilters();
}); 