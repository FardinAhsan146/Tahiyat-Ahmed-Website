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
    // Set Mapbox access token (using a public token for demo - you should get your own)
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    // Initialize the map with 3D satellite view
    const map = new mapboxgl.Map({
        container: 'world-map',
        style: 'mapbox://styles/mapbox/satellite-v9', // Satellite view
        center: [55.2708, 25.2048], // Dubai coordinates
        zoom: 2,
        pitch: 45, // 3D tilt
        bearing: 0,
        antialias: true
    });
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());
    
    // Add 3D terrain
    map.on('style.load', () => {
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        
        // Add sky layer for 3D effect
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
    });
    
    // Add markers for each location
    locations.forEach((location, index) => {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = '📍';
        
        // Create popup content
        const popupContent = `
            <div class="popup-content">
                <img src="${location.image}" alt="${location.name}" class="popup-image">
                <div class="popup-text">
                    <h3 class="popup-title">${location.name}</h3>
                    <p class="popup-story">${location.story}</p>
                </div>
            </div>
        `;
        
        // Create popup
        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '350px'
        }).setHTML(popupContent);
        
        // Create marker and add to map
        new mapboxgl.Marker(markerElement)
            .setLngLat([location.lng, location.lat])
            .setPopup(popup)
            .addTo(map);
        
        // Add click event to marker
        markerElement.addEventListener('click', () => {
            // Fly to location with 3D view
            map.flyTo({
                center: [location.lng, location.lat],
                zoom: 12,
                pitch: 60,
                bearing: 0,
                essential: true,
                duration: 2000
            });
        });
    });
}
