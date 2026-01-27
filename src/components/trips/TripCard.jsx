import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaUserFriends,
  FaPen,
  FaTrash,
  FaCalendarAlt,
} from "react-icons/fa";
import { VIBE_IMAGES } from "../../constants/vibes";
import styles from "./TripCard.module.css";

function TripCard({ trip, onSelect, onSchedule, onEdit, onDelete }) {
  return (
    <div
      className={`card h-100 ${styles.card}`}
      onClick={() => onSelect(trip._id)}
    >
      <div className={`card-image ${styles.cardImage}`}>
        <figure className="image is-2by1">
          <img
            src={
              VIBE_IMAGES[trip.vibe] ||
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"
            }
            alt={trip.vibe}
            className={styles.cardImageImg}
          />
        </figure>
        <div className={`tags ${styles.cardTags}`}>
          <span
            className={`tag is-white is-medium is-rounded has-text-weight-bold ${styles.cardTag}`}
          >
            <span className="icon has-text-danger mr-1">
              <FaMapMarkerAlt />
            </span>
            {trip.favorites?.length || 0} Places
          </span>
        </div>

        <div className={styles.actionButtons}>
          <button
            onClick={(e) => onEdit(e, trip)}
            className={`button is-white is-rounded ${styles.actionButton} ${styles.actionButtonEdit}`}
            title="Edit Trip"
          >
            <span className="icon is-small">
              <FaPen size={12} />
            </span>
          </button>
          <button
            onClick={(e) => onDelete(e, trip._id)}
            className={`button is-white is-rounded ${styles.actionButton} ${styles.actionButtonDelete}`}
            title="Delete Trip"
          >
            <span className="icon is-small">
              <FaTrash size={12} />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`card-content ${styles.cardContent}`}
      >
        <div className="media mb-3">
          <div className="media-content">
            <p className={`title is-5 mb-2 ${styles.cardTitle}`}>
              {trip.name}
            </p>
            <div className="tags are-small">
              {trip.vibe && (
                <span className="tag is-info is-light">{trip.vibe} Vibe</span>
              )}
            </div>
          </div>
        </div>

        <div className={`content mb-4 ${styles.cardBody}`}>
          <div className={styles.infoRow}>
            <FaCalendarAlt className={`mr-2 ${styles.infoIcon}`} />
            <span className={styles.infoText}>
              {trip.startDate && new Date(trip.startDate).toLocaleDateString()}
              {trip.endDate &&
                ` - ${new Date(trip.endDate).toLocaleDateString()}`}
            </span>
          </div>
          {trip.travelers && (
            <div className={styles.infoRow}>
              <FaUserFriends className={`mr-2 ${styles.infoIcon}`} />
              <span className={styles.infoText}>
                {trip.travelers}{" "}
                {parseInt(trip.travelers, 10) === 1 ? "Traveler" : "Travelers"}
              </span>
            </div>
          )}
          {trip.destination && (
            <div className={`${styles.infoRow} ${styles.infoRowSpaced}`}>
              <FaMapMarkerAlt className={`mr-2 ${styles.infoIcon}`} />
              <span className={styles.infoText}>{trip.destination}</span>
            </div>
          )}
          {trip.description && (
            <div className={styles.description}>
              "
              {trip.description.length > 60
                ? trip.description.substring(0, 60) + "..."
                : trip.description}
              "
            </div>
          )}
        </div>

        <div className={styles.cardActions}>
          <button
            onClick={() => onSelect(trip._id)}
            className={`button is-white is-rounded has-text-weight-bold ${styles.placesButton}`}
          >
            <span className="icon is-small mr-1">
              <FaMapMarkerAlt />
            </span>
            <span className={styles.placesButtonText}>Places</span>
          </button>
          <button
            onClick={(e) => onSchedule(e, trip._id)}
            className={`button is-info is-rounded has-text-weight-bold shadow-sm ${styles.scheduleButton}`}
          >
            <span className={styles.scheduleButtonText}>
              Schedule
            </span>
            <span className={`icon is-small ml-2 ${styles.scheduleButtonIcon}`}>
              <FaArrowRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripCard;
