// src/pages/ExplorePage.jsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaHeart, FaPlane } from "react-icons/fa";
import styles from "../styles/ExplorePage.module.css";
import { EXPLORE_VIBES } from "../constants/vibes";
import { calculateDistance } from "../utils/distance";
import { getPlaceImage, clearUsedImages } from "../services/imageService";
import PlaceCard from "../components/PlaceCard";
import SearchBar from "../components/SearchBar";
import SuccessModal from "../components/SuccessModal";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

// --- Configuration & Helpers ---
const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;

function ExplorePage() {
  const [searchParams] = useSearchParams();
  const initialVibe = searchParams.get('vibe');

  const [selectedVibe, setSelectedVibe] = useState(
    EXPLORE_VIBES.find(v => v.value === initialVibe) || null
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
    clearUsedImages(); // Reset used images for new search

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
      const seenPlaceIds = new Set(); // Track places we've already added
      
      for (const feature of data.features) {
        const props = feature.properties;
        
        // Skip if we've already seen this place
        if (seenPlaceIds.has(props.place_id)) {
          console.log(`⚠️ Skipping duplicate place: ${props.name || props.street}`);
          continue;
        }
        
        // Skip places without a proper name
        const placeName = props.name || props.street;
        if (!placeName || placeName.trim() === '' || placeName === 'Unknown Place') {
          console.log(`⚠️ Skipping place without name`);
          continue;
        }
        
        seenPlaceIds.add(props.place_id);
        
        const distance = calculateDistance(lat, lon, props.lat, props.lon);
        
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
          street
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
        
        <SearchBar
          selectedVibe={selectedVibe}
          onVibeChange={setSelectedVibe}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          onSearch={handleSearch}
          loadCityOptions={loadCityOptions}
          vibeOptions={EXPLORE_VIBES}
          loading={loading}
          apiError={apiError}
          styles={styles}
        />
      </div>

      {/* Results Section */}
      <div className="container" style={{ padding: '40px 20px', paddingBottom: favorites.length > 0 ? '100px' : '40px' }}>
        {loading ? (
          <LoadingState
            vibe={selectedVibe?.value}
            location={selectedLocation?.label}
            styles={styles}
          />
        ) : searched && places.length === 0 ? (
          <EmptyState styles={styles} />
        ) : (
          <>
            {searched && (
              <h2 className={styles.resultsTitle}>
                Found {places.length} {selectedVibe?.label.toLowerCase()} places for you in {selectedLocation?.label.split(',')[0]}
              </h2>
            )}
            
            <div className={styles.placesGrid}>
              {places.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  styles={styles}
                />
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
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        favorites={favorites}
        styles={styles}
      />
    </div>
  );
}

export default ExplorePage;
