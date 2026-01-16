import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/CreateTripPage.module.css";
import { VIBE_IMAGES, CREATE_TRIP_VIBES } from "../constants/vibes";
import ProgressBar from "../components/ProgressBar";
import { createTrip } from "../store/slices/tripsSlice";
import useApi from "../hooks/useApi";

const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;

function CreateTripPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedVibe = searchParams.get("vibe");

  const cityApi = useApi();
  const [destinationQuery, setDestinationQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: null,
    endDate: null,
    travelers: "",
    vibe: selectedVibe || "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    if (errors.destination) setErrors((prev) => ({ ...prev, destination: "" }));
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
  }, [destinationQuery, showSuggestions, cityApi.refetch]);

  const handleDestinationSelect = (feature) => {
    const city = feature.properties.city || feature.properties.name;
    const country = feature.properties.country;
    const fullName = `${city}, ${country}`;

    setFormData((prev) => ({ ...prev, destination: fullName }));
    setDestinationQuery(fullName);
    setShowSuggestions(false);

    if (errors.destination) setErrors((prev) => ({ ...prev, destination: "" }));
  };

  const steps = [
    { id: 1, title: "Trip Details", icon: "fas fa-suitcase" },
    { id: 2, title: "Travel Info", icon: "fas fa-calendar-alt" },
    { id: 3, title: "Preferences", icon: "fas fa-heart" },
  ];

  const getCurrentImage = () => {
    const vibe = formData.vibe || selectedVibe;
    if (vibe && VIBE_IMAGES[vibe]) {
      return VIBE_IMAGES[vibe];
    }
    return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.tripName || formData.tripName.length < 3) {
        newErrors.tripName = "Trip name must be at least 3 characters";
      }
      if (!formData.destination || formData.destination.length < 3) {
        newErrors.destination = "Please select a destination";
      }
    } else if (currentStep === 2) {
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.endDate) newErrors.endDate = "End date is required";
      if (!formData.travelers || formData.travelers < 1)
        newErrors.travelers = "At least 1 traveler required";
    } else if (currentStep === 3) {
      if (!formData.vibe) newErrors.vibe = "Please select a vibe";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
      else handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    console.log("Trip Created Successfully:", formData);
    dispatch(
      createTrip({
        name: formData.tripName,
        destination: formData.destination,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        vibe: formData.vibe,
        travelers: formData.travelers,
      }),
    );

    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate(`/explore?vibe=${formData.vibe || selectedVibe}`);
      setTimeout(() => window.scrollTo(0, 0), 100);
    }, 3000);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>PLAN YOUR JOURNEY</span>
        <h1 className={styles.pageTitle}>Create Your Trip</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.pageSubtitle}>
          Build your perfect travel experience step by step
        </p>
      </div>
      <div className={styles.pageContainer}>
        <div className={styles.createTripCard}>
          <div className={styles.imageSide}>
            <img
              src={getCurrentImage()}
              alt="Travel Vibe"
              className={styles.vibeImage}
            />
            <div className={styles.imageOverlay}>
              <div className={styles.overlayContent}>
                <h2 className={styles.tripNameDisplay}>
                  {formData.tripName || "Your Trip Name"}
                </h2>
                <span className={styles.vibeTag}>
                  {formData.vibe
                    ? CREATE_TRIP_VIBES.find((v) => v.value === formData.vibe)
                        ?.label
                    : "Select your vibe"}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.formSide}>
            <ProgressBar
              steps={steps}
              currentStep={currentStep}
              styles={styles}
            />
            <div className={styles.stepInfo}>
              <h2 className={styles.stepTitle}>
                {steps[currentStep - 1].title}
              </h2>
              <p className={styles.stepDescription}>
                Step {currentStep} of {steps.length}
              </p>
            </div>
            <div className={styles.formContent}>
              {currentStep === 1 && (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Trip Name</label>
                    <input
                      type="text"
                      name="tripName"
                      value={formData.tripName}
                      onChange={handleInputChange}
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
                          {/* Filter unique cities to prevent duplicates */}
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
              )}
              {currentStep === 2 && (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Start Date</label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => handleDateChange(date, "startDate")}
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
                      onChange={(date) => handleDateChange(date, "endDate")}
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
                      onChange={handleInputChange}
                      className="input"
                      min="1"
                      placeholder="How many people?"
                    />
                    {errors.travelers && (
                      <p className="help is-danger">{errors.travelers}</p>
                    )}
                  </div>
                </>
              )}
              {currentStep === 3 && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Select Your Travel Vibe
                  </label>
                  <div className="select is-fullwidth">
                    <select
                      name="vibe"
                      value={formData.vibe}
                      onChange={handleInputChange}
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
              )}
            </div>
            <div className={styles.navigationButtons}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className={`button ${styles.prevButton}`}
                >
                  <span className="icon">
                    <i className="fas fa-arrow-left"></i>
                  </span>
                  <span>Back</span>
                </button>
              )}
              <button
                type="button"
                onClick={nextStep}
                className={`button is-primary ${styles.nextButton}`}
                style={{ marginLeft: currentStep === 1 ? "auto" : "0" }}
              >
                <span>
                  {currentStep === steps.length ? "Create Trip" : "Next Step"}
                </span>
                <span className="icon">
                  <i className="fas fa-arrow-right"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <div className={`modal is-active ${styles.successModal}`}>
          <div
            className="modal-background"
            onClick={() => setShowSuccessModal(false)}
            style={{ background: "rgba(0,0,0,0.6)" }}
          ></div>
          <div className="modal-content">
            <div className={styles.modalCard}>
              <div className={styles.successIcon}>
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className={styles.successTitle}>
                Trip Created Successfully!
              </h2>
              <p className={styles.successMessage}>
                Your trip <strong>"{formData.tripName}"</strong> has been
                created.
              </p>
              <div className={styles.tripSummary}>
                <div className={styles.summaryItem}>
                  <i className="fas fa-calendar-alt"></i>
                  <span>
                    {formData.startDate?.toLocaleDateString()} -{" "}
                    {formData.endDate?.toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <i className="fas fa-users"></i>
                  <span>
                    {formData.travelers}{" "}
                    {formData.travelers === "1" ? "Traveler" : "Travelers"}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <i className="fas fa-heart"></i>
                  <span>
                    {
                      CREATE_TRIP_VIBES.find((v) => v.value === formData.vibe)
                        ?.label
                    }{" "}
                    Vibe
                  </span>
                </div>
              </div>
              <p className={styles.successNote}>
                Get ready for an amazing adventure! 🎉
              </p>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => setShowSuccessModal(false)}
          ></button>
        </div>
      )}
    </div>
  );
}

export default CreateTripPage;
