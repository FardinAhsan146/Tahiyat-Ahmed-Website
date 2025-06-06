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
    // Set Cesium Ion access token (using default token)
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';
    
    // Initialize the Cesium viewer with 3D satellite imagery
    const viewer = new Cesium.Viewer('world-map', {
        terrainProvider: Cesium.createWorldTerrain(),
        imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }), // Bing Maps satellite imagery
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false
    });
    
    // Enable lighting based on sun/moon positions
    viewer.scene.globe.enableLighting = true;
    
    // Set initial camera position (global view)
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(55.2708, 25.2048, 15000000),
        orientation: {
            heading: 0.0,
            pitch: -0.5,
            roll: 0.0
        }
    });
    
    // Add markers for each location
    locations.forEach((location, index) => {
        // Create billboard (marker) for each location
        const entity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(location.lng, location.lat),
            billboard: {
                image: 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="20" fill="#3498db" stroke="#fff" stroke-width="4"/>
                        <text x="24" y="30" text-anchor="middle" fill="white" font-size="20">📍</text>
                    </svg>
                `),
                scale: 1.0,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
            label: {
                text: location.name,
                font: '14pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(0, 32),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        
        // Store location data in entity for later use
        entity.locationData = location;
    });
    
    // Handle click events on entities
    viewer.selectedEntityChanged.addEventListener(function(selectedEntity) {
        if (selectedEntity && selectedEntity.locationData) {
            const location = selectedEntity.locationData;
            
            // Fly to the location
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, 5000),
                orientation: {
                    heading: 0.0,
                    pitch: -0.5,
                    roll: 0.0
                },
                duration: 3.0
            });
            
            // Show info box
            showLocationInfo(location);
        }
    });
}

function showLocationInfo(location) {
    // Remove existing info box
    const existingBox = document.querySelector('.location-info-box');
    if (existingBox) {
        existingBox.remove();
    }
    
    // Create info box
    const infoBox = document.createElement('div');
    infoBox.className = 'location-info-box';
    infoBox.style.position = 'absolute';
    infoBox.style.top = '20px';
    infoBox.style.right = '20px';
    infoBox.style.zIndex = '1000';
    
    infoBox.innerHTML = `
        <div class="info-box-content">
            <img src="${location.image}" alt="${location.name}" class="info-box-image">
            <div class="info-box-text">
                <h3 class="info-box-title">${location.name}</h3>
                <p class="info-box-story">${location.story}</p>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    
    // Add to map container
    document.querySelector('.map-container').appendChild(infoBox);
}
