// Load content (contentData is now loaded from content.js)
function loadContent() {
    if (contentData) {
        populateContent();
        initializeWorldMap();
        setupNavigation();
    } else {
        console.error('Content data not available');
        // Fallback content if data is not available
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
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Add active class to clicked link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
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
        
        // Update active navigation based on scroll position
        updateActiveNavigation();
        
        lastScroll = currentScroll;
    });
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function initializeWorldMap() {
    if (!contentData || !contentData.locations) return;
    
    // Initialize the map with a subtle, elegant style
    const map = L.map('world-map', {
        zoomControl: false,
        scrollWheelZoom: false
    }).setView([25.2048, 55.2708], 2);
    
    // Add zoom control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    
    // Add a more elegant tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Custom icon for markers
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
    
    // Add markers for each location
    contentData.locations.forEach((location, index) => {
        const marker = L.marker([location.lat, location.lng], { icon: customIcon })
            .addTo(map);
        
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
        
        // Add hover effect
        marker.on('mouseover', function() {
            this.openPopup();
        });
    });
    
    // Add subtle animation to map on load
    setTimeout(() => {
        map.flyTo([30, 0], 2.5, {
            duration: 2,
            easeLinearity: 0.5
        });
    }, 1000);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    initializeAnimations();
    addSubtleEffects();
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
            });
        });
        
        observer.observe(heading);
    });
    
    // Add custom cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #b76e79;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.5';
    });
    
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
    });
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#2c5f5d';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#b76e79';
        });
    });
}

// Add smooth page transitions
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
