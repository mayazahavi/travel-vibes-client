import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaPlane } from "react-icons/fa";
import {
  addToFavorites,
  removeFromFavorites,
  selectFavorites,
  selectCurrentTripId,
} from "../store/slices/tripsSlice";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import useApi from "../hooks/useApi";
import styles from "../styles/ExplorePage.module.css";
import { EXPLORE_VIBES } from "../constants/vibes";
import { calculateDistance } from "../utils/distance";
import { getPlaceImage, clearUsedImages } from "../services/imageService";
import PlaceCard from "../components/PlaceCard";
import SearchBar from "../components/SearchBar";
import SuccessModal from "../components/SuccessModal";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";

const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;

function ExplorePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const favorites = useSelector(selectFavorites);
  const currentTripId = useSelector(selectCurrentTripId);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const initialVibe = searchParams.get("vibe");

  const [selectedVibe, setSelectedVibe] = useState(
    EXPLORE_VIBES.find((v) => v.value === initialVibe) || null,
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const placesApi = useApi();
  const cityApi = useApi();

  const [searched, setSearched] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState(null);

  const isFavorite = (placeId) => {
    return favorites.some((p) => p.id === placeId);
  };
  useEffect(() => {
    if (placesApi.loading) {
      setSearched(true);
      setProcessing(true);
    }

    if (placesApi.data && selectedLocation) {
      const processPlaces = async () => {
        try {
          const { lat, lon, city } = selectedLocation.value;
          const features = placesApi.data.features || [];
          const formattedPlaces = [];
          // ... processing logic ...

          const seenLocations = new Set();

          for (const feature of features) {
            // ... feature processing ...
            const props = feature.properties;
            const placeName = props.name || props.street;
            if (
              !placeName ||
              placeName.trim() === "" ||
              placeName === "Unknown Place"
            )
              continue;

            const locationKey = `${props.lat.toFixed(3)}_${props.lon.toFixed(3)}`;
            if (seenLocations.has(locationKey)) continue;
            seenLocations.add(locationKey);

            const distance = calculateDistance(lat, lon, props.lat, props.lon);
            const cuisine = props.cuisine
              ? Object.keys(props.cuisine).join(";")
              : "";
            const brand = props.brand || props.datasource?.raw?.brand || "";
            const street = props.street || "";

            const imageUrl = await getPlaceImage(
              placeName,
              props.categories ? props.categories[0] : "place",
              city,
              selectedVibe.value,
              props.place_id,
              cuisine,
              brand,
              street,
            );

            formattedPlaces.push({
              id: props.place_id,
              name: placeName,
              address:
                props.address_line2 || props.formatted || props.address_line1,
              category: props.categories ? props.categories[0] : "place",
              image: imageUrl,
              phone: props.contact?.phone || props.datasource?.raw?.phone,
              website: props.contact?.website || props.datasource?.raw?.website,
              openingHours: props.opening_hours,
              rating: props.datasource?.raw?.rating,
              description: props.datasource?.raw?.description,
              distance: distance,
              lat: props.lat,
              lon: props.lon,
            });
          }

          setPlaces(formattedPlaces);
        } catch (error) {
          console.error("Error processing places:", error);
          setApiError(true);
        } finally {
          setProcessing(false);
        }
      };

      processPlaces();
    } else if (placesApi.error) {
      setApiError(true);
      setProcessing(false);
      alert("Failed to load places. Please try again.");
    }
  }, [
    placesApi.data,
    placesApi.loading,
    placesApi.error,
    selectedLocation,
    selectedVibe,
  ]);

  const loadCityOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 3) {
      return [];
    }

    setApiError(false);

    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(inputValue)}&type=city&limit=10&apiKey=${GEOAPIFY_API_KEY}`;

      // Use refetch from cityApi which now returns data
      const data = await cityApi.refetch(url);

      if (!data || !data.features || data.features.length === 0) {
        return [];
      }

      const uniqueCities = new Map();

      data.features.forEach((feature) => {
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
              country: countryName,
            },
            label: label,
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

    setPlaces([]);
    setApiError(false);
    clearUsedImages();

    const { lat, lon } = selectedLocation.value;
    const categories = selectedVibe.categories;

    const url = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(categories)}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;

    placesApi.refetch(url);
  };

  const toggleFavorite = (place) => {
    if (!isAuthenticated) {
      setToast({
        message: "Please log in to save favorites",
        type: "warning",
      });
      return;
    }

    if (isFavorite(place.id)) {
      dispatch(removeFromFavorites(place.id));
    } else {
      const { city, country } = selectedLocation?.value || {};

      dispatch(
        addToFavorites({
          id: place.id,
          name: place.name,
          imageUrl: place.image,
          rating: place.rating || "4.5",
          location: place.address || selectedLocation?.label?.split(",")[0],
          city: city || selectedLocation?.label?.split(",")[0],
          country:
            country ||
            (selectedLocation?.label?.includes(",")
              ? selectedLocation?.label?.split(",").pop().trim()
              : ""),
          vibe: selectedVibe?.label,
          distance: place.distance,
          description: place.description,
          phone: place.phone,
          website: place.website,
          openingHours: place.openingHours,
          lat: place.lat,
          lon: place.lon,
        }),
      );
    }
  };

  const handleCreateTrip = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate("/favorites");
      window.scrollTo(0, 0);
    }, 3000);
  };

  return (
    <div className={styles.explorePage}>
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>DISCOVER YOUR DESTINATION</span>
        <h1 className={styles.title}>Explore Destinations</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.subtitle}>
          Discover hidden gems tailored to your vibe
        </p>
        <SearchBar
          selectedVibe={selectedVibe}
          onVibeChange={setSelectedVibe}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          onSearch={handleSearch}
          loadCityOptions={loadCityOptions}
          vibeOptions={EXPLORE_VIBES}
          loading={placesApi.loading}
          apiError={apiError}
          styles={styles}
        />
      </div>
      <div
        className="container"
        style={{
          padding: "40px 20px",
          paddingBottom: favorites.length > 0 ? "100px" : "40px",
        }}
      >
        {placesApi.loading || processing ? (
          <LoadingState
            vibe={selectedVibe?.value}
            location={selectedLocation?.label}
            styles={styles}
          />
        ) : !searched ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🌍</div>
            <h3
              className={styles.emptyTitle}
              style={{ color: "var(--text-primary)" }}
            >
              Ready to Explore?
            </h3>
            <p className={styles.emptyText}>
              Select a vibe and a destination to start your journey.
            </p>
          </div>
        ) : places.length === 0 ? (
          <EmptyState styles={styles} />
        ) : (
          <>
            <h2 className={styles.resultsTitle}>
              Found {places.length} {selectedVibe?.label.toLowerCase()} places
              for you in {selectedLocation?.label.split(",")[0]}
            </h2>
            <div className={styles.placesGrid}>
              {places.map((place) => (
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
              <span className={styles.heartIcon}>
                <FaHeart />
              </span>
              <span>{favorites.length} places selected</span>
            </div>
            <button
              className={styles.createTripButton}
              onClick={handleCreateTrip}
            >
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ExplorePage;
