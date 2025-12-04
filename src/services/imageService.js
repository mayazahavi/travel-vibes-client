// src/services/imageService.js
// Service for fetching images from various sources (Wikipedia, Unsplash)

// Get API keys from environment variables
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

// Track used images to avoid duplicates across searches
const usedImages = new Set();

/**
 * Clear the used images cache
 * Call this when starting a new search to allow image reuse
 */
export const clearUsedImages = () => {
  usedImages.clear();
};

/**
 * Fetch image from Wikipedia for a place
 * @param {string} placeName - Name of the place
 * @param {string} city - City name
 * @returns {Promise<string|null>} - Image URL or null if not found
 */
export const fetchWikipediaImage = async (placeName, city) => {
  try {
    const searchQuery = `${placeName} ${city}`;
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=${encodeURIComponent(searchQuery)}&prop=pageimages&pithumbsize=800`
    );
    const data = await response.json();
    const pages = data.query?.pages;
    if (pages) {
      const page = Object.values(pages)[0];
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Fetch image from Unsplash
 * @param {string} query - Search query
 * @param {number} page - Page number for pagination
 * @returns {Promise<string|null>} - Image URL or null if not found
 */
export const fetchUnsplashImage = async (query, page = 1) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return null;
  } catch (error) {
    console.error("Unsplash error:", error);
    return null;
  }
};

/**
 * Smart image fetching with multiple strategies
 * Tries different approaches to find the best image for a place
 * 
 * @param {string} placeName - Name of the place
 * @param {string} category - Place category
 * @param {string} city - City name
 * @param {string} vibe - Selected vibe (foodie, culture, etc.)
 * @param {string} placeId - Unique place ID
 * @param {string} cuisine - Cuisine type (for restaurants)
 * @param {string} brand - Brand/chain name
 * @param {string} street - Street name
 * @returns {Promise<string>} - Image URL (never null, falls back to default)
 */
export const getPlaceImage = async (placeName, category, city, vibe, placeId, cuisine, brand, street) => {
  // Clean up place name
  const cleanName = placeName.toLowerCase().trim();
  const cleanCity = city.toLowerCase().trim();
  
  // Strategy 1: Try Wikipedia for famous landmarks
  const wikiImage = await fetchWikipediaImage(placeName, city);
  if (wikiImage && !usedImages.has(wikiImage)) {
    usedImages.add(wikiImage);
    return wikiImage;
  }
  
  // Strategy 2: Try Unsplash with specific place name + city (for known establishments)
  if (placeName.length > 3 && !placeName.includes('street') && !placeName.includes('road')) {
    let query = `${placeName} ${city}`;
    let image = await fetchUnsplashImage(query, 1);
    if (image && !usedImages.has(image)) {
      usedImages.add(image);
      return image;
    }
  }
  
  // Strategy 3: Use brand/chain name if available (e.g. McDonald's, Starbucks)
  if (brand) {
    let query = `${brand} ${category.split('.')[1] || 'restaurant'}`;
    const pageNum = (placeId.charCodeAt(0) % 3) + 1;
    let image = await fetchUnsplashImage(query, pageNum);
    if (image && !usedImages.has(image)) {
      usedImages.add(image);
      return image;
    }
  }
  
  // Strategy 4: Cuisine-specific for food places
  if (cuisine && vibe === 'foodie') {
    const cuisineTypes = cuisine.split(';')[0]; // Take first cuisine
    let query = `${cuisineTypes} food ${city}`;
    const pageNum = (placeId.charCodeAt(0) % 5) + 1;
    let image = await fetchUnsplashImage(query, pageNum);
    if (image && !usedImages.has(image)) {
      usedImages.add(image);
      return image;
    }
  }
  
  // Strategy 5: Category + vibe + city with variation
  const categorySimple = category.split('.')[1] || category.split('.')[0];
  const categoryKeywords = {
    'restaurant': 'restaurant interior',
    'cafe': 'cafe coffee',
    'bar': 'bar drinks',
    'pub': 'pub beer',
    'museum': 'museum art',
    'park': 'park nature',
    'shopping': 'shopping mall',
    'beach': 'beach coast'
  };
  
  const categoryWord = categoryKeywords[categorySimple] || categorySimple;
  const pageNum = Math.abs(placeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 10 + 1;
  
  let query = `${categoryWord} ${city}`;
  let image = await fetchUnsplashImage(query, pageNum);
  if (image && !usedImages.has(image)) {
    usedImages.add(image);
    return image;
  }
  
  // Strategy 6: Generic vibe + category (different page)
  const pageNum2 = Math.abs(placeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 7 + 5;
  query = `${vibe} ${categoryWord}`;
  image = await fetchUnsplashImage(query, pageNum2);
  if (image && !usedImages.has(image)) {
    usedImages.add(image);
    return image;
  }
  
  // Fallback: use a placeholder
  return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80`;
};

