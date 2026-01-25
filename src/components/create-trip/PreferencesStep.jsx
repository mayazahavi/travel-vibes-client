import React from "react";
import { CREATE_TRIP_VIBES } from "../../constants/vibes";

function PreferencesStep({ formData, onChange, errors, styles }) {
    return (
        <div className={styles.inputGroup}>
            <label className={styles.label}>
                Select Your Travel Vibe
            </label>
            <div className="select is-fullwidth">
                <select
                    name="vibe"
                    value={formData.vibe}
                    onChange={onChange}
                >
                    <option value="">Choose a vibe...</option>
                    {CREATE_TRIP_VIBES.map((v) => (
                        <option key={v.value} value={v.value}>
                            {v.label} - {v.desc}
                        </option>
                    ))}
                </select>
            </div>
            {errors.vibe && (
                <p className="help is-danger">{errors.vibe}</p>
            )}
        </div>
    );
}

export default PreferencesStep;
