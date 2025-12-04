// src/components/EmptyState.jsx
/**
 * EmptyState Component
 * Displays a message when no results are found
 * 
 * @param {Object} styles - CSS module styles object
 */
function EmptyState({ styles }) {
  return (
    <div className={styles.emptyState}>
      <p>No places found matching your criteria. Try a different area or vibe!</p>
    </div>
  );
}

export default EmptyState;

