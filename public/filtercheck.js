// Decor vendor data
const decorVendors = [
    {
        name: "Royal Decorators",
        location: "DHA Phase 5, Lahore",
        city: "Lahore",
        price: 50000,
        staff: ["male", "female"],
        image: "img/venues/venue1.jpg"
    },
    {
        name: "Elite Wedding Decor",
        location: "Gulberg, Lahore",
        city: "Lahore",
        price: 75000,
        staff: ["male"],
        image: "img/venues/venue2.jpg"
    },
    {
        name: "Dream Decor Studio",
        location: "Clifton, Karachi",
        city: "Karachi",
        price: 60000,
        staff: ["female"],
        image: "img/venues/venue3.jpg"
    },
    {
        name: "Luxury Event Designers",
        location: "F-7, Islamabad",
        city: "Islamabad",
        price: 85000,
        staff: ["male", "female"],
        image: "img/venues/venue1.jpg"
    },
    {
        name: "Elegant Decor Solutions",
        location: "Bahria Town, Rawalpindi",
        city: "Rawalpindi",
        price: 45000,
        staff: ["male"],
        image: "img/venues/venue2.jpg"
    },
    {
        name: "Grand Wedding Decor",
        location: "Defence, Karachi",
        city: "Karachi",
        price: 70000,
        staff: ["female"],
        image: "img/venues/venue3.jpg"
    },
    {
        name: "Classic Event Decor",
        location: "Model Town, Lahore",
        city: "Lahore",
        price: 55000,
        staff: ["male", "female"],
        image: "img/venues/venue1.jpg"
    },
    {
        name: "Premium Decor Services",
        location: "Blue Area, Islamabad",
        city: "Islamabad",
        price: 65000,
        staff: ["male"],
        image: "img/venues/venue2.jpg"
    }
];

// Function to create vendor card HTML
function createVendorCard(vendor) {
    return `
        <div class="col-lg-6 col-md-12 mb-4">
            <div class="venue-card">
                <img src="${vendor.image}" alt="Venue Image">
                <div class="venue-info">
                    <h6>${vendor.name}</h6>
                    <p class="text-muted">${vendor.location}</p>
                    <p class="mb-1">Starting at PKR ${vendor.price.toLocaleString()}</p>
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

    const subArea = document.querySelector('input[placeholder="e.g., G-10 Markaz"]').value.toLowerCase();

    const budgetRanges = {
        'budget1': { min: 0, max: 30000 },
        'budget2': { min: 30001, max: 60000 },
        'budget3': { min: 60001, max: 100000 },
        'budget4': { min: 500001, max: 1000000 },
        'budget5': { min: 1000000, max: Infinity }
    };

    const selectedBudgets = [];
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked && checkbox.id.startsWith('budget')) {
            selectedBudgets.push(budgetRanges[checkbox.id]);
        }
    });

    // Filter vendors
    let filteredVendors = decorVendors.filter(vendor => {
        // City filter
        if (selectedCities.length > 0 && !selectedCities.includes(vendor.city)) {
            return false;
        }

        // Sub area filter
        if (subArea && !vendor.location.toLowerCase().includes(subArea)) {
            return false;
        }

        // Budget filter
        if (selectedBudgets.length > 0) {
            const matchesBudget = selectedBudgets.some(range => 
                vendor.price >= range.min && vendor.price <= range.max
            );
            if (!matchesBudget) return false;
        }

        // Staff filter
        if (selectedStaff.length > 0) {
            const hasMatchingStaff = selectedStaff.some(staffType => 
                vendor.staff.includes(staffType)
            );
            if (!hasMatchingStaff) return false;
        }

        return true;
    });

    // If no filters are selected, show all vendors
    if (selectedCities.length === 0 && !subArea && selectedBudgets.length === 0 && selectedStaff.length === 0) {
        filteredVendors = decorVendors;
    }

    // Find the container and update it with filtered results
    const resultsContainer = document.querySelector('.col-md-8 .row');
    if (resultsContainer) {
        // Clear existing content
        resultsContainer.innerHTML = '';
        
        // Add filtered vendors
        if (filteredVendors.length > 0) {
            filteredVendors.forEach(vendor => {
                resultsContainer.innerHTML += createVendorCard(vendor);
            });
        } else {
            resultsContainer.innerHTML = '<div class="col-12 text-center"><h4>No vendors found matching your criteria</h4></div>';
        }
    }
}

// Initialize filters when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Add event listener to sub area input
    const subAreaInput = document.querySelector('input[placeholder="e.g., G-10 Markaz"]');
    if (subAreaInput) {
        subAreaInput.addEventListener('input', applyFilters);
    }

    // Apply initial filters
    applyFilters();
});
