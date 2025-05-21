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
    },
    {
        name: "Premium Decor Services",
        location: "Blue Area, Islamabad",
        city: "Islamabad",
        price: 65000,
        staff: ["male"],
        image: "img/venues/venue2.jpg"
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

// Pagination variables
const itemsPerPage = 4;
let currentPage = 1;
let currentFilteredVendors = [];

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

// Function to render vendors on a specific page
function renderPage(vendors, page) {
    const resultsContainer = document.querySelector('.col-md-8 .row');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const vendorsToShow = vendors.slice(start, end);

    if (vendorsToShow.length === 0) {
        resultsContainer.innerHTML = '<div class="col-12 text-center"><h4>No vendors found matching your criteria</h4></div>';
    } else {
        vendorsToShow.forEach(vendor => {
            resultsContainer.innerHTML += createVendorCard(vendor);
        });
    }

    renderPagination(vendors.length);
}

// Function to render pagination controls
function renderPagination(totalItems) {
    const paginationContainer = document.querySelector("#pagination");
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary mx-1';
        button.textContent = i;
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            renderPage(currentFilteredVendors, currentPage);
        });
        paginationContainer.appendChild(button);
    }
}

// Function to apply filters
function applyFilters() {
    currentPage = 1; // Reset to first page when filters change

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
        if (selectedCities.length > 0 && !selectedCities.includes(vendor.city)) return false;
        if (subArea && !vendor.location.toLowerCase().includes(subArea)) return false;
        if (selectedBudgets.length > 0) {
            const matchesBudget = selectedBudgets.some(range => vendor.price >= range.min && vendor.price <= range.max);
            if (!matchesBudget) return false;
        }
        if (selectedStaff.length > 0) {
            const hasStaff = selectedStaff.some(staffType => vendor.staff.includes(staffType));
            if (!hasStaff) return false;
        }
        return true;
    });

    if (selectedCities.length === 0 && !subArea && selectedBudgets.length === 0 && selectedStaff.length === 0) {
        filteredVendors = decorVendors;
    }

    currentFilteredVendors = filteredVendors;
    renderPage(currentFilteredVendors, currentPage);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    const subAreaInput = document.querySelector('input[placeholder="e.g., G-10 Markaz"]');
    if (subAreaInput) {
        subAreaInput.addEventListener('input', applyFilters);
    }

    // Container for pagination buttons (you must add a div with id="pagination" in your HTML)
    if (!document.querySelector('#pagination')) {
        const pagDiv = document.createElement('div');
        pagDiv.id = 'pagination';
        pagDiv.className = 'text-center my-4';
        document.querySelector('.container')?.appendChild(pagDiv);
    }

    // Initial render
    currentFilteredVendors = decorVendors;
    renderPage(currentFilteredVendors, currentPage);
});
