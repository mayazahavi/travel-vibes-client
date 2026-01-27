import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import styles from "../../styles/FavoritesPage.module.css";

function FavoritesHeader({
  title,
  startDate,
  endDate,
  locationsSubtitle,
  onPlanSchedule,
  onAddMore,
}) {
  return (
    <div className={`${styles.headerSection} ${styles.favoritesHeader}`}>
      <span className={styles.headerEyebrow}>TRIP ITINERARY</span>
      <h1 className={`${styles.mainTitle} ${styles.favoritesHeaderTitle}`}>
        {title}
      </h1>
      <div
        className={`${styles.headerDivider} ${styles.favoritesHeaderDivider}`}
      ></div>

      {startDate && endDate && (
        <div className={styles.favoritesHeaderDate}>
          <FaCalendarAlt className={styles.favoritesHeaderDateIcon} />
          <span>
            {new Date(startDate).toLocaleDateString()} -{" "}
            {new Date(endDate).toLocaleDateString()}
          </span>
        </div>
      )}

      {locationsSubtitle}

      <div className={styles.favoritesHeaderActions}>
        <button
          onClick={onPlanSchedule}
          className={`button is-info is-rounded ${styles.planButton}`}
        >
          <span className="icon">
            <FaCalendarAlt />
          </span>
          <span>Plan Schedule</span>
        </button>

        <button
          onClick={onAddMore}
          className={`button is-white is-rounded ${styles.addMoreButton}`}
        >
          <span className="icon">
            <FaPlus />
          </span>
          <span>Add More Places</span>
        </button>
      </div>
    </div>
  );
}

export default FavoritesHeader;
