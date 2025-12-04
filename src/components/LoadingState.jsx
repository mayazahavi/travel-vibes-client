// src/components/LoadingState.jsx
/**
 * LoadingState Component
 * Displays a loading spinner with a message while fetching data
 * 
 * @param {string} vibe - Selected vibe label (e.g., "foodie", "culture")
 * @param {string} location - Selected location name
 * @param {Object} styles - CSS module styles object
 */
function LoadingState({ vibe, location, styles }) {
  return (
    <div className={styles.loadingState}>
      <div className={styles.loader}></div>
      <p>Finding the best {vibe} spots in {location}...</p>
    </div>
  );
}

export default LoadingState;

