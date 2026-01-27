import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import styles from "../../styles/FavoritesPage.module.css";
import headerStyles from "./ItineraryHeader.module.css";

function ItineraryHeader({ tripDetails, locationsSubtitle, onBackToFavorites }) {
  return (
    <div className={`${styles.headerSection} ${headerStyles.headerSection}`}>
      <span
        className={`${styles.headerEyebrow} ${headerStyles.headerEyebrow}`}
      >
        DAILY PLANNER
      </span>
      <h1
        className={`${styles.mainTitle} ${headerStyles.mainTitle}`}
      >
        {tripDetails?.name || "My Trip Itinerary"}
      </h1>
      <div
        className={`${styles.headerDivider} ${headerStyles.headerDivider}`}
      ></div>

      {tripDetails?.startDate && tripDetails?.endDate && (
        <div className={headerStyles.dateRow}>
          <FaCalendarAlt className={headerStyles.dateIcon} />
          <span>
            {new Date(tripDetails.startDate).toLocaleDateString()} -{" "}
            {new Date(tripDetails.endDate).toLocaleDateString()}
          </span>
        </div>
      )}

      {locationsSubtitle}

      <div className={headerStyles.actions}>
        <button
          onClick={onBackToFavorites}
          className={`button is-white is-rounded ${headerStyles.backButton}`}
        >
          <span className="icon">
            <FaMapMarkerAlt />
          </span>
          <span>Back to Favorites</span>
        </button>
      </div>
    </div>
  );
}

export default ItineraryHeader;
