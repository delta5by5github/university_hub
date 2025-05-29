document.addEventListener('DOMContentLoaded', () => {
    const universityListContainer = document.getElementById('universityList');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const locationFilter = document.getElementById('locationFilter');
    const qualificationLevelFilter = document.getElementById('qualificationLevelFilter'); 

    let allUniversities = [];
    let currentFilteredUniversities = [];

    // --- Fetch University Data ---
    async function fetchUniversities() {
        try {
            const response = await fetch('data/universities.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allUniversities = await response.json();
            populateFilters();
            displayUniversities(allUniversities);
        } catch (error) {
            console.error('Error fetching universities:', error);
            universityListContainer.innerHTML = '<p>Could not load university data. Please try again later.</p>';
        }
    }

    // --- Populate Filter Dropdowns ---
    function populateFilters() {
        const locations = new Set();
        const predefinedQualificationLevels = ["Undergrad", "Postgrad", "Masters", "PhD"];

        allUniversities.forEach(uni => {
            locations.add(uni.location);
        });

        locationFilter.innerHTML = '<option value="all">All</option>';
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });

        qualificationLevelFilter.innerHTML = '<option value="all">All</option>';
        predefinedQualificationLevels.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            qualificationLevelFilter.appendChild(option);
        });
    }

    // --- Display Universities (Render Function) ---
    function displayUniversities(universities) {
        universityListContainer.innerHTML = '';
        if (universities.length === 0) {
            universityListContainer.innerHTML = '<p>No universities found matching your criteria.</p>';
            return;
        }

        universities.forEach(uni => {
            const universityCard = document.createElement('div');
            universityCard.classList.add('university-card');

            // Removed the logo container HTML here
            universityCard.innerHTML = `
                <h3>${uni.name}</h3>
                <p><strong>Type:</strong> ${uni.type}</p>
                <p><strong>Location:</strong> ${uni.location}</p>
                <p><strong>Admission Requirements:</strong> ${uni.admissionRequirements || 'N/A'}</p>
                <p><strong>Qualification Levels:</strong> ${uni.qualificationLevels.join(', ')}</p>
                <p><strong>Contact:</strong> ${uni.contact || 'N/A'}</p>
            `;
            
            // Add click event listener to the entire card
            universityCard.addEventListener('click', () => {
                if (uni.websiteUrl && uni.websiteUrl !== "#") {
                    window.open(uni.websiteUrl, '_blank');
                } else {
                    console.warn(`No valid website URL found for ${uni.name}.`);
                    alert(`Website not available for ${uni.name}. Please try contacting them directly.`);
                }
            });

            universityListContainer.appendChild(universityCard);
        });
    }

    // --- Apply Filters and Search ---
    function applyFiltersAndSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedLocation = locationFilter.value;
        const selectedQualificationLevel = qualificationLevelFilter.value; 

        currentFilteredUniversities = allUniversities.filter(uni => {
            const matchesSearch = searchTerm === '' ||
                                  uni.name.toLowerCase().includes(searchTerm) ||
                                  uni.location.toLowerCase().includes(searchTerm) ||
                                  uni.admissionRequirements.toLowerCase().includes(searchTerm);

            const matchesType = selectedType === 'all' || uni.type === selectedType;
            const matchesLocation = selectedLocation === 'all' || uni.location === selectedLocation;
            const matchesQualificationLevel = selectedQualificationLevel === 'all' || uni.qualificationLevels.includes(selectedQualificationLevel);

            return matchesSearch && matchesType && matchesLocation && matchesQualificationLevel;
        });

        displayUniversities(currentFilteredUniversities);
    }

    // --- Event Listeners ---
    searchInput.addEventListener('input', applyFiltersAndSearch);
    typeFilter.addEventListener('change', applyFiltersAndSearch);
    locationFilter.addEventListener('change', applyFiltersAndSearch);
    qualificationLevelFilter.addEventListener('change', applyFiltersAndSearch); 

    // Initial data load
    fetchUniversities();
});