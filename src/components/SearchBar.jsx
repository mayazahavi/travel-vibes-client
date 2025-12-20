import AsyncSelect from "react-select/async";
import Select from "react-select";
import { FaSearch, FaMapMarkerAlt, FaUmbrellaBeach } from "react-icons/fa";

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
          <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaUmbrellaBeach style={{ color: '#0ea5e9' }} />
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
          <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaMapMarkerAlt style={{ color: '#0ea5e9' }} />
            Where to?
          </label>
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
        <button className={styles.searchButton} onClick={onSearch} disabled={!selectedVibe || !selectedLocation || loading}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
