// Load content (contentData is now loaded from content.js)
function loadContent() {
    if (contentData) {
        populateContent();
        setupScrollEffect();
        // Delay map initialization to ensure DOM is ready
        setTimeout(() => {
            initializeWorldMap();
        }, 100);
    } else {
        console.error('Content data not available');
        // Fallback content if data is not available
        document.getElementById('page-title').textContent = 'Syeda Tahiyat Ahmed - Portfolio';
        document.getElementById('site-name').textContent = 'Syeda Tahiyat Ahmed';
    }
}

function populateContent() {
    if (!contentData) return;
    
    // Update page title and site name
    document.getElementById('page-title').textContent = contentData.siteInfo.title;
    document.getElementById('site-name').textContent = contentData.siteInfo.name;
    
    // Update about section
    document.getElementById('about-title').textContent = contentData.sections.about.title;
    
    // Update personal life section
    const personalImage = document.getElementById('personal-image');
    personalImage.src = contentData.sections.about.personalLife.image;
    personalImage.alt = "Personal Life - " + contentData.siteInfo.name;
    document.getElementById('personal-description').textContent = contentData.sections.about.personalLife.description;
    
    // Update professional life section
    const professionalImage = document.getElementById('professional-image');
    professionalImage.src = contentData.sections.about.professionalLife.image;
    professionalImage.alt = "Professional Life - " + contentData.siteInfo.name;
    document.getElementById('professional-description').textContent = contentData.sections.about.professionalLife.description;
    
    // Update debate life section if it exists
    if (contentData.sections.about.debateLife) {
        const debateImage = document.getElementById('debate-image');
        if (debateImage) {
            debateImage.src = contentData.sections.about.debateLife.image;
            debateImage.alt = "Debate Life - " + contentData.siteInfo.name;
        }
        const debateDescription = document.getElementById('debate-description');
        if (debateDescription) {
            debateDescription.textContent = contentData.sections.about.debateLife.description;
        }
    }
    
    // Update places section
    document.getElementById('places-title').textContent = contentData.sections.places.title;
    document.getElementById('places-description').textContent = contentData.sections.places.description;
    
    // Update subtext if it exists
    if (contentData.sections.places.subtext) {
        document.getElementById('places-subtext').textContent = contentData.sections.places.subtext;
    }
    
    // Update Say Hi section
    document.getElementById('say-hi-title').textContent = contentData.sections.sayHi.title;
    document.getElementById('say-hi-description').textContent = contentData.sections.sayHi.description;
    
    // Update casual social links
    const casualSocialLinks = document.getElementById('casual-social-links');
    casualSocialLinks.innerHTML = contentData.casualSocialMedia.map(social => `
        <a href="${social.url}" target="_blank" class="social-link ${social.name.toLowerCase()}">
            <i class="${social.icon} social-icon"></i>
            <span class="social-text">${social.name}</span>
        </a>
    `).join('');
    
    // Update Professional section
    document.getElementById('professional-title').textContent = contentData.sections.professional.title;
    document.getElementById('professional-contact-description').textContent = contentData.sections.professional.description;
    
    // Update professional social links
    const professionalSocialLinks = document.getElementById('professional-social-links');
    professionalSocialLinks.innerHTML = contentData.professionalSocialMedia.map(social => `
        <a href="${social.url}" target="_blank" class="social-link ${social.name.toLowerCase()}">
            <i class="${social.icon} social-icon"></i>
            <span class="social-text">${social.name}</span>
        </a>
    `).join('');
    
    // Update bakery section
    document.getElementById('bakery-description').textContent = contentData.sections.professional.bakeryDescription;
    
    // Update bakery social links
    const bakerySocialLinks = document.getElementById('bakery-social-links');
    bakerySocialLinks.innerHTML = contentData.bakerySocialMedia.map(social => `
        <a href="${social.url}" target="_blank" class="social-link ${social.name.toLowerCase()}">
            <i class="${social.icon} social-icon"></i>
            <span class="social-text">${social.name}</span>
        </a>
    `).join('');
    
    // Update footer
    document.getElementById('footer-copyright').textContent = contentData.footer.copyright;
}

