// src/components/SearchBar.jsx
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { FaSearch } from "react-icons/fa";

/**
 * SearchBar Component
 * Provides search interface for selecting vibe and location
 * 
 * @param {Object} selectedVibe - Currently selected vibe object
 * @param {Function} onVibeChange - Callback when vibe selection changes
 * @param {Object} selectedLocation - Currently selected location object
 * @param {Function} onLocationChange - Callback when location selection changes
 * @param {Function} onSearch - Callback when search button is clicked
 * @param {Function} loadCityOptions - Async function to load city options
 * @param {Array} vibeOptions - Array of available vibe options
 * @param {boolean} loading - Whether search is in progress
 * @param {boolean} apiError - Whether there's an API error
 * @param {Object} styles - CSS module styles object
 */
function SearchBar({
  selectedVibe,
  onVibeChange,
  selectedLocation,
  onLocationChange,
  onSearch,
  loadCityOptions,
  vibeOptions,
  loading,
  apiError,
  styles
}) {
  return (
    <div className={styles.searchContainer}>
      {apiError && (
        <div style={{color: '#ef4444', fontSize: '14px', marginBottom: '10px'}}>
          ⚠️ API connection issue. Please try again.
        </div>
      )}
      
      <div className={styles.searchBox}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Your Vibe</label>
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
          <label className={styles.label}>Where to?</label>
          <AsyncSelect
            loadOptions={loadCityOptions}
            onChange={onLocationChange}
            value={selectedLocation}
            placeholder="Type at least 3 letters (e.g. Paris, Tokyo)..."
            className={styles.reactSelect}
            classNamePrefix="select"
            noOptionsMessage={({ inputValue }) => 
              !inputValue ? "Start typing to search cities..." : 
              inputValue.length < 3 ? "Type at least 3 characters..." :
              "No cities found. Try different spelling."
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

