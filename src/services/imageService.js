// src/services/imageService.js
// Service for fetching images from various sources (Wikipedia, Unsplash)

// Get API keys from environment variables
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

// Track used images to avoid duplicates across searches
const usedImages = new Set();
let placeCounter = 0; // Counter for each place to ensure variety

/**
 * Clear the used images cache
 * Call this when starting a new search to allow image reuse
 */
export const clearUsedImages = () => {
  usedImages.clear();
  placeCounter = 0;
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
  // Increment counter for each place
  placeCounter++;
  
  // Clean up place name
  const cleanName = placeName.toLowerCase().trim();
  const cleanCity = city.toLowerCase().trim();
  
  // Strategy 1: Try Wikipedia for famous landmarks (free!)
  const wikiImage = await fetchWikipediaImage(placeName, city);
  if (wikiImage) {
    return wikiImage;
  }
  
  // Strategy 2: Smart category-based search (ONE Unsplash call per place)
  // Parse category to extract relevant keywords
  let categoryKeywords = '';
  if (category && category.includes('.')) {
    const parts = category.split('.');
    const relevantParts = parts.slice(1).filter(p => p && p.length > 0);
    
    if (relevantParts.length > 0) {
      categoryKeywords = relevantParts.reverse().join(' ').replace(/_/g, ' ');
    } else {
      categoryKeywords = parts[0];
    }
  } else {
    categoryKeywords = category || 'place';
  }
  
  // Add variety words for diversity
  const varietyWords = ['beautiful', 'amazing', 'great', 'best', 'stunning', 'popular', 'top', 'favorite', 'lovely', 'perfect'];
  const varietyWord = varietyWords[placeCounter % varietyWords.length];
  
  // Use full placeId for better hash distribution
  const placeHash = Math.abs(placeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const pageNum = (placeHash + placeCounter) % 15 + 1;
  
  // ONE strategic Unsplash call with all relevant info
  let query = `${varietyWord} ${categoryKeywords} ${vibe} ${city}`;
  let image = await fetchUnsplashImage(query, pageNum);
  if (image) {
    return image;
  }
  
  // Final Fallback: Vibe-specific placeholders (different for each vibe!)
  const vibeFallbacks = {
    'foodie': `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80`,
    'culture': `https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80`,
    'nature': `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80`,
    'romantic': `https://images.unsplash.com/photo-1515516969-d465f0f4d1c5?auto=format&fit=crop&w=800&q=80`,
    'urban': `https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80`,
    'nightlife': `https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80`
  };
  
  return vibeFallbacks[vibe] || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80`;
};
