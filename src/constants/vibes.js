// src/constants/vibes.js
// Centralized vibes configuration for the entire app

// Shared vibe images URLs
export const VIBE_IMAGES = {
  foodie: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
  culture: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
  nature: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
  urban: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=80",
  romantic: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=1000&q=80",
  nightlife: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80"
};

// Vibes configuration for ExplorePage (with API categories)
export const EXPLORE_VIBES = [
  { 
    value: "foodie", 
    label: "🍽️ Foodie", 
    categories: "catering.restaurant,catering.cafe,catering.fast_food,catering.bar,commercial.food_and_drink,commercial.supermarket"
  },
  { 
    value: "culture", 
    label: "🏛️ Culture", 
    categories: "entertainment.museum,entertainment.culture,tourism.sights,building.historic,heritage.unesco"
  },
  { 
    value: "nature", 
    label: "🏞️ Nature", 
    categories: "natural,leisure.park,national_park,beach,tourism.attraction.viewpoint"
  },
  { 
    value: "urban", 
    label: "🌆 Urban", 
    categories: "commercial.shopping_mall,commercial.marketplace,tourism.attraction,leisure.park"
  },
  { 
    value: "romantic", 
    label: "💑 Romantic", 
    categories: "catering.restaurant,leisure.park.garden,beach,tourism.attraction.viewpoint,leisure.spa"
  },
  { 
    value: "nightlife", 
    label: "🎉 Nightlife", 
    categories: "catering.bar,catering.pub,adult.nightclub,entertainment.cinema"
  }
];

// Vibes configuration for CreateTripPage (simple with descriptions)
export const CREATE_TRIP_VIBES = [
  { value: "foodie", label: "🍽️ Foodie", desc: "Culinary adventures" },
  { value: "culture", label: "🏛️ Culture", desc: "History & art" },
  { value: "nature", label: "🏞️ Nature", desc: "Outdoor scenic beauty" },
  { value: "urban", label: "🌆 Urban", desc: "City vibes & shopping" },
  { value: "romantic", label: "💑 Romantic", desc: "Couples getaways" },
  { value: "nightlife", label: "🎉 Nightlife", desc: "Parties & shows" }
];

// Detailed vibes configuration for VibesPage (with full descriptions)
export const DETAILED_VIBES = [
  {
    id: "foodie",
    title: "Foodie Vibe",
    emoji: "🍽️",
    short: "Restaurants, cafes, street food & markets.",
    details: "Perfect for travelers who love local flavors, cozy cafes, pubs and food markets. Experience the world through its cuisine.",
    image: VIBE_IMAGES.foodie
  },
  {
    id: "culture",
    title: "Culture Seeker",
    emoji: "🏛️",
    short: "Museums, art, history & national sites.",
    details: "Great for people who enjoy museums, galleries, historical sites, temples and cultural shows. Dive deep into heritage.",
    image: VIBE_IMAGES.culture
  },
  {
    id: "nature",
    title: "Nature Explorer",
    emoji: "🏞️",
    short: "Mountains, beaches, forests & national parks.",
    details: "Ideal for hiking, viewpoints, waterfalls, beaches and big green parks. Connect with the great outdoors.",
    image: VIBE_IMAGES.nature
  },
  {
    id: "urban",
    title: "Urban Adventure",
    emoji: "🌆",
    short: "Shopping, markets & city lifestyle.",
    details: "For travelers who love city vibes, shopping malls, old streets and lifestyle areas. Discover the city's hidden gems.",
    image: VIBE_IMAGES.urban
  },
  {
    id: "romantic",
    title: "Romantic Escape",
    emoji: "💑",
    short: "Sunsets, promenades & viewpoints.",
    details: "Perfect for couples looking for quiet beaches, gardens, promenades and sunset spots. Create unforgettable moments together.",
    image: VIBE_IMAGES.romantic
  },
  {
    id: "nightlife",
    title: "Nightlife & Fun",
    emoji: "🎉",
    short: "Bars, clubs, pubs & live music.",
    details: "For those who want bars, pubs, live music venues and fun night experiences. Experience the city after dark.",
    image: VIBE_IMAGES.nightlife
  }
];

