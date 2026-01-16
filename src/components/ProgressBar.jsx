function ProgressBar({ steps, currentStep, styles }) {
  return (
    <div className={styles.progressBar}>
      {steps.map((step, index) => (
        <div key={step.id} className={styles.progressStep}>
          <div
            className={`${styles.stepCircle} ${currentStep >= step.id ? styles.stepActive : ""} ${currentStep > step.id ? styles.stepCompleted : ""}`}
          >
            {currentStep > step.id ? (
              <i className="fas fa-check"></i>
            ) : (
              <i className={step.icon}></i>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`${styles.stepLine} ${currentStep > step.id ? styles.lineCompleted : ""}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;
