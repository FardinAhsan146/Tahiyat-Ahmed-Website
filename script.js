const LEAFLET_CSS = 'vendor/leaflet/leaflet.css';
const LEAFLET_JS = 'vendor/leaflet/leaflet.js';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    setupHeader();
    setupFadeIns();
    createFloatingHearts();
    if (typeof travelStory !== 'undefined') {
        const story = createStory(travelStory);
        preloadMap(story);
    }
});

function setupHeader() {
    const header = document.querySelector('header');
    let scrolled = false;
    window.addEventListener('scroll', () => {
        const next = window.scrollY > 50;
        if (next !== scrolled) {
            scrolled = next;
            header.classList.toggle('scrolled', scrolled);
        }
    }, { passive: true });
}

function setupFadeIns() {
    const targets = document.querySelectorAll('section h2, .about-section, .projects-grid, .map-layout, .social-links, .bakery-section');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function createFloatingHearts() {
    if (reducedMotion) return;
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'floating-hearts';
    heartsContainer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '♥';
        heartsContainer.appendChild(heart);
    }
    document.body.appendChild(heartsContainer);
}

/* ---------- Travel story (slideshow, timeline, card) ----------
   Modes:
   overview - the whole map, every country shaded, the full journey drawn faintly
   browse   - a flag was picked directly: show that place, keep the whole map as is
   story    - playing / stepping in order: the trail and shading grow stop by stop
   finale   - the end of the story: zoom out to the whole journey and offer a replay */

