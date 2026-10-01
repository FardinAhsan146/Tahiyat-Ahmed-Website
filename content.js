// Travel story shown on the map, in chronological order.
// flag: file name in flags/ (flag-icons, 4x3)
// iso:  ISO 3166-1 numeric code, used to shade the country on the map
// zoom: optional, how close the story slideshow flies in (default 4)
// view: optional [lat, lng] to aim the camera at instead of the place itself
// focus: "x,y" percentages of the photo to keep centred (her face) when it's cropped
// dream: true marks a place she hasn't been yet (no country shading, no trail)
const travelStory = [
  {
    "name": "Dhaka, Bangladesh",
    "lat": 23.8103,
    "lng": 90.4125,
    "flag": "bd",
    "iso": "050",
    "image": "country_photos/dhaka.webp",
    "focus": "50,59",
    "story": "Where it all began. I grew up here and despite how many countries I visit, Dhaka will still be my heart and my home."
  },
  {
    "name": "Abu Dhabi, UAE",
    "lat": 24.4539,
    "lng": 54.3773,
    "flag": "ae",
    "iso": "784",
    "image": "country_photos/uae.webp",
    "focus": "53,67",
    "story": "My first step outside of Dhaka. My home for now at NYUAD."
  },
  {
    "name": "Tbilisi, Georgia",
    "lat": 41.7151,
    "lng": 44.8271,
    "flag": "ge",
    "iso": "268",
    "image": "country_photos/georgia.webp",
    "focus": "50,46",
    "story": "My first international trip with friends! I might go back soon! 🌚"
  },
  {
    "name": "New Delhi, India",
    "lat": 28.6139,
    "lng": 77.2090,
    "flag": "in",
    "iso": "356",
    "image": "country_photos/india.webp",
    "focus": "49,25",
    "story": "I came here for a Debate! I visited IIT Delhi and the legendary Leopold Cafe in Mumbai"
  },
  {
    "name": "Valletta, Malta",
    "lat": 35.8989,
    "lng": 14.5146,
    "flag": "mt",
    "iso": "470",
    "zoom": 5,
    "image": "country_photos/malta.webp",
    "focus": "49,34",
    "story": "Yes, Malta is a country and I visited it. And you should too if you want a low-key mediterranean vacation with great seafood."
  },
  {
    "name": "Tokyo, Japan",
    "lat": 35.6762,
    "lng": 139.6503,
    "flag": "jp",
    "iso": "392",
    "image": "country_photos/japan.webp",
    "focus": "50,23",
    "story": "My time in Japan was surreal. I spent two weeks at a summer teaching program and it was one of the most transformative experiences of my life as I taught kids about Climate Change, lived with them 24/7 and helped them through their highs and lows. Nowhere else did I develop such a close bond with so many people in such a short amount of time."
  },
  {
    "name": "London, UK",
    "lat": 51.5072,
    "lng": -0.1276,
    "flag": "gb",
    "iso": "826",
    "zoom": 5,
    "image": "country_photos/london.webp",
    "focus": "50,53",
    "story": "I had my first study abroad experience at NYU London. My first view into \"The West\". I fell in love with the historic architecture, and posh London vibes. (I like it more than NYC)"
  },
  {
    "name": "Cardiff, Wales",
    "lat": 51.4816,
    "lng": -3.1791,
    "flag": "gb-wls",
    "iso": "826",
    "zoom": 5,
    "image": "country_photos/wales.webp",
    "focus": "48,57",
    "story": "Studying abroad in London meant I can just take a weekend trip to Wales. Oh and I wore a saree in the streets of Cardiff!"
  },
  {
    "name": "Edinburgh, Scotland",
    "lat": 55.9533,
    "lng": -3.1883,
    "flag": "gb-sct",
    "iso": "826",
    "zoom": 5,
    "image": "country_photos/scotland.webp",
    "focus": "47,68",
    "story": "It's beautiful. Dark and gloomy, but beautiful."
  },
  {
    "name": "Podgorica, Montenegro",
    "lat": 42.4304,
    "lng": 19.2594,
    "flag": "me",
    "iso": "499",
    "zoom": 6,
    "image": "country_photos/montenegro.webp",
    "focus": "46,52",
    "story": "Montenegro is also a country and I visited it. Can you believe it? I visited Montenegro!"
  },
  {
    "name": "Tirana, Albania",
    "lat": 41.3275,
    "lng": 19.8187,
    "flag": "al",
    "iso": "008",
    "zoom": 6,
    "image": "country_photos/albania.webp",
    "focus": "47,44",
    "story": "One of the most underrated countries in Europe. The Blue Eye Springs is one of the most beautiful places I've been."
  },
  {
    "name": "Doha, Qatar",
    "lat": 25.2854,
    "lng": 51.5310,
    "flag": "qa",
    "iso": "634",
    "zoom": 5,
    "image": "country_photos/qatar.webp",
    "focus": "49,51",
    "story": "I came here for a Debate at Georgetown Qatar."
  },
  {
    "name": "New York City, USA",
    "lat": 40.7128,
    "lng": -74.0060,
    "flag": "us",
    "iso": "840",
    "image": "country_photos/america.webp",
    "focus": "48,60",
    "story": "I've dreamt of doing a study-abroad at NYU and living that NYC girly life since my first day at NYUAD. That life was everything I imagined and more, I can't wait to go back."
  },
  {
    "name": "Colombo, Sri Lanka",
    "lat": 6.9271,
    "lng": 79.8612,
    "flag": "lk",
    "iso": "144",
    "image": "country_photos/sri-lanka.webp",
    "focus": "62,40",
    "story": "The nicest people I ever met! Oh I also saw pristine beaches and lizards and elephants and deer and crocodiles! Oh and it's a veryyy affordable last minute vacation spot incase you were wondering."
  },
  {
    "name": "Antarctica",
    "lat": -75.0,
    "lng": 40.0,
    "flag": "aq",
    "zoom": 2,
    "view": [-58, 45],
    "dream": true,
    "image": "country_photos/antarctica.webp",
    "story": "MY ULTIMATE DREAM DESTINATION"
  }
];
