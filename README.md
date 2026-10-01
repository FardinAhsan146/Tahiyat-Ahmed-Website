# Syeda Tahiyat Ahmed - Personal Website

Personal website for Syeda Tahiyat Ahmed, live at https://syedatahiyatahmed.com/. Plain HTML, CSS and JavaScript with no build step.

## Structure

- `index.html` - All page text, photos, projects and social links
- `content.js` - The travel story shown on the map, in chronological order
- `script.js` - Animations, the story slideshow and the map
- `styles.css` - Styling and responsive design
- `photos/`, `country_photos/` - WebP images, resized for the web
- `flags/` - Flag SVGs from [flag-icons](https://github.com/lipis/flag-icons) (MIT)
- `vendor/leaflet/` - [Leaflet](https://leafletjs.com/) 1.9.4 (BSD-2), self-hosted
- `assets/world.json` - Simplified country shapes from [Natural Earth](https://www.naturalearthdata.com/) (public domain), via [world-atlas](https://github.com/topojson/world-atlas)

## Editing

- **Text, photos, projects:** edit `index.html` directly.
- **A new trip:** add an entry to `content.js` in the right position. Give it a flag (file name in `flags/`, copied from flag-icons' `flags/4x3/`), the country's [ISO numeric code](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) as `iso` (this shades the country), and a photo in `country_photos/`.
- **New photos:** convert to WebP and keep them small (about 600px wide for the About photos, 440px for country photos), e.g. `cwebp -q 80 -resize 600 0 in.jpg -o out.webp`.

The map has no API keys or tile servers. Leaflet draws `assets/world.json` itself. The map loads in the background once the rest of the page has finished loading.

## Running locally

```
python3 -m http.server
```

Then open http://localhost:8000.