function createStory(places) {
    const section = document.getElementById('places');
    const layout = section.querySelector('.map-layout');
    const card = document.getElementById('story-card');
    const timeline = document.getElementById('story-timeline');
    const caption = document.getElementById('map-caption');
    const progress = document.getElementById('story-progress');
    const playBtn = document.getElementById('story-play');
    const playIcon = playBtn.querySelector('.story-play-icon');
    const playLabel = playBtn.querySelector('.story-play-label');

    const FINALE = places.length;
    const realStops = places.filter(p => !p.dream).length;
    const introHTML = card.innerHTML;
    card.innerHTML = `<div class="story-page">${introHTML}</div>`;
    const state = { mode: 'overview', current: -1, playing: false, timer: null };
    let mapView = null;

    timeline.innerHTML = places.map((p, i) => `
        <li>
            <button type="button" class="timeline-stop${p.dream ? ' is-dream' : ''}" data-index="${i}" title="${p.name}" aria-label="${p.dream ? 'Someday' : 'Stop ' + (i + 1)}: ${p.name}">
                <img src="flags/${p.flag}.svg" alt="" width="28" height="21" loading="lazy" />
            </button>
        </li>
    `).join('');

    timeline.addEventListener('click', (e) => {
        const btn = e.target.closest('.timeline-stop');
        if (btn) pick(Number(btn.dataset.index));
    });
    document.getElementById('story-prev').addEventListener('click', prev);
    document.getElementById('story-next').addEventListener('click', next);
    playBtn.addEventListener('click', () => (state.playing ? pause() : play()));
    caption.addEventListener('click', () => card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' }));
    card.addEventListener('click', (e) => {
        if (e.target.closest('[data-action="overview"]')) overview();
        if (e.target.closest('[data-action="replay"]')) play();
    });

    layout.addEventListener('keydown', (e) => {
        if (e.target.closest('input, textarea')) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        else if (e.key === 'Escape') overview();
        else if ((e.key === ' ' || e.key === 'k') && !e.target.closest('button, a')) {
            e.preventDefault();
            state.playing ? pause() : play();
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && state.playing) pause();
    });

    /* Rendering */

    function stepLabel(i) {
        return places[i].dream ? 'Someday…' : `Stop ${i + 1} of ${realStops}`;
    }

    function placeHTML(i) {
        const p = places[i];
        return `
            <div class="story-card-photo">
                <img src="${p.image}" alt="${p.name}" decoding="async" data-focus="${p.focus || '50,50'}" />
                <button type="button" class="story-close" data-action="overview" aria-label="Back to the whole map">&times;</button>
            </div>
            <div class="story-card-body">
                <span class="story-step">${stepLabel(i)}</span>
                <h3><img class="story-card-flag" src="flags/${p.flag}.svg" alt="" width="24" height="18" />${p.name}</h3>
                <p>${p.story}</p>
            </div>
        `;
    }

    function finaleHTML() {
        return `
            <div class="story-card-intro story-card-finale">
                <span class="story-step">The story so far</span>
                <h3>To be continued&hellip;</h3>
                <p>Know somewhere I should go next? <a href="#say-hi">Say hi</a> and tell me.</p>
                <dl class="story-stats">
                    <div><dt>12</dt><dd>countries</dd></div>
                    <div><dt>3</dt><dd>continents</dd></div>
                    <div><dt>1</dt><dd>dream destination</dd></div>
                </dl>
                <button type="button" class="story-replay" data-action="replay"><span aria-hidden="true">↺</span> Replay my story</button>
            </div>
        `;
    }

    function renderCard(i, direction) {
        const html = i < 0 ? introHTML : i === FINALE ? finaleHTML() : placeHTML(i);
        const page = document.createElement('div');
        page.className = 'story-page';
        page.innerHTML = html;

        card.querySelectorAll(':scope > .story-page:not(.is-leaving)').forEach(el => {
            if (reducedMotion) {
                el.remove();
                return;
            }
            el.classList.add('is-leaving', direction < 0 ? 'to-right' : 'to-left');
            el.setAttribute('aria-hidden', 'true');
            el.addEventListener('animationend', () => el.remove(), { once: true });
            setTimeout(() => el.remove(), 700);
        });
        if (!reducedMotion) page.classList.add('is-entering', direction < 0 ? 'from-left' : 'from-right');
        card.appendChild(page);

        const img = page.querySelector('.story-card-photo img');
        if (img) focusPhoto(img);
        warmPhotos(i);
    }

    function warmPhotos(i) {
        for (let k = 1; k <= 2; k++) {
            const p = places[i + k];
            if (p) new Image().src = p.image;
        }
    }

    function updateChrome() {
        section.dataset.storyMode = state.mode;
        timeline.querySelectorAll('.timeline-stop').forEach((btn, j) => {
            btn.classList.toggle('is-active', j === state.current);
            btn.classList.toggle('is-past', state.mode === 'finale' || j < state.current);
            if (j === state.current) btn.setAttribute('aria-current', 'step');
            else btn.removeAttribute('aria-current');
        });
        const active = timeline.querySelector('.is-active');
        if (active) {
            const li = active.parentElement;
            timeline.scrollTo({
                left: li.offsetLeft - timeline.clientWidth / 2 + li.clientWidth / 2,
                behavior: reducedMotion ? 'auto' : 'smooth'
            });
        }

        const p = places[state.current];
        caption.hidden = !p;
        if (p) {
            caption.innerHTML = `<img src="flags/${p.flag}.svg" alt="" width="20" height="15" /><span><strong>${p.name}</strong> · ${p.dream ? 'someday' : (state.current + 1) + '/' + realStops}</span>`;
        }

        const atEnd = state.mode === 'finale';
        playIcon.textContent = state.playing ? '❚❚' : atEnd ? '↺' : '▶';
        playLabel.textContent = state.playing ? 'Pause'
            : atEnd ? 'Replay my story'
            : state.mode === 'story' ? 'Keep going'
            : 'Play my story';
        playBtn.classList.toggle('is-playing', state.playing);
        playBtn.setAttribute('aria-pressed', String(state.playing));
    }

    function startProgress(ms) {
        progress.classList.remove('is-running');
        progress.style.setProperty('--dur', ms + 'ms');
        void progress.offsetWidth; // restart the CSS animation
        progress.classList.add('is-running');
    }

    function stopProgress() {
        progress.classList.remove('is-running');
    }

    /* State changes */

    function show(i, mode) {
        const from = { index: state.current, mode: state.mode };
        const direction = i >= state.current || from.mode === 'finale' ? 1 : -1;
        state.mode = mode;
        state.current = i;
        renderCard(i, direction);
        updateChrome();
        return mapView ? mapView.show(state, from) : 0;
    }

    function dwellFor(p) {
        return Math.min(12000, Math.max(5000, 3200 + p.story.length * 26));
    }

    function step(i) {
        clearTimeout(state.timer);
        if (i >= FINALE) {
            state.playing = false;
            stopProgress();
            show(FINALE, 'finale');
            return;
        }
        const flightMs = show(i, 'story');
        if (state.playing) schedule(flightMs + dwellFor(places[i]));
    }

    function schedule(ms) {
        clearTimeout(state.timer);
        startProgress(ms);
        state.timer = setTimeout(() => step(state.current + 1), ms);
    }

    function play() {
        state.playing = true;
        if (state.mode !== 'story') {
            step(0);
            return;
        }
        // Paused mid-story: stay a moment on this stop, then move on
        updateChrome();
        schedule(dwellFor(places[state.current]));
    }

    function pause() {
        state.playing = false;
        clearTimeout(state.timer);
        stopProgress();
        updateChrome();
    }

    function next() {
        if (state.mode === 'finale') return;
        step(state.mode === 'overview' ? 0 : state.current + 1);
    }

    function prev() {
        if (state.mode === 'overview') return;
        const target = state.mode === 'finale' ? FINALE - 1 : Math.max(state.current - 1, 0);
        if (target === state.current && state.mode === 'story') return;
        step(target);
    }

    function pick(i) {
        pause();
        if (state.current === i && state.mode === 'browse') return;
        show(i, 'browse');
    }

    function overview() {
        pause();
        if (state.mode === 'overview') return;
        show(-1, 'overview');
        updateChrome();
    }

    // Keep photo crops centred on her face as the card resizes
    if ('ResizeObserver' in window) {
        new ResizeObserver(() => card.querySelectorAll('.story-card-photo img').forEach(focusPhoto)).observe(card);
    }

    updateChrome();

    return {
        places,
        state,
        pick,
        attachMap(view) {
            mapView = view;
            view.show(state, { index: -1, mode: 'overview' }, { instant: true });
        }
    };
}

// object-fit: cover crops the photo; place the crop so the focal point sits in the middle
function focusPhoto(img) {
    const apply = () => {
        const box = img.parentElement.getBoundingClientRect();
        const iw = img.naturalWidth, ih = img.naturalHeight;
        if (!iw || !box.width) return;
        const [fx, fy] = img.dataset.focus.split(',').map(v => Number(v) / 100);
        const scale = Math.max(box.width / iw, box.height / ih);
        const pos = (focal, imageSize, boxSize) => {
            const overflow = imageSize * scale - boxSize;
            if (overflow <= 0) return 50;
            const offset = Math.min(Math.max(focal * imageSize * scale - boxSize / 2, 0), overflow);
            return (offset / overflow) * 100;
        };
        img.style.objectPosition = `${pos(fx, iw, box.width).toFixed(1)}% ${pos(fy, ih, box.height).toFixed(1)}%`;
    };
    if (img.complete) apply();
    else img.addEventListener('load', apply, { once: true });
}

/* ---------- Map ---------- */

// Fetch the map quietly once the page has settled, or sooner if she scrolls towards it
function preloadMap(story) {
    let started = false;
    const start = () => {
        if (started) return;
        started = true;
        loadMap(story).catch(err => console.error('Map failed to load', err));
    };
    const whenIdle = () => (window.requestIdleCallback || ((cb) => setTimeout(cb, 1200)))(start, { timeout: 3000 });
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (entries.some(e => e.isIntersecting)) {
                observer.disconnect();
                start();
            }
        }, { rootMargin: '900px 0px' });
        observer.observe(document.getElementById('places'));
    }
}

