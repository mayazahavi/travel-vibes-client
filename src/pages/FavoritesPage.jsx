/* Reusing styles from module */
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  removeFavoriteAsync,
  selectFavorites,
  selectCurrentTrip,
} from "../store/slices/tripsSlice";
import styles from "../styles/FavoritesPage.module.css";
import FavoritesHeader from "../components/favorites/FavoritesHeader";
import FavoritesToolbar from "../components/favorites/FavoritesToolbar";
import FavoriteCard from "../components/favorites/FavoriteCard";
import { getFavoriteLocations } from "../utils/locations";

function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const tripDetails = useSelector(selectCurrentTrip);
  const [sortOrder, setSortOrder] = useLocalStorage(
    "favorites_sort_order",
    "default",
  );

  const handleAddMore = () => {
    const vibeParam = tripDetails?.vibe ? `?vibe=${tripDetails.vibe}` : "";
    navigate(`/explore${vibeParam}`);
  };

  const handleRemoveFavorite = async (placeId) => {
    try {
      await dispatch(removeFavoriteAsync(placeId)).unwrap();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const getPageTitle = () => {
    if (tripDetails?.name) {
      return tripDetails.name;
    }
    return "My Saved Trips";
  };

  const locations = getFavoriteLocations(favorites);
  const locationsSubtitle =
    locations.length > 0 ? (
      <div className={styles.locationsSubtitle}>
        <FaMapMarkerAlt className={styles.locationsSubtitleIcon} />
        <span>{locations.join(" • ")}</span>
      </div>
    ) : null;

  const parseDistance = (distStr) => {
    if (!distStr) return Infinity;
    if (typeof distStr === "string") {
      if (distStr.endsWith("km")) return parseFloat(distStr);
      if (distStr.endsWith("m")) return parseFloat(distStr) / 1000;
    }
    return parseFloat(distStr) || Infinity;
  };
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortOrder === "name_asc") {
      return (a.name || "").localeCompare(b.name || "");
    }
    if (sortOrder === "name_desc") {
      return (b.name || "").localeCompare(a.name || "");
    }
    if (sortOrder === "distance") {
      return parseDistance(a.distance) - parseDistance(b.distance);
    }
    return 0;
  });

  return (
    <div className={styles.favoritesPage}>
      <FavoritesHeader
        title={getPageTitle()}
        startDate={tripDetails?.startDate}
        endDate={tripDetails?.endDate}
        locationsSubtitle={locationsSubtitle}
        onPlanSchedule={() => navigate("/itinerary")}
        onAddMore={handleAddMore}
      />

      <div className={`container ${styles.favoritesContainer}`}>
        <FavoritesToolbar
          count={favorites.length}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <FaHeart className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No favorites yet</h3>
            <p className={styles.emptyText}>
              Go explore and save the places you love!
            </p>
          </div>
        ) : (
          <div className="columns is-multiline is-mobile">
            {sortedFavorites.map((place) => (
              <div
                key={place.id}
                className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen"
              >
                <FavoriteCard
                  place={place}
                  onRemove={handleRemoveFavorite}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
