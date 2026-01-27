import { FaCalendarDay, FaMapMarkerAlt, FaClock, FaTrash } from "react-icons/fa";
import styles from "./DaySchedule.module.css";

function DaySchedule({
  selectedDay,
  dayPlaces,
  getDayDate,
  onUpdateTime,
  onUnassign,
}) {
  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.scheduleHeader}>
        <div>
          <h2
            className={`title is-4 mb-1 ${styles.scheduleTitle}`}
          >
            Day {selectedDay}
          </h2>
          <p
            className={`subtitle is-6 ${styles.scheduleSubtitle}`}
          >
            {getDayDate(selectedDay)} • {dayPlaces.length} Activities
          </p>
        </div>
      </div>

      {dayPlaces.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FaCalendarDay size={24} />
          </div>
          <h3 className={`title is-6 has-text-grey ${styles.emptyTitle}`}>
            Your schedule is empty
          </h3>
          <p className={`subtitle is-7 has-text-grey-light ${styles.emptySubtitle}`}>
            Start building your day by adding places from the sidebar.
          </p>
        </div>
      ) : (
        <div className={`timeline-container ${styles.timeline}`}>
          {dayPlaces.map((place, index) => (
            <div
              key={place.id}
              className={styles.timelineItem}
            >
              <div
                className={`${styles.timelineLine} ${index === dayPlaces.length - 1 ? styles.timelineLineEnd : ""}`}
              ></div>
              <div className={styles.timelineDot}></div>

              <div className={styles.timeSlot}>
                <div className={styles.timeInputWrapper}>
                  <input
                    type="time"
                    value={place.assignedTime || ""}
                    onChange={(e) => onUpdateTime(place.id, e.target.value)}
                    className={styles.timeInput}
                  />
                </div>
                {!place.assignedTime && (
                  <span className={styles.timePlaceholder}>
                    Set Time
                  </span>
                )}
              </div>

              <div
                className={`card ${styles.activityCard}`}
              >
                <div className={styles.activityImageWrapper}>
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className={styles.activityImage}
                  />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <div>
                      <h4
                        className={styles.activityName}
                      >
                        {place.name}
                      </h4>
                      <div
                        className={styles.activityLocation}
                      >
                        <FaMapMarkerAlt size={12} className={styles.locationIcon} />
                        <span>{place.location?.split(",")[0]}</span>
                      </div>
                      {place.openingHours && (
                        <div className={styles.activityOpen}>
                          <FaClock size={10} />
                          <span>Open</span>
                        </div>
                      )}
                    </div>
                    <button
                      className={`button is-small is-white is-rounded ${styles.unassignButton}`}
                      onClick={() => onUnassign(place.id)}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DaySchedule;
