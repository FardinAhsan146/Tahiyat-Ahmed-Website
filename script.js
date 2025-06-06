let contentData = null;

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        contentData = await response.json();
        populateContent();
        initializeWorldMap();
        setupNavigation();
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback content if JSON fails to load
        document.getElementById('page-title').textContent = 'Tahiyat Ahmed - Portfolio';
        document.getElementById('site-name').textContent = 'Tahiyat Ahmed';
    }
}

function populateContent() {
    if (!contentData) return;
    
    // Update page title and site name
    document.getElementById('page-title').textContent = contentData.siteInfo.title;
    document.getElementById('site-name').textContent = contentData.siteInfo.name;
    
    // Update navigation
    const navLinks = document.getElementById('nav-links');
    navLinks.innerHTML = `
        <li><a href="#about">${contentData.navigation.about}</a></li>
        <li><a href="#places">${contentData.navigation.places}</a></li>
        <li><a href="#contact">${contentData.navigation.contact}</a></li>
    `;
    
    // Update about section
    document.getElementById('about-title').textContent = contentData.sections.about.title;
    document.getElementById('about-description').textContent = contentData.sections.about.description;
    const aboutImage = document.getElementById('about-image');
    aboutImage.src = contentData.sections.about.image;
    aboutImage.alt = contentData.siteInfo.name;
    
    // Update places section
    document.getElementById('places-title').textContent = contentData.sections.places.title;
    document.getElementById('places-description').textContent = contentData.sections.places.description;
    
    // Update contact section
    document.getElementById('contact-title').textContent = contentData.sections.contact.title;
    document.getElementById('contact-description').textContent = contentData.sections.contact.description;
    
    // Update social links
    const socialLinks = document.getElementById('social-links');
    socialLinks.innerHTML = contentData.socialMedia.map(social => `
        <a href="${social.url}" target="_blank" class="social-link ${social.name.toLowerCase()}">
            <i class="${social.icon} social-icon"></i>
            <span class="social-text">${social.name}</span>
        </a>
    `).join('');
    
    // Update footer
    document.getElementById('footer-copyright').textContent = contentData.footer.copyright;
}

function setupNavigation() {
    // Smooth scrolling for navigation links
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
}

function initializeWorldMap() {
    if (!contentData || !contentData.locations) return;
    
    // Initialize the map with satellite view
    const map = L.map('world-map').setView([25.2048, 55.2708], 2);
    
    // Add satellite tile layer (using Esri World Imagery which is free)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
    }).addTo(map);
    
    // Add markers for each location from content data
    contentData.locations.forEach((location, index) => {
        // Create simple marker
        const marker = L.marker([location.lat, location.lng])
            .addTo(map)
            .bindPopup(`<b>${location.name}</b><br><img src="${location.image}" width="200"><br>${location.story}`);
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
});