function loadStylesheet(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function loadMap(story) {
    const [, , world] = await Promise.all([
        loadStylesheet(LEAFLET_CSS),
        loadScript(LEAFLET_JS),
        fetch('assets/world.json').then(r => r.json())
    ]);
    story.attachMap(createMapView(story, world));
}

const COLORS = {
    land: '#f4ece1',
    visited: '#e5b3ba',
    current: '#c97f8a',
    border: '#ffffff',
    trail: '#b76e79'
};

function createMapView(story, world) {
    const places = story.places;
    const realPlaces = places.filter(p => !p.dream);
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const container = document.getElementById('world-map');

    // One canvas for land and trails, repainted on every frame of a flight (see below)
    const renderer = L.canvas({ padding: 0.3 });

    const map = L.map(container, {
        renderer,
        zoomSnap: 0.25,
        minZoom: 0.5,
        maxZoom: 6.5,
        scrollWheelZoom: false,
        // On phones one finger scrolls the page, two fingers move the map
        dragging: !isTouch,
        tap: false,
        keyboard: false,
        maxBounds: [[-84, -220], [84, 220]],
        maxBoundsViscosity: 1,
        attributionControl: false
    });
    L.control.attribution({ prefix: false })
        .addAttribution('<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>')
        .addTo(map);

    // Vector layers need the map to have a view before they are added
    const overviewBounds = L.latLngBounds(realPlaces.map(p => [p.lat, p.lng]));
    const overviewPadding = () => (container.clientWidth < 500 ? [24, 24] : [40, 40]);
    map.fitBounds(overviewBounds, { padding: overviewPadding() });

    // Leaflet only redraws the canvas when a move ends, so mid-flight the land would
    // shrink into a small rectangle. Repaint at the current zoom on every animation frame.
    let flying = false;
    let repaintQueued = false;
    const repaint = () => {
        if (repaintQueued) return;
        repaintQueued = true;
        requestAnimationFrame(() => {
            repaintQueued = false;
            if (!map._animatingZoom) renderer._reset();
        });
    };
    map.on('zoom', repaint);
    map.on('move', () => { if (flying) repaint(); });
    map.on('moveend', () => { flying = false; });

    let visited = new Set(realPlaces.map(p => p.iso));
    let currentIso = null;
    const countries = L.geoJSON(world, {
        interactive: false,
        style: (f) => countryStyle(f.id)
    }).addTo(map);

    function countryStyle(id) {
        return {
            fillColor: id === currentIso ? COLORS.current : visited.has(id) ? COLORS.visited : COLORS.land,
            fillOpacity: 1,
            color: COLORS.border,
            weight: 0.7
        };
    }

    // Curved flight paths between consecutive stops
    const arcs = places.slice(1).map((p, k) => arcBetween(places[k], p));
    const realArcs = arcs.filter((_, k) => !places[k + 1].dream);
    const dreamArcIndex = places.findIndex(p => p.dream) - 1;

    const journey = L.polyline(realArcs, {
        color: COLORS.trail, weight: 1.5, opacity: 0.35, dashArray: '2 6', lineCap: 'round', interactive: false
    }).addTo(map);
    const trail = L.polyline([], {
        color: COLORS.trail, weight: 2.25, opacity: 0.9, dashArray: '7 7', lineCap: 'round', interactive: false
    }).addTo(map);
    const dream = L.polyline([], {
        color: COLORS.trail, weight: 2, opacity: 0.55, dashArray: '1 7', lineCap: 'round', interactive: false
    }).addTo(map);
    const live = L.polyline([], {
        color: COLORS.trail, weight: 2.25, opacity: 0.9, dashArray: '7 7', lineCap: 'round', interactive: false
    }).addTo(map);
    const head = L.circleMarker([0, 0], {
        radius: 4.5, color: '#ffffff', weight: 2, fillColor: COLORS.trail, fillOpacity: 1, opacity: 0, interactive: false
    }).addTo(map);
    head.setStyle({ fillOpacity: 0 });

    const markers = places.map((p, i) => {
        const marker = L.marker([p.lat, p.lng], {
            icon: L.divIcon({
                className: 'flag-marker',
                html: `<div class="flag-container" style="background-image:url('flags/${p.flag}.svg')"></div>`,
                iconSize: [40, 30],
                iconAnchor: [20, 15]
            }),
            title: p.name,
            alt: p.name,
            riseOnHover: true
        }).addTo(map);
        marker.on('click', () => story.pick(i));
        return marker;
    });

    // Nudge flags apart where they would overlap at the current zoom (UK, Balkans, Gulf)
    function declutter() {
        const W = 38, H = 29;
        const pts = places.map(p => map.latLngToContainerPoint([p.lat, p.lng]));
        const nudge = places.map(() => ({ x: 0, y: 0 }));
        for (let iter = 0; iter < 40; iter++) {
            let moved = false;
            for (let a = 0; a < pts.length; a++) {
                for (let b = a + 1; b < pts.length; b++) {
                    const dx = (pts[b].x + nudge[b].x) - (pts[a].x + nudge[a].x);
                    const dy = (pts[b].y + nudge[b].y) - (pts[a].y + nudge[a].y);
                    const ox = W - Math.abs(dx), oy = H - Math.abs(dy);
                    if (ox <= 0 || oy <= 0) continue;
                    moved = true;
                    // Push apart along the axis that needs the least movement
                    if (ox / W < oy / H) {
                        const s = (dx === 0 ? (a % 2 ? 1 : -1) : Math.sign(dx)) * ox / 2;
                        nudge[a].x -= s; nudge[b].x += s;
                    } else {
                        const s = (dy === 0 ? 1 : Math.sign(dy)) * oy / 2;
                        nudge[a].y -= s; nudge[b].y += s;
                    }
                }
            }
            if (!moved) break;
        }
        markers.forEach((m, i) => {
            const flag = m.getElement() && m.getElement().firstElementChild;
            if (flag) flag.style.translate = `${nudge[i].x.toFixed(1)}px ${nudge[i].y.toFixed(1)}px`;
        });
    }
    map.on('zoomend', declutter);
    declutter();

    if ('ResizeObserver' in window) {
        let lastWidth = container.clientWidth;
        new ResizeObserver(() => {
            if (container.clientWidth === lastWidth) return;
            lastWidth = container.clientWidth;
            map.invalidateSize();
            declutter();
        }).observe(container);
    }

    /* Drawing the journey */

    let segmentFrame = null;

    function stopSegment() {
        cancelAnimationFrame(segmentFrame);
        live.setLatLngs([]);
        head.setStyle({ opacity: 0, fillOpacity: 0 });
    }

    function drawSegment(points, layer, base, ms) {
        stopSegment();
        const start = performance.now();
        head.setStyle({ opacity: 1, fillOpacity: 1 });
        const frame = (now) => {
            const t = Math.min(1, (now - start) / ms);
            const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const n = Math.max(2, Math.round(eased * (points.length - 1)) + 1);
            const partial = points.slice(0, n);
            if (layer === live) live.setLatLngs(partial);
            else layer.setLatLngs(base.concat([partial]));
            head.setLatLng(partial[partial.length - 1]);
            if (t < 1) {
                segmentFrame = requestAnimationFrame(frame);
            } else {
                if (layer === live) {
                    live.setLatLngs([]);
                    trail.setLatLngs(base.concat([points]));
                }
                head.setStyle({ opacity: 0, fillOpacity: 0 });
            }
        };
        segmentFrame = requestAnimationFrame(frame);
    }

    function setMarkerClasses(mode, i) {
        markers.forEach((m, j) => {
            const el = m.getElement();
            if (!el) return;
            el.classList.toggle('is-active', j === i);
            el.classList.toggle('is-upcoming', mode === 'story' && j > i);
            m.setZIndexOffset(j === i ? 1000 : 0);
        });
    }

    function flightMs(target, zoom) {
        if (reducedMotion) return 0;
        const km = map.distance(map.getCenter(), target) / 1000;
        const zoomChange = Math.abs(map.getZoom() - zoom);
        return Math.round(Math.min(3400, 900 + Math.sqrt(km) * 24 + zoomChange * 120));
    }

    function show(state, from, opts = {}) {
        const { mode, current: i } = state;
        const instant = opts.instant || reducedMotion;
        const place = places[i];
        stopSegment();

        // Shading
        if (mode === 'story') {
            visited = new Set(places.slice(0, i + 1).filter(p => !p.dream).map(p => p.iso));
        } else {
            visited = new Set(realPlaces.map(p => p.iso));
        }
        currentIso = place && !place.dream ? place.iso : null;
        countries.setStyle(f => countryStyle(f.id));

        setMarkerClasses(mode, i);

        // Camera
        let ms = 0;
        if (mode === 'overview' || mode === 'finale') {
            const bounds = mode === 'finale'
                ? overviewBounds.pad(0.05)
                : overviewBounds;
            if (instant) map.fitBounds(bounds, { padding: overviewPadding(), animate: false });
            else {
                const target = map._getBoundsCenterZoom(bounds, { padding: overviewPadding() });
                ms = flightMs(target.center, target.zoom);
                flying = true;
                map.flyToBounds(bounds, { padding: overviewPadding(), duration: ms / 1000 });
            }
        } else {
            const target = L.latLng(place.view || [place.lat, place.lng]);
            const zoom = place.zoom || 4;
            if (instant) map.setView(target, zoom, { animate: false });
            else {
                ms = flightMs(target, zoom);
                flying = true;
                map.flyTo(target, zoom, { duration: ms / 1000 });
            }
        }

        // Trails
        const storyArcs = (n) => arcs.slice(0, n).filter((_, k) => k !== dreamArcIndex);
        journey.setStyle({ opacity: mode === 'overview' || mode === 'browse' ? 0.35 : 0 });
        if (mode === 'overview' || mode === 'browse') {
            trail.setLatLngs([]);
            dream.setLatLngs([]);
        } else if (mode === 'finale') {
            trail.setLatLngs(realArcs);
            dream.setLatLngs(dreamArcIndex >= 0 ? [arcs[dreamArcIndex]] : []);
        } else {
            const steppedForward = i === from.index + 1 && from.mode !== 'finale';
            const reachedDream = place.dream;
            const done = storyArcs(reachedDream ? i - 1 : i);
            if (steppedForward && i > 0 && !instant) {
                const segment = arcs[i - 1];
                trail.setLatLngs(reachedDream ? done : storyArcs(i - 1));
                dream.setLatLngs([]);
                // The flight path draws itself while the camera flies
                drawSegment(segment, reachedDream ? dream : live, reachedDream ? [] : storyArcs(i - 1), Math.max(ms, 900));
            } else {
                trail.setLatLngs(done);
                dream.setLatLngs(reachedDream && dreamArcIndex >= 0 ? [arcs[dreamArcIndex]] : []);
            }
        }

        if (instant) {
            flying = false;
            setTimeout(declutter, 0);
        }
        return ms;
    }

    // The map may have been sized while hidden by the fade-in
    setTimeout(() => map.invalidateSize(), 300);

    return { show };
}

// A gentle arc between two places, bowed northwards, drawn in the map's projection
function arcBetween(a, b, samples = 48) {
    const proj = L.Projection.SphericalMercator;
    const p0 = proj.project(L.latLng(a.lat, a.lng));
    const p1 = proj.project(L.latLng(b.lat, b.lng));
    const dx = p1.x - p0.x, dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy) || 1;
    let nx = -dy / len, ny = dx / len;
    if (ny < 0 || (ny === 0 && nx < 0)) { nx = -nx; ny = -ny; }
    const bulge = len * 0.18;
    const c = L.point((p0.x + p1.x) / 2 + nx * bulge, (p0.y + p1.y) / 2 + ny * bulge);
    const pts = [];
    for (let s = 0; s <= samples; s++) {
        const t = s / samples, u = 1 - t;
        pts.push(proj.unproject(L.point(
            u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
            u * u * p0.y + 2 * u * t * c.y + t * t * p1.y
        )));
    }
    return pts;
}
