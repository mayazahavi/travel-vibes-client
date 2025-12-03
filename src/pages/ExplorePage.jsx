// src/pages/ExplorePage.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { FaHeart, FaRegHeart, FaSearch, FaMapMarkerAlt, FaPlane, FaPhone, FaGlobe, FaClock, FaStar, FaWalking } from "react-icons/fa";
import styles from "../styles/ExplorePage.module.css";

// --- Configuration & Helpers ---
const GEOAPIFY_API_KEY = "e2c1b7b6fba342c68d7bac595f2c5be2";
const UNSPLASH_ACCESS_KEY = "-8mpF3mmvi04NNzqPBmUdPzyxIEl9hevQwT4qPBcVnM";

const vibes = [
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

// Helper to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Track used images to avoid duplicates
const usedImages = new Set();

// Helper to fetch image from Wikipedia
const fetchWikipediaImage = async (placeName, city) => {
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

// Helper to fetch image from Unsplash
const fetchUnsplashImage = async (query, page = 1) => {
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

// Smart image fetching with multiple strategies
const getPlaceImage = async (placeName, category, city, vibe, placeId, cuisine, brand, street, usedImages) => {
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

function ExplorePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialVibe = searchParams.get('vibe');

  const [selectedVibe, setSelectedVibe] = useState(
    vibes.find(v => v.value === initialVibe) || null
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searched, setSearched] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const loadCityOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 3) {
      return [];
    }
    
    setApiError(false);
    
    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(inputValue)}&type=city&limit=10&apiKey=${GEOAPIFY_API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        setApiError(true);
        return [];
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        return [];
      }

      const uniqueCities = new Map();
      
      data.features.forEach(feature => {
        const props = feature.properties;
        const cityName = props.city || props.name;
        const countryName = props.country;
        
        if (!cityName || !countryName) return;
        
        const label = `${cityName}, ${countryName}`;
        const key = label.toLowerCase();
        
        if (!uniqueCities.has(key)) {
          uniqueCities.set(key, {
            value: {
              lat: props.lat,
              lon: props.lon,
              city: cityName,
              country: countryName
            },
            label: label
          });
        }
      });

      return Array.from(uniqueCities.values()).slice(0, 8);
      
    } catch (error) {
      console.error("Error loading cities:", error);
      setApiError(true);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!selectedVibe || !selectedLocation) return;

    setLoading(true);
    setSearched(true);
    setPlaces([]);
    usedImages.clear(); // Reset used images for new search

    try {
      const { lat, lon, city } = selectedLocation.value;
      const categories = selectedVibe.categories;
      
      // Build the URL with proper encoding
      const url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(categories)}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
      
      console.log("Searching places with URL:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Places API error:", response.status, errorText);
        throw new Error("Failed to fetch places");
      }
      
      const data = await response.json();
      console.log("Places found:", data.features?.length || 0);

      // Fetch places with images sequentially to track duplicates
      const formattedPlaces = [];
      
      for (const feature of data.features) {
        const props = feature.properties;
        const distance = calculateDistance(lat, lon, props.lat, props.lon);
        const placeName = props.name || props.street || "Unknown Place";
        
        // Extract additional info for better image search
        const cuisine = props.cuisine ? Object.keys(props.cuisine).join(';') : '';
        const brand = props.brand || props.datasource?.raw?.brand || '';
        const street = props.street || '';
        
        const imageUrl = await getPlaceImage(
          placeName,
          props.categories ? props.categories[0] : "place",
          city,
          selectedVibe.value,
          props.place_id,
          cuisine,
          brand,
          street,
          usedImages
        );
        
        formattedPlaces.push({
          id: props.place_id,
          name: placeName,
          address: props.address_line2 || props.formatted || props.address_line1,
          category: props.categories ? props.categories[0] : "place",
          image: imageUrl,
          phone: props.contact?.phone || props.datasource?.raw?.phone,
          website: props.contact?.website || props.datasource?.raw?.website,
          openingHours: props.opening_hours,
          rating: props.datasource?.raw?.rating,
          description: props.datasource?.raw?.description,
          distance: distance,
          lat: props.lat,
          lon: props.lon
        });
      }

      setPlaces(formattedPlaces);
    } catch (error) {
      console.error("Error fetching places:", error);
      alert("Failed to load places. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (place) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === place.id)) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const handleCreateTrip = () => {
    setShowSuccessModal(true);
    // Auto close after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      // Later: navigate(`/create-trip?vibe=${selectedVibe?.value}`);
    }, 3000);
  };

  return (
    <div className={styles.explorePage}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>DISCOVER YOUR DESTINATION</span>
        <h1 className={styles.title}>Explore Destinations</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.subtitle}>Discover hidden gems tailored to your vibe</p>
        
        {apiError && (
          <div style={{color: '#ef4444', fontSize: '14px', marginBottom: '10px'}}>
            ⚠️ API connection issue. Please try again.
          </div>
        )}
        
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <div className={styles.filterGroup}>
              <label className={styles.label}>Your Vibe</label>
              <Select
                value={selectedVibe}
                onChange={setSelectedVibe}
                options={vibes}
                placeholder="Select Vibe..."
                className={styles.reactSelect}
                classNamePrefix="select"
              />
            </div>
            
            <div className={styles.divider}></div>

            <div className={styles.filterGroup}>
              <label className={styles.label}>Where to?</label>
              <AsyncSelect
                loadOptions={loadCityOptions}
                onChange={setSelectedLocation}
                value={selectedLocation}
                placeholder="Type at least 3 letters (e.g. Paris, Tokyo)..."
                className={styles.reactSelect}
                classNamePrefix="select"
                noOptionsMessage={({ inputValue }) => 
                  !inputValue ? "Start typing to search cities..." : 
                  inputValue.length < 3 ? "Type at least 3 characters..." :
                  "No cities found. Try different spelling."
                }
              />
            </div>

            <button 
              className={styles.searchButton}
              onClick={handleSearch}
              disabled={!selectedVibe || !selectedLocation || loading}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container" style={{ padding: '40px 20px', paddingBottom: favorites.length > 0 ? '100px' : '40px' }}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loader}></div>
            <p>Finding the best {selectedVibe?.value} spots in {selectedLocation?.label}...</p>
          </div>
        ) : searched && places.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No places found matching your criteria. Try a different area or vibe!</p>
          </div>
        ) : (
          <>
            {searched && (
              <h2 className={styles.resultsTitle}>
                Found {places.length} places for you in {selectedLocation?.label.split(',')[0]}
              </h2>
            )}
            
            <div className={styles.placesGrid}>
              {places.map(place => (
                <div 
                  key={place.id} 
                  className={styles.placeCard}
                >
                  <div className={styles.placeImageWrapper}>
                    <img src={place.image} alt={place.name} className={styles.placeImage} />
                    <button 
                      className={`${styles.likeButton} ${favorites.find(p => p.id === place.id) ? styles.liked : ''}`}
                      onClick={() => toggleFavorite(place)}
                    >
                      {favorites.find(p => p.id === place.id) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    {place.rating && (
                      <div className={styles.ratingBadge}>
                        <FaStar /> {place.rating}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.placeContent}>
                    <h3 className={styles.placeName}>{place.name}</h3>
                    
                    <p className={styles.placeAddress}>
                      <FaMapMarkerAlt className={styles.icon} /> {place.address}
                    </p>
                    
                    <div className={styles.categoryRow}>
                      <span className={styles.placeCategory}>
                        {place.category.split('.')[1] || place.category}
                      </span>
                      <span className={styles.distanceBadge}>
                        <FaWalking /> {place.distance}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.contactInfo}>
                      {place.phone && (
                        <a href={`tel:${place.phone}`} className={styles.contactItem}>
                          <FaPhone className={styles.contactIcon} />
                          <span>{place.phone}</span>
                        </a>
                      )}
                      
                      {place.website && (
                        <a 
                          href={place.website.startsWith('http') ? place.website : `https://${place.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.contactItem}
                        >
                          <FaGlobe className={styles.contactIcon} />
                          <span>Visit Website</span>
                        </a>
                      )}
                      
                      {place.openingHours && (
                        <div className={styles.contactItem}>
                          <FaClock className={styles.contactIcon} />
                          <span>Open Now</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {place.description && (
                      <p className={styles.placeDescription}>
                        {place.description.substring(0, 100)}
                        {place.description.length > 100 && '...'}
                      </p>
                    )}

                    {/* View on Map Link */}
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewMapLink}
                    >
                      View on Map →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Bar */}
      {favorites.length > 0 && (
        <div className={styles.bottomBar}>
          <div className={styles.barContent}>
            <div className={styles.barInfo}>
              <span className={styles.heartIcon}><FaHeart /></span>
              <span>{favorites.length} places selected</span>
            </div>
            <button className={styles.createTripButton} onClick={handleCreateTrip}>
              <FaPlane className={styles.planeIcon} />
              Create Trip
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={`modal is-active ${styles.successModal}`}>
          <div className="modal-background" onClick={() => setShowSuccessModal(false)} style={{ background: 'rgba(0,0,0,0.5)' }}></div>
          <div className="modal-content">
            <div className={styles.modalCard}>
              <div className={styles.successIcon}>
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className={styles.successTitle}>Places Saved!</h2>
              <p className={styles.successMessage}>
                You've saved <strong>{favorites.length} amazing {favorites.length === 1 ? 'place' : 'places'}</strong> to your favorites.
              </p>
              <div className={styles.savedPlacesList}>
                {favorites.slice(0, 3).map(place => (
                  <div key={place.id} className={styles.savedPlaceItem}>
                    <i className="fas fa-map-marker-alt" style={{color: '#0ea5e9'}}></i>
                    <span>{place.name}</span>
                  </div>
                ))}
                {favorites.length > 3 && (
                  <div className={styles.morePlaces}>
                    + {favorites.length - 3} more places
                  </div>
                )}
              </div>
              <p className={styles.successNote}>
                Ready to turn these into a trip? We'll help you plan it soon!
              </p>
            </div>
          </div>
          <button 
            className="modal-close is-large" 
            aria-label="close"
            onClick={() => setShowSuccessModal(false)}
          ></button>
        </div>
      )}
    </div>
  );
}

export default ExplorePage;
