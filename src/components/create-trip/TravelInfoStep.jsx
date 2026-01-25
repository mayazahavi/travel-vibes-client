import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TravelInfoStep({ formData, onChange, onDateChange, errors, styles }) {
    return (
        <>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Start Date</label>
                <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => onDateChange(date, "startDate")}
                    className="input"
                    placeholderText="Select start date"
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom"
                />
                {errors.startDate && (
                    <p className="help is-danger">{errors.startDate}</p>
                )}
            </div>
            <div className={styles.inputGroup}>
                <label className={styles.label}>End Date</label>
                <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => onDateChange(date, "endDate")}
                    className="input"
                    placeholderText="Select end date"
                    minDate={formData.startDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom"
                />
                {errors.endDate && (
                    <p className="help is-danger">{errors.endDate}</p>
                )}
            </div>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Number of Travelers</label>
                <input
                    type="number"
                    name="travelers"
                    value={formData.travelers}
                    onChange={onChange}
                    className="input"
                    min="1"
                    placeholder="How many people?"
                />
                {errors.travelers && (
                    <p className="help is-danger">{errors.travelers}</p>
                )}
            </div>
        </>
    );
}

export default TravelInfoStep;
