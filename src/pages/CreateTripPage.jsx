// src/pages/CreateTripPage.js
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/CreateTripPage.module.css";
import { VIBE_IMAGES, CREATE_TRIP_VIBES } from "../constants/vibes";

function CreateTripPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedVibe = searchParams.get('vibe');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tripName: "",
    startDate: null,
    endDate: null,
    travelers: "",
    vibe: selectedVibe || ""
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = [
    { id: 1, title: "Trip Details", icon: "fas fa-suitcase" },
    { id: 2, title: "Travel Info", icon: "fas fa-calendar-alt" },
    { id: 3, title: "Preferences", icon: "fas fa-heart" }
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.tripName || formData.tripName.length < 3) {
        newErrors.tripName = "Trip name must be at least 3 characters";
      }
    } else if (currentStep === 2) {
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.endDate) newErrors.endDate = "End date is required";
      if (!formData.travelers || formData.travelers < 1) newErrors.travelers = "At least 1 traveler required";
    } else if (currentStep === 3) {
      if (!formData.vibe) newErrors.vibe = "Please select a vibe";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length) setCurrentStep(prev => prev + 1);
      else handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    console.log("Trip Created Successfully:", formData);
    setShowSuccessModal(true);
    
    // Show modal for 3 seconds then navigate to Explore
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate(`/explore?vibe=${formData.vibe || selectedVibe}`);
    }, 3000);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>PLAN YOUR JOURNEY</span>
        <h1 className={styles.pageTitle}>Create Your Trip</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.pageSubtitle}>Build your perfect travel experience step by step</p>
      </div>

      {/* Form Container */}
      <div className={styles.pageContainer}>
        <div className={styles.createTripCard}>
          {/* Left Side - Image */}
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
                  {formData.vibe ? CREATE_TRIP_VIBES.find(v => v.value === formData.vibe)?.label : "Select your vibe"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className={styles.formSide}>
            {/* Progress Bar */}
            <div className={styles.progressBar}>
              {steps.map((step, index) => (
                <div key={step.id} className={styles.progressStep}>
                  <div 
                    className={`${styles.stepCircle} ${currentStep >= step.id ? styles.stepActive : ''} ${currentStep > step.id ? styles.stepCompleted : ''}`}
                  >
                    {currentStep > step.id ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      <i className={step.icon}></i>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`${styles.stepLine} ${currentStep > step.id ? styles.lineCompleted : ''}`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.stepInfo}>
              <h2 className={styles.stepTitle}>{steps[currentStep-1].title}</h2>
              <p className={styles.stepDescription}>Step {currentStep} of {steps.length}</p>
            </div>

            <div className={styles.formContent}>
              {currentStep === 1 && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Trip Name</label>
                  <input
                    type="text"
                    name="tripName"
                    value={formData.tripName}
                    onChange={handleInputChange}
                    className={`input ${errors.tripName ? 'is-danger' : ''}`}
                    placeholder="e.g., Summer in Italy 2025"
                  />
                  {errors.tripName && <p className="help is-danger">{errors.tripName}</p>}
                </div>
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
                    {errors.startDate && <p className="help is-danger">{errors.startDate}</p>}
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
                    {errors.endDate && <p className="help is-danger">{errors.endDate}</p>}
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
                    {errors.travelers && <p className="help is-danger">{errors.travelers}</p>}
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Select Your Travel Vibe</label>
                  <div className="select is-fullwidth">
                    <select
                      name="vibe"
                      value={formData.vibe}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose a vibe...</option>
                      {CREATE_TRIP_VIBES.map(v => (
                        <option key={v.value} value={v.value}>{v.label} - {v.desc}</option>
                      ))}
                    </select>
                  </div>
                  {errors.vibe && <p className="help is-danger">{errors.vibe}</p>}
                </div>
              )}
            </div>

            <div className={styles.navigationButtons}>
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className={`button ${styles.prevButton}`}>
                  <span className="icon"><i className="fas fa-arrow-left"></i></span>
                  <span>Back</span>
                </button>
              )}
              
              <button 
                type="button" 
                onClick={nextStep} 
                className={`button is-primary ${styles.nextButton}`}
                style={{ marginLeft: currentStep === 1 ? 'auto' : '0' }}
              >
                <span>{currentStep === steps.length ? 'Create Trip' : 'Next Step'}</span>
                <span className="icon"><i className="fas fa-arrow-right"></i></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={`modal is-active ${styles.successModal}`}>
          <div className="modal-background" onClick={() => setShowSuccessModal(false)} style={{ background: 'rgba(0,0,0,0.6)' }}></div>
          <div className="modal-content">
            <div className={styles.modalCard}>
              <div className={styles.successIcon}>
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className={styles.successTitle}>Trip Created Successfully!</h2>
              <p className={styles.successMessage}>
                Your trip <strong>"{formData.tripName}"</strong> has been created.
              </p>
              <div className={styles.tripSummary}>
                <div className={styles.summaryItem}>
                  <i className="fas fa-calendar-alt"></i>
                  <span>{formData.startDate?.toLocaleDateString()} - {formData.endDate?.toLocaleDateString()}</span>
                </div>
                <div className={styles.summaryItem}>
                  <i className="fas fa-users"></i>
                  <span>{formData.travelers} {formData.travelers === '1' ? 'Traveler' : 'Travelers'}</span>
                </div>
                <div className={styles.summaryItem}>
                  <i className="fas fa-heart"></i>
                  <span>{CREATE_TRIP_VIBES.find(v => v.value === formData.vibe)?.label} Vibe</span>
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
