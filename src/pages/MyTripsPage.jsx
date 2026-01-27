import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaPlaneDeparture,
  FaPlus,
} from "react-icons/fa";
import {
  selectTrips,
  setCurrentTrip,
  deleteTripAsync,
  updateTripAsync,
  fetchUserTrips,
  selectTripsLoading,
  selectTripsError,
} from "../store/slices/tripsSlice";
import styles from "../styles/FavoritesPage.module.css";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EditTripModal from "../components/EditTripModal";
import Toast from "../components/Toast";
import TripCard from "../components/trips/TripCard";

function MyTripsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const trips = useSelector(selectTrips);
  const loading = useSelector(selectTripsLoading);
  const error = useSelector(selectTripsError);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    tripId: null,
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    trip: null,
  });
  const [toast, setToast] = useState(null);

  const handleTripSelect = (tripId) => {
    dispatch(setCurrentTrip(tripId));
    navigate("/favorites");
  };

  const handleTripSchedule = (e, tripId) => {
    e.stopPropagation();
    dispatch(setCurrentTrip(tripId));
    navigate("/itinerary");
  };

  const handleDeleteClick = (e, tripId) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, tripId });
  };

  const handleEditClick = (e, trip) => {
    e.stopPropagation();
    setEditModal({ isOpen: true, trip });
  };

  const confirmDelete = async () => {
    if (deleteModal.tripId) {
      try {
        await dispatch(deleteTripAsync(deleteModal.tripId)).unwrap();
        setDeleteModal({ isOpen: false, tripId: null });
      } catch (error) {
        console.error("Failed to delete trip:", error);
        setToast({
          message: "Failed to delete trip. Please try again.",
          type: "error",
        });
        setDeleteModal({ isOpen: false, tripId: null });
      }
    }
  };

  const confirmEdit = async (id, updates) => {
    try {
      return await dispatch(updateTripAsync({ id, updates })).unwrap();
    } catch (error) {
      console.error("Failed to update trip:", error);
      setToast({
        message: "Failed to update trip. Please try again.",
        type: "error",
      });
      throw error;
    }
  };

  const handleRetryFetch = () => {
    dispatch(fetchUserTrips());
  };

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>YOUR ADVENTURES</span>
        <h1 className={styles.mainTitle}>My Trips</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.mainSubtitle}>
          Manage all your planned journeys in one place.
        </p>
        <button
          onClick={() => navigate("/vibes")}
          className={`button is-info is-rounded ${styles.myTripsPrimaryButton}`}
        >
          <span className="icon">
            <FaPlus />
          </span>
          <span>Plan New Trip</span>
        </button>
      </div>

      <div className={`container ${styles.myTripsContainer}`}>
        <div className="level mb-5">
          <div className="level-left">
            <p className="level-item">
              <strong
                className={`title is-4 has-text-grey-dark ${styles.myTripsTitle}`}
              >
                <FaPlaneDeparture className={styles.myTripsTitleIcon} />
                {trips.length} {trips.length === 1 ? "Trip" : "Trips"} Planned
              </strong>
            </p>
          </div>
        </div>

        {error && (
          <div className="notification is-danger is-light mb-4">
            <p>{error}</p>
            <button
              className="button is-light is-small mt-3"
              onClick={handleRetryFetch}
            >
              Try Again
            </button>
          </div>
        )}

        {loading && trips.length === 0 ? (
          <div className={styles.emptyState}>
            <FaPlaneDeparture className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>Loading trips...</h3>
            <p className={styles.emptyText}>Just a moment while we fetch your trips.</p>
          </div>
        ) : trips.length === 0 ? (
          <div className={styles.emptyState}>
            <FaPlaneDeparture className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No trips planned yet</h3>
            <p className={styles.emptyText}>
              Start planning your next dream vacation!
            </p>
            <button
              onClick={() => navigate("/vibes")}
              className="button is-info is-rounded mt-4"
            >
              Start Planning
            </button>
          </div>
        ) : (
          <div className="columns is-multiline">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="column is-12-mobile is-6-tablet is-4-desktop"
              >
                <TripCard
                  trip={trip}
                  onSelect={handleTripSelect}
                  onSchedule={handleTripSchedule}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            ))}
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, tripId: null })}
          onConfirm={confirmDelete}
          title="Delete Trip?"
          message="Are you sure you want to remove this trip? All saved places for this trip will be lost."
        />

        <EditTripModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, trip: null })}
          onSave={confirmEdit}
          trip={editModal.trip}
        />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default MyTripsPage;
