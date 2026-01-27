import styles from "./DaySelector.module.css";

function DaySelector({ days, selectedDay, onSelectDay, getDayDate }) {
  return (
    <div className={styles.daySelector}>
      <div className={`buttons are-small ${styles.dayButtons}`}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            className={`button is-rounded ${selectedDay === day ? `is-info ${styles.dayButtonActive}` : `is-white ${styles.dayButton}`}`}
          >
            <span>Day {day}</span>
            <span className={styles.dayButtonDate}>
              {getDayDate(day)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DaySelector;
