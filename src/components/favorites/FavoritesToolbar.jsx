import { FaHeart, FaSortAmountDown } from "react-icons/fa";
import styles from "../../styles/FavoritesPage.module.css";

function FavoritesToolbar({ count, sortOrder, onSortChange }) {
  if (count === 0) return null;

  return (
    <div className="level mb-5">
      <div className="level-left">
        <p className="level-item">
          <strong
            className={`title is-4 has-text-grey-dark ${styles.favoritesToolbarTitle}`}
          >
            <FaHeart className={styles.favoritesToolbarHeart} />
            {count} {count === 1 ? "Place" : "Places"} Saved
          </strong>
        </p>
      </div>
      <div className="level-right">
        <div className="level-item">
          <div className="field has-addons">
            <p className="control">
              <button className="button is-static">
                <span className="icon is-small">
                  <FaSortAmountDown />
                </span>
                <span>Sort by:</span>
              </button>
            </p>
            <p className="control">
              <div className="select">
                <select
                  value={sortOrder}
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="distance">Distance (Closest)</option>
                </select>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavoritesToolbar;
