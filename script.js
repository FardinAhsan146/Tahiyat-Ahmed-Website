// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
        } else {
            header.style.background = '#2c3e50';
        }
    });
    
    // Initialize the world map
    initializeWorldMap();
    
    // Modal functionality
    setupModal();
});

// Sample location data - you can add more locations here
const locations = [
    {
        name: "Dubai, UAE",
        lat: 25.2048,
        lng: 55.2708,
        image: "photos/Capture.PNG",
        story: "This is where I currently live and work. Dubai is an amazing city with incredible architecture and a vibrant multicultural atmosphere."
    },
    {
        name: "New York, USA",
        lat: 40.7128,
        lng: -74.0060,
        image: "photos/Capture.PNG",
        story: "The city that never sleeps! I visited New York and was amazed by the energy, the skyscrapers, and the diversity of people and cultures."
    },
    {
        name: "London, UK",
        lat: 51.5074,
        lng: -0.1278,
        image: "photos/Capture.PNG",
        story: "London's rich history and beautiful architecture left a lasting impression on me. From Big Ben to the Thames, every corner tells a story."
    }
];

function initializeWorldMap() {
    // Initialize the map with satellite view
    const map = L.map('world-map').setView([25.2048, 55.2708], 2);
    
    // Add satellite tile layer (using Esri World Imagery which is free)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
    }).addTo(map);
    
    // Add markers for each location
    locations.forEach((location, index) => {
        // Create custom marker
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '📍',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // Create popup content with image and story
        const popupContent = `
            <div class="map-popup-content">
                <img src="${location.image}" alt="${location.name}" class="map-popup-image" loading="lazy">
                <div class="map-popup-text">
                    <h3 class="map-popup-title">${location.name}</h3>
                    <p class="map-popup-story">${location.story}</p>
                </div>
            </div>
        `;
        
        const marker = L.marker([location.lat, location.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(popupContent, {
                maxWidth: 320,
                minWidth: 280,
                className: 'custom-popup',
                closeButton: true,
                autoClose: true,
                closeOnEscapeKey: true,
                keepInView: false, // Disable to prevent repositioning on hover
                autoPan: true,
                autoPanPadding: L.point(50, 50)
            });
        
        // Add hover effect for better UX
        marker.on('mouseover', function() {
            this.getElement().style.transform = 'scale(1.1)';
        });
        
        marker.on('mouseout', function() {
            this.getElement().style.transform = 'scale(1)';
        });
    });
}

function setupModal() {
    // Not needed for popup approach
}