function setupScrollEffect() {
    // Add scroll effect to header
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initializeWorldMap() {
    if (!contentData || !contentData.locations) {
        console.error('No contentData or locations found');
        return;
    }
    
    // Ensure the map container exists and has dimensions
    const mapContainer = document.getElementById('world-map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    
    // Force a reflow to ensure container has dimensions
    mapContainer.style.display = 'block';
    const containerHeight = mapContainer.offsetHeight;
    const containerWidth = mapContainer.offsetWidth;
    
    console.log('Initializing map with', contentData.locations.length, 'locations');
    console.log('Map container dimensions:', containerWidth + 'x' + containerHeight);
    
    // Initialize the map with a subtle, elegant style
    const map = L.map('world-map', {
        zoomControl: true,
        scrollWheelZoom: true,
        tap: true, // Enable tap for mobile
        dragging: true,
        touchZoom: true,
        preferCanvas: true // Use canvas renderer for better performance
    }).setView([25.2048, 55.2708], 2);
    
    
    // Add a more elegant tile layer with error handling
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        crossOrigin: true
    });
    
    tileLayer.on('tileerror', function(error, tile) {
        console.error('Tile loading error:', error);
        // Try alternative tile source if main one fails
        const altTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
    });
    
    tileLayer.on('load', function() {
        console.log('Map tiles loaded successfully');
    });
    
    tileLayer.addTo(map);
    
    // Country code mapping for flag images
    const countryCodesMap = {
        'Bangladesh': 'bd',
        'UAE': 'ae',
        'Qatar': 'qa',
        'UK': 'gb',
        'USA': 'us',
        'Scotland': 'gb-sct',  // Scotland flag
        'Wales': 'gb-wls',     // Wales flag
        'Malta': 'mt',
        'Albania': 'al',
        'Montenegro': 'me',
        'Georgia': 'ge',
        'India': 'in',
        'Japan': 'jp',
        'Antarctica': 'aq'     // Antarctica flag
    };
    
    // Function to get flag SVG path from location name
    const getFlagSvgPath = (locationName) => {
        // Extract country name from location string
        const countryMatch = locationName.match(/,\s*(.+)$/);
        const country = countryMatch ? countryMatch[1].trim() : locationName;
        
        // Get country code
        const countryCode = countryCodesMap[country];
        
        if (countryCode) {
            // Use local SVG files
            return `country-icons/flag-icons-main/flag-icons-main/flags/4x3/${countryCode}.svg`;
        }
        
        // Return null if no flag found
        return null;
    };
    
    // Add markers for each location
    let markersAdded = 0;
    contentData.locations.forEach((location, index) => {
        try {
            console.log(`Adding marker ${index + 1}:`, location.name, `(${location.lat}, ${location.lng})`);
            
            // Get flag SVG path for this location
            const flagPath = getFlagSvgPath(location.name);
            let marker;
            
            if (flagPath) {
                // Create custom div icon with flag as background
                const flagIcon = L.divIcon({
                    className: 'flag-marker',
                    html: `<div class="flag-container" style="background-image: url('${flagPath}');"></div>`,
                    iconSize: [48, 36],
                    iconAnchor: [24, 18],
                    popupAnchor: [0, -20]
                });
                
                marker = L.marker([location.lat, location.lng], { icon: flagIcon })
                    .addTo(map);
                markersAdded++;
            } else {
                // Fallback to a nice pin icon if flag not available
                const pinIcon = L.divIcon({
                    className: 'pin-marker',
                    html: '<div class="pin-icon">📍</div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30]
                });
                
                marker = L.marker([location.lat, location.lng], { icon: pinIcon })
                    .addTo(map);
                markersAdded++;
            }
            
            // Create elegant popup content
            const popupContent = `
                <div style="text-align: center; padding: 10px; min-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; color: #b76e79; font-family: 'Playfair Display', serif;">${location.name}</h3>
                    <img src="${location.image}" style="width: 100%; max-width: 200px; border-radius: 8px; margin-bottom: 10px;">
                    <p style="margin: 0; color: #6b6b6b; font-size: 14px; line-height: 1.5;">${location.story}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });
            
            // Change from hover to click
            marker.on('click', function() {
                this.openPopup();
            });
        } catch (error) {
            console.error(`Error adding marker for ${location.name}:`, error);
        }
    });
    
    console.log(`Successfully added ${markersAdded} markers out of ${contentData.locations.length}`);
    
    // Add subtle animation to map on load
    setTimeout(() => {
        map.flyTo([30, 0], 2.5, {
            duration: 2,
            easeLinearity: 0.5
        });
    }, 1500);
    
    // Force map to refresh tiles and ensure proper rendering
    setTimeout(() => {
        map.invalidateSize();
        console.log('Map refreshed and resized');
    }, 250);
    
    // Additional check to ensure markers are visible
    setTimeout(() => {
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                layer.update();
            }
        });
        console.log('Markers updated');
    }, 500);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    initializeAnimations();
    addSubtleEffects();
    createFloatingHearts();
    
    // Ensure map initializes after all content is loaded
    if (window.L && contentData) {
        setTimeout(() => {
            const mapElement = document.getElementById('world-map');
            if (mapElement && !mapElement._leaflet_id) {
                console.log('Re-initializing map after DOM ready');
                initializeWorldMap();
            }
        }, 500);
    }
});

// Animation functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation to child elements
                const children = entry.target.querySelectorAll('.fade-in-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all sections for fade-in animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Add fade-in to specific elements
    const fadeElements = document.querySelectorAll('.about-content, .map-container, .social-links');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function addSubtleEffects() {
    // Add parallax effect to about image
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            if (aboutImage.getBoundingClientRect().top < window.innerHeight) {
                aboutImage.style.transform = `translateY(${rate * 0.3}px)`;
            }
        });
    }
    
    // Add subtle hover effect to social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add subtle text reveal animation to headings
    const headings = document.querySelectorAll('section h2');
    headings.forEach(heading => {
        const text = heading.textContent;
        heading.innerHTML = text.split('').map((char, i) => 
            `<span style="display: inline-block; opacity: 0; transform: translateY(20px); transition: all 0.5s ease ${i * 0.05}s;">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                }
                
                // Create floating hearts
            });
        });
        
        observer.observe(heading);
    });
}

// Create floating hearts
function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'floating-hearts';
    
    // Create 6 hearts
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '♥';
        heartsContainer.appendChild(heart);
    }
    
    document.body.appendChild(heartsContainer);
}

// Add smooth page transitions
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
