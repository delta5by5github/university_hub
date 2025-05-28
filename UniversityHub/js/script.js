document.addEventListener('DOMContentLoaded', () => {
    const universityListContainer = document.getElementById('universityList');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const locationFilter = document.getElementById('locationFilter');
    const courseFilter = document.getElementById('courseFilter');

    let allUniversities = []; // Store the original data
    let currentFilteredUniversities = []; // Store currently displayed data

    // --- Fetch University Data ---
    async function fetchUniversities() {
        try {
            const response = await fetch('data/universities.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allUniversities = await response.json();
            populateFilters(); // Populate filters once data is loaded
            displayUniversities(allUniversities); // Display all universities initially
        } catch (error) {
            console.error('Error fetching universities:', error);
            universityListContainer.innerHTML = '<p>Could not load university data. Please try again later.</p>';
        }
    }

    // --- Populate Filter Dropdowns ---
    function populateFilters() {
        const locations = new Set();
        const courses = new Set();

        allUniversities.forEach(uni => {
            locations.add(uni.location);
            uni.courseOfferings.forEach(course => courses.add(course));
        });

        // Populate Location Filter
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });

        // Populate Course Filter
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseFilter.appendChild(option);
        });
    }

    // --- Display Universities (Render Function) ---
    function displayUniversities(universities) {
        universityListContainer.innerHTML = ''; // Clear previous results
        if (universities.length === 0) {
            universityListContainer.innerHTML = '<p>No universities found matching your criteria.</p>';
            return;
        }

        universities.forEach(uni => {
            const universityCard = document.createElement('div');
            universityCard.classList.add('university-card');
            universityCard.innerHTML = `
                <h3>${uni.name}</h3>
                <p><strong>Type:</strong> ${uni.type}</p>
                <p><strong>Location:</strong> ${uni.location}</p>
                <p><strong>Admission Requirements:</strong> ${uni.admissionRequirements}</p>
                <p><strong>Course Offerings:</strong> ${uni.courseOfferings.join(', ')}</p>
                <p><strong>Contact:</strong> ${uni.contact}</p>
            `;
            universityListContainer.appendChild(universityCard);
        });
    }

    // --- Apply Filters and Search ---
    function applyFiltersAndSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedLocation = locationFilter.value;
        const selectedCourse = courseFilter.value;

        currentFilteredUniversities = allUniversities.filter(uni => {
            const matchesSearch = searchTerm === '' ||
                                  uni.name.toLowerCase().includes(searchTerm) ||
                                  uni.location.toLowerCase().includes(searchTerm) ||
                                  uni.courseOfferings.some(course => course.toLowerCase().includes(searchTerm));

            const matchesType = selectedType === 'all' || uni.type === selectedType;
            const matchesLocation = selectedLocation === 'all' || uni.location === selectedLocation;
            const matchesCourse = selectedCourse === 'all' || uni.courseOfferings.includes(selectedCourse);

            return matchesSearch && matchesType && matchesLocation && matchesCourse;
        });

        displayUniversities(currentFilteredUniversities);
    }

    // --- Event Listeners ---
    searchInput.addEventListener('input', applyFiltersAndSearch);
    typeFilter.addEventListener('change', applyFiltersAndSearch);
    locationFilter.addEventListener('change', applyFiltersAndSearch);
    courseFilter.addEventListener('change', applyFiltersAndSearch);

    // Initial data load
    fetchUniversities();
});