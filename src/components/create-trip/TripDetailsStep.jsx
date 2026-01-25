import React, { useState, useEffect, useRef } from "react";
import useApi from "../../hooks/useApi";

const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;

function TripDetailsStep({ formData, onChange, errors, styles, setFormData }) {
    const cityApi = useApi();
    const [destinationQuery, setDestinationQuery] = useState(formData.destination || "");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    // Sync internal state if parent state changes (optional, but good practice)
    useEffect(() => {
        setDestinationQuery(formData.destination || "");
    }, [formData.destination]);

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
        setDestinationQuery(value);
        // Determine if we need to clear parent error
        // (We can't clear parent error directly unless we call onChange with something, 
        // but here we are just typing. We will let the user select or type.)
        // Actually, we should probably update parent formData on type too? 
        // Or only on select? The original code updated formData on select.
        // But original code: setFormData((prev) => ({ ...prev, destination: fullName })); on select.
        // It also had handleInputChange? No, handleDestinationChange was specific.

        // Let's keep local query state.

        if (value.length >= 3) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        if (!showSuggestions || destinationQuery.length < 3) return;

        const timer = setTimeout(() => {
            const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(destinationQuery)}&type=city&limit=5&apiKey=${GEOAPIFY_API_KEY}`;
            cityApi.refetch(url);
        }, 500);

        return () => clearTimeout(timer);
    }, [destinationQuery, showSuggestions, cityApi]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDestinationSelect = (feature) => {
        const city = feature.properties.city || feature.properties.name;
        const country = feature.properties.country;
        const fullName = `${city}, ${country}`;

        setDestinationQuery(fullName);
        setShowSuggestions(false);

        // Update parent
        setFormData((prev) => ({
            ...prev,
            destination: fullName
        }));

        // Clear functionality is slightly tricky without passing setErrors, 
        // but usually onChange handles error clearing. 
        // We can simulate an onChange event or just call setFormData which triggers re-render.
        // The parent validation runs on 'nextStep', so clearing error explicitly here requires setErrors prop.
        // Let's assume parent handles error logic on validation mostly, 
        // OR we pass a specific callback `onDestinationSelect` that also clears error.
        // I'll stick to setFormData pattern from props used in other components.
    };

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
                className={styles.inputGroup}
                style={{ position: "relative" }}
                ref={suggestionsRef}
            >
                <label className={styles.label}>Destination</label>
                <div
                    className={`control ${cityApi.loading ? "is-loading" : ""}`}
                >
                    <input
                        type="text"
                        name="destination"
                        value={destinationQuery}
                        onChange={handleDestinationChange}
                        onFocus={() =>
                            destinationQuery.length >= 3 &&
                            setShowSuggestions(true)
                        }
                        className={`input ${errors.destination ? "is-danger" : ""}`}
                        placeholder={
                            destinationQuery.length < 3
                                ? "Type at least 3 characters..."
                                : "Where are you going?"
                        }
                        autoComplete="off"
                    />
                </div>
                {destinationQuery.length > 0 &&
                    destinationQuery.length < 3 && (
                        <p className="help is-info">
                            Please type at least 3 characters to search
                        </p>
                    )}
                {showSuggestions &&
                    cityApi.data &&
                    cityApi.data.features &&
                    cityApi.data.features.length > 0 && (
                        <div
                            className="box"
                            style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                zIndex: 20,
                                padding: "0",
                                marginTop: "4px",
                                maxHeight: "200px",
                                overflowY: "auto",
                            }}
                        >
                            {(() => {
                                const uniqueCities = new Set();
                                return cityApi.data.features
                                    .filter((feature) => {
                                        const label = `${feature.properties.city || feature.properties.name || ""}, ${feature.properties.country || ""}`;
                                        if (uniqueCities.has(label)) return false;
                                        uniqueCities.add(label);
                                        return true;
                                    })
                                    .map((feature, index) => {
                                        const label = `${feature.properties.city || feature.properties.name || ""}, ${feature.properties.country || ""}`;
                                        return (
                                            <div
                                                key={index}
                                                className={styles.suggestionItem}
                                                onClick={() =>
                                                    handleDestinationSelect(feature)
                                                }
                                                style={{
                                                    padding: "10px 15px",
                                                    borderBottom: "1px solid #f1f5f9",
                                                    cursor: "pointer",
                                                    transition: "background-color 0.2s",
                                                }}
                                                onMouseEnter={(e) =>
                                                (e.target.style.backgroundColor =
                                                    "#f8fafc")
                                                }
                                                onMouseLeave={(e) =>
                                                (e.target.style.backgroundColor =
                                                    "transparent")
                                                }
                                            >
                                                {label}
                                            </div>
                                        );
                                    });
                            })()}
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
