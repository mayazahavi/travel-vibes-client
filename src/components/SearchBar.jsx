import AsyncSelect from "react-select/async";
import Select from "react-select";
import { FaSearch, FaMapMarkerAlt, FaUmbrellaBeach } from "react-icons/fa";

function SearchBar({ search, handlers, ui }) {
  const { selectedVibe, selectedLocation, loading, apiError } = search;
  const { onVibeChange, onLocationChange, onSearch, loadCityOptions } = handlers;
  const { vibeOptions, styles } = ui;

  return (
    <div className={styles.searchContainer}>
      {apiError && (
        <div className={styles.apiError}>
          ⚠️ API connection issue. Please try again.
        </div>
      )}
      <div className={styles.searchBox}>
        <div className={styles.filterGroup}>
          <label
            className={`${styles.label} ${styles.labelWithIcon}`}
          >
            <FaUmbrellaBeach className={styles.iconAccent} />
            Your Vibe
          </label>
          <Select
            value={selectedVibe}
            onChange={onVibeChange}
            options={vibeOptions}
            placeholder="Select Vibe..."
            className={styles.reactSelect}
            classNamePrefix="select"
          />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.filterGroup}>
          <label
            className={`${styles.label} ${styles.labelWithIcon}`}
          >
            <FaMapMarkerAlt className={styles.iconAccent} />
            Where to?
          </label>
          <AsyncSelect
            loadOptions={loadCityOptions}
            onChange={onLocationChange}
            value={selectedLocation}
            placeholder="Type at least 3 letters (e.g. Paris, Tokyo)..."
            className={styles.reactSelect}
            classNamePrefix="select"
            loadingMessage={() => "Searching cities..."}
            noOptionsMessage={({ inputValue }) =>
              !inputValue
                ? "Start typing to search cities..."
                : inputValue.length < 3
                  ? "Type at least 3 characters..."
                  : "No cities found. Try different spelling."
            }
          />
        </div>
        <button
          className={styles.searchButton}
          onClick={onSearch}
          disabled={!selectedVibe || !selectedLocation || loading}
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
