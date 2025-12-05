function LoadingState({ vibe, location, styles }) {
  return (
    <div className={styles.loadingState}>
      <div className={styles.loader}></div>
      <p>Finding the best {vibe} spots in {location}...</p>
    </div>
  );
}

export default LoadingState;
