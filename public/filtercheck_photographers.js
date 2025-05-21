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

const itemsPerPage = 4;
let currentPage = 1;
let currentFilteredPhotographers = [];

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

function renderPhotographersWithPagination(filteredPhotographers) {
    const resultsContainer = document.querySelector('.col-md-8 .row');
    const paginationContainer = document.querySelector('#pagination');

    if (!resultsContainer || !paginationContainer) return;

    // Clear old content
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    // Slice for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const photographersToShow = filteredPhotographers.slice(startIndex, endIndex);

    // Render photographer cards
    if (photographersToShow.length > 0) {
        photographersToShow.forEach(photographer => {
            resultsContainer.innerHTML += createPhotographerCard(photographer);
        });
    } else {
        resultsContainer.innerHTML = '<div class="col-12 text-center"><h4>No photographers found matching your criteria</h4></div>';
    }

    // Create pagination buttons
    const totalPages = Math.ceil(filteredPhotographers.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `page-btn btn btn-sm mx-1 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderPhotographersWithPagination(currentFilteredPhotographers);
        });
        paginationContainer.appendChild(pageBtn);
    }
}

function applyFilters() {
    const selectedCities = [];
    const selectedStaff = [];
    const selectedBudgets = [];

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked && ['lahore', 'karachi', 'islamabad', 'rawalpindi'].includes(checkbox.id)) {
            selectedCities.push(checkbox.id.charAt(0).toUpperCase() + checkbox.id.slice(1));
        }
        if (checkbox.checked && ['male', 'female', 'trans'].includes(checkbox.id)) {
            selectedStaff.push(checkbox.id.toLowerCase());
        }
        if (checkbox.checked && checkbox.id.startsWith('budget')) {
            const budgetRanges = {
                'budget1': { min: 0, max: 15000 },
                'budget2': { min: 15001, max: 40000 },
                'budget3': { min: 40001, max: 70000 },
                'budget4': { min: 70001, max: 100000 },
                'budget5': { min: 100000, max: Infinity }
            };
            selectedBudgets.push(budgetRanges[checkbox.id]);
        }
    });

    let filteredPhotographers = photographers.filter(p => {
        if (selectedCities.length > 0 && !selectedCities.includes(p.city)) return false;

        if (selectedBudgets.length > 0) {
            const inBudget = selectedBudgets.some(range =>
                p.price >= range.min && p.price <= range.max
            );
            if (!inBudget) return false;
        }

        if (selectedStaff.length > 0) {
            const matchesStaff = selectedStaff.some(staffType =>
                p.staff.includes(staffType)
            );
            if (!matchesStaff) return false;
        }

        return true;
    });

    if (selectedCities.length === 0 && selectedBudgets.length === 0 && selectedStaff.length === 0) {
        filteredPhotographers = photographers;
    }

    currentPage = 1;
    currentFilteredPhotographers = filteredPhotographers;
    renderPhotographersWithPagination(filteredPhotographers);
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Ensure pagination container exists
    if (!document.querySelector('#pagination')) {
        const paginationDiv = document.createElement('div');
        paginationDiv.id = 'pagination';
        paginationDiv.className = 'text-center mt-3';
        document.querySelector('.col-md-8').appendChild(paginationDiv);
    }

    applyFilters();
});
