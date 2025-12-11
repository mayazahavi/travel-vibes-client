import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaHeart, FaPlane } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
import styles from "../styles/ExplorePage.module.css";
import { EXPLORE_VIBES } from "../constants/vibes";
import { calculateDistance } from "../utils/distance";
import { getPlaceImage, clearUsedImages } from "../services/imageService";
import PlaceCard from "../components/PlaceCard";
import SearchBar from "../components/SearchBar";
import SuccessModal from "../components/SuccessModal";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

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
  
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
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
      setApiError(true);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!selectedVibe || !selectedLocation) return;

    setLoading(true);
    setSearched(true);
    setPlaces([]);
    clearUsedImages();

    try {
      const { lat, lon, city } = selectedLocation.value;
      const categories = selectedVibe.categories;
      
      const url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(categories)}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }
      
      const data = await response.json();

      const formattedPlaces = [];
      const seenLocations = new Set();
      
      for (const feature of data.features) {
        const props = feature.properties;
        
        const placeName = props.name || props.street;
        if (!placeName || placeName.trim() === '' || placeName === 'Unknown Place') {
          continue;
        }
        
        const locationKey = `${props.lat.toFixed(3)}_${props.lon.toFixed(3)}`;
        
        if (seenLocations.has(locationKey)) {
          continue;
        }
        
        seenLocations.add(locationKey);
        
        const distance = calculateDistance(lat, lon, props.lat, props.lon);
        
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
      alert("Failed to load places. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (place) => {
    if (isFavorite(place.id)) {
      removeFromFavorites(place.id);
    } else {
      // Add necessary properties for FavoritesPage display
      addToFavorites({
        id: place.id,
        name: place.name,
        imageUrl: place.image, // Mapping image to imageUrl to match FavoritesPage expectation
        rating: place.rating || '4.5',
        location: place.address || selectedLocation?.label?.split(',')[0],
        vibe: selectedVibe?.label,
        priceLevel: '$$' // Placeholder or actual data if available
      });
    }
  };

  const handleCreateTrip = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  return (
    <div className={styles.explorePage}>
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
      <div className="container" style={{ padding: '40px 20px', paddingBottom: favorites.length > 0 ? '100px' : '40px' }}>
        {loading ? (
          <LoadingState vibe={selectedVibe?.value} location={selectedLocation?.label} styles={styles} />
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
