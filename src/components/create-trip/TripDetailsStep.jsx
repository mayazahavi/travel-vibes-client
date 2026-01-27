import React, { useState, useEffect, useRef, useCallback } from "react";
import { API_URL } from "../../config/api";
import useApi from "../../hooks/useApi";
import {
    extractGeocodeFeatures,
    getCityOptionsFromFeatures,
} from "../../services/placesService";
import styles from "../../styles/CreateTripPage.module.css";

// Geocode API is now proxied through the server for security

function TripDetailsStep({ formData, onChange, errors, setFormData }) {
    const cityApi = useApi();
    const { refetch: refetchCities } = cityApi;
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const destinationValue = formData.destination || "";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDestinationChange = (e) => {
        const value = e.target.value;
        onChange(e);
        setShowSuggestions(value.length >= 3);
    };

    const fetchCitySuggestions = useCallback(() => {
        const url = `${API_URL}/places/geocode?text=${encodeURIComponent(destinationValue)}&type=city&limit=5`;
        refetchCities(url);
    }, [destinationValue, refetchCities]);

    useEffect(() => {
        if (!showSuggestions || destinationValue.length < 3) return;

        const timer = setTimeout(fetchCitySuggestions, 500);
        return () => clearTimeout(timer);
    }, [destinationValue, fetchCitySuggestions, showSuggestions]);

    const handleDestinationSelect = (option) => {
        setShowSuggestions(false);

        setFormData((prev) => ({
            ...prev,
            destination: option.label,
        }));
    };

    const suggestionsList = getCityOptionsFromFeatures(
        extractGeocodeFeatures(cityApi.data),
        6,
    );

    return (
        <>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Trip Name</label>
                <input
                    type="text"
                    name="tripName"
                    value={formData.tripName}
                    onChange={onChange}
                    className={`input ${errors.tripName ? "is-danger" : ""}`}
                    placeholder="e.g., Summer in Italy 2025"
                />
                {errors.tripName && (
                    <p className="help is-danger">{errors.tripName}</p>
                )}
            </div>
            <div
                className={`${styles.inputGroup} ${styles.relativeGroup}`}
                ref={suggestionsRef}
            >
                <label className={styles.label}>Destination</label>
                <div
                    className={`control ${cityApi.loading ? "is-loading" : ""}`}
                >
                    <input
                        type="text"
                        name="destination"
                    value={destinationValue}
                        onChange={handleDestinationChange}
                        onFocus={() =>
                            destinationValue.length >= 3 &&
                            setShowSuggestions(true)
                        }
                        className={`input ${errors.destination ? "is-danger" : ""}`}
                        placeholder={
                            destinationValue.length < 3
                                ? "Type at least 3 characters..."
                                : "Where are you going?"
                        }
                        autoComplete="off"
                    />
                </div>
                {destinationValue.length > 0 &&
                    destinationValue.length < 3 && (
                        <p className="help is-info">
                            Please type at least 3 characters to search
                        </p>
                    )}
                {showSuggestions &&
                    suggestionsList.length > 0 && (
                        <div className={`box ${styles.suggestionsBox}`}>
                            {suggestionsList.map((option) => (
                                <div
                                    key={option.label}
                                    className={styles.suggestionItem}
                                    onClick={() =>
                                        handleDestinationSelect(option)
                                    }
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                {errors.destination && (
                    <p className="help is-danger">{errors.destination}</p>
                )}
            </div>
        </>
    );
}

export default TripDetailsStep;
