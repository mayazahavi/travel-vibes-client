import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaPlane } from "react-icons/fa";
import {
  addFavoriteAsync,
  removeFavoriteAsync,
  selectFavorites,
} from "../store/slices/tripsSlice";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import useApi from "../hooks/useApi";
import styles from "../styles/ExplorePage.module.css";
import { EXPLORE_VIBES } from "../constants/vibes";
import { API_URL } from "../config/api";
import { clearUsedImages } from "../services/imageService";
import {
  processPlacesData,
  getPlacesUrl,
  extractGeocodeFeatures,
  getCityOptionsFromFeatures,
} from "../services/placesService";
import PlaceCard from "../components/PlaceCard";
import SearchBar from "../components/SearchBar";
import SuccessModal from "../components/SuccessModal";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";

function ExplorePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const favorites = useSelector(selectFavorites);
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
      const loadPlaces = async () => {
        try {
          // Extract features from nested server response: data.data.features
          const features = extractGeocodeFeatures(placesApi.data);

          const formattedPlaces = await processPlacesData(
            features,
            selectedLocation.value,
            selectedVibe.value
          );
          setPlaces(formattedPlaces);
        } catch (error) {
          console.error("Error processing places:", error);
          setApiError(true);
        } finally {
          setProcessing(false);
        }
      };

      loadPlaces();
    } else if (placesApi.error) {
      setApiError(true);
      setProcessing(false);
      setToast({
        message: "Failed to load places. Please try again.",
        type: "error",
      });
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
      const url = `${API_URL}/places/geocode?text=${encodeURIComponent(inputValue)}&type=city&limit=10`;

      // Use refetch from cityApi which now returns data
      const response = await cityApi.refetch(url);
      const features = extractGeocodeFeatures(response);
      return getCityOptionsFromFeatures(features, 8);
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

    const url = getPlacesUrl(selectedVibe, selectedLocation);
    placesApi.refetch(url);
  };

  const toggleFavorite = async (place) => {
    if (!isAuthenticated) {
      setToast({
        message: "Please log in to save favorites",
        type: "warning",
      });
      return;
    }

    try {
      if (isFavorite(place.id)) {
        // Remove from favorites
        await dispatch(removeFavoriteAsync(place.id)).unwrap();
      } else {
        // Add to favorites
        const { city, country } = selectedLocation?.value || {};

        await dispatch(
          addFavoriteAsync({
            place: {
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
              vibe: selectedVibe?.value || "adventure",
              distance: place.distance,
              description: place.description,
              phone: place.phone,
              website: place.website,
              openingHours: place.openingHours,
              lat: place.lat,
              lon: place.lon,
            },
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setToast({
        message: "Failed to update favorites. Please try again.",
        type: "error",
      });
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
          search={{
            selectedVibe,
            selectedLocation,
            loading: placesApi.loading,
            apiError,
          }}
          handlers={{
            onVibeChange: setSelectedVibe,
            onLocationChange: setSelectedLocation,
            onSearch: handleSearch,
            loadCityOptions,
          }}
          ui={{ vibeOptions: EXPLORE_VIBES, styles }}
        />
      </div>
      <div
        className={`container ${styles.resultsContainer} ${favorites.length > 0 ? styles.resultsContainerWithBar : ""}`}
      >
        {placesApi.loading || processing ? (
          <LoadingState
            vibe={selectedVibe?.value}
            location={selectedLocation?.label}
            styles={styles}
          />
        ) : !searched ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyEmoji}>🌍</div>
            <h3 className={`${styles.emptyTitle} ${styles.emptyTitlePrimary}`}>
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
                  isFavorite={isFavorite(place.id)}
                  onToggleFavorite={toggleFavorite}
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
