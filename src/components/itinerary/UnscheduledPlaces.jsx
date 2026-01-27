import { FaPlus, FaMapPin } from "react-icons/fa";
import styles from "./UnscheduledPlaces.module.css";

function UnscheduledPlaces({ places, onAssign }) {
  return (
    <div className={`column is-3 ${styles.sidebar}`}>
      <div className={styles.sidebarInner}>
        <div className={styles.sidebarHeader}>
          <h3
            className={`title is-6 is-uppercase mb-0 ${styles.sidebarTitle}`}
          >
            Unscheduled
          </h3>
          <span className="tag is-rounded">{places.length}</span>
        </div>

        <div className={styles.sidebarList}>
          {places.map((place) => (
            <div
              key={place.id}
              className={`box p-3 ${styles.placeItem}`}
            >
              <div className={styles.placeRow}>
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className={styles.placeImage}
                />
                <div className={styles.placeContent}>
                  <h4
                    className={styles.placeName}
                  >
                    {place.name}
                  </h4>
                  <p
                    className={styles.placeCategory}
                  >
                    {place.category?.split(".")[1] || "Place"}
                  </p>
                </div>
                <button
                  className={`button ${styles.addButton}`}
                  onClick={() => onAssign(place.id)}
                  title="Add to schedule"
                  aria-label={`Add ${place.name} to schedule`}
                >
                  <FaPlus className={styles.addIcon} />
                </button>
              </div>
            </div>
          ))}
          {places.length === 0 && (
            <div
              className={styles.emptyState}
            >
              <FaMapPin size={24} className="mb-2" />
              <p className="is-size-7">All places scheduled!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnscheduledPlaces;
