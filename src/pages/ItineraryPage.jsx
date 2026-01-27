import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFavorites,
  selectCurrentTrip,
  updateFavoriteAsync,
} from "../store/slices/tripsSlice";
import styles from "../styles/FavoritesPage.module.css";
import { FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import ItineraryHeader from "../components/itinerary/ItineraryHeader";
import UnscheduledPlaces from "../components/itinerary/UnscheduledPlaces";
import DaySelector from "../components/itinerary/DaySelector";
import DaySchedule from "../components/itinerary/DaySchedule";
import { getFavoriteLocations } from "../utils/locations";

function ItineraryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const tripDetails = useSelector(selectCurrentTrip);

  const [selectedDay, setSelectedDay] = useState(1);

  const updatePlaceTime = async (placeId, time) => {
    try {
      await dispatch(
        updateFavoriteAsync({
          placeId,
          updates: { assignedTime: time },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update time:", error);
    }
  };

  const assignPlaceToDay = async (placeId, dayIndex) => {
    try {
      await dispatch(
        updateFavoriteAsync({
          placeId,
          updates: { assignedDay: dayIndex },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to assign day:", error);
    }
  };

  const clearPlaceSchedule = async (placeId) => {
    try {
      await dispatch(
        updateFavoriteAsync({
          placeId,
          updates: { assignedDay: null, assignedTime: null },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to clear schedule:", error);
    }
  };

  const getDaysCount = () => {
    if (!tripDetails?.startDate || !tripDetails?.endDate) return 3;
    const start = new Date(tripDetails.startDate);
    const end = new Date(tripDetails.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const getDayDate = (dayIndex) => {
    if (!tripDetails?.startDate) return `Day ${dayIndex}`;
    const date = new Date(tripDetails.startDate);
    date.setDate(date.getDate() + (dayIndex - 1));
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const locations = getFavoriteLocations(favorites);
  const locationsSubtitle =
    locations.length > 0 ? (
      <div className={styles.itineraryLocations}>
        <FaMapMarkerAlt className={styles.itineraryLocationsIcon} />
        <span>{locations.join(" • ")}</span>
      </div>
    ) : null;

  const daysCount = getDaysCount();
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  const unscheduledPlaces = favorites.filter((p) => !p.assignedDay);
  const dayPlaces = favorites
    .filter((p) => p.assignedDay === selectedDay)
    .sort((a, b) => {
      if (!a.assignedTime) return 1;
      if (!b.assignedTime) return -1;
      return a.assignedTime.localeCompare(b.assignedTime);
    });

  const handleAssign = (placeId) => {
    assignPlaceToDay(placeId, selectedDay);
  };

  const handleUnassign = (placeId) => {
    clearPlaceSchedule(placeId);
  };

  return (
    <div className={styles.favoritesPage}>
      <ItineraryHeader
        tripDetails={tripDetails}
        locationsSubtitle={locationsSubtitle}
        onBackToFavorites={() => navigate("/favorites")}
      />

      <div className={`container ${styles.itineraryContainer}`}>
        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <FaHeart className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No places scheduled yet</h3>
            <p className={styles.emptyText}>
              Save some favorites to build your itinerary.
            </p>
            <button
              className="button is-info is-rounded mt-4"
              onClick={() => navigate("/explore")}
            >
              Explore Places
            </button>
          </div>
        ) : (
          <>
            {/* Main Planner Card */}
            <div
              className={`card ${styles.itineraryCard}`}
            >
              <div className="columns is-gapless mb-0">
                <UnscheduledPlaces
                  places={unscheduledPlaces}
                  onAssign={handleAssign}
                />

                {/* Right Main Content - Calendar View */}
                <div className={`column is-9 ${styles.itineraryMainColumn}`}>
                  <DaySelector
                    days={days}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                    getDayDate={getDayDate}
                  />
                  <DaySchedule
                    selectedDay={selectedDay}
                    dayPlaces={dayPlaces}
                    getDayDate={getDayDate}
                    onUpdateTime={updatePlaceTime}
                    onUnassign={handleUnassign}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ItineraryPage;
