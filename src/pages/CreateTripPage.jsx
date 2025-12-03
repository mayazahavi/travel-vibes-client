// src/pages/CreateTripPage.js
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/CreateTripPage.module.css";

const vibeImages = {
  foodie: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
  culture: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
  nature: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
  urban: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=80",
  romantic: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=1000&q=80",
  nightlife: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80"
};

function CreateTripPage() {
  const [searchParams] = useSearchParams();
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

  const steps = [
    { id: 1, title: "Trip Details" },
    { id: 2, title: "Travel Info" },
    { id: 3, title: "Preferences" }
  ];

  const vibes = [
    { value: "foodie", label: "🍽️ Foodie", desc: "Culinary adventures" },
    { value: "culture", label: "🏛️ Culture", desc: "History & art" },
    { value: "nature", label: "🏞️ Nature", desc: "Outdoor scenic beauty" },
    { value: "urban", label: "🌆 Urban", desc: "City vibes & shopping" },
    { value: "romantic", label: "💑 Romantic", desc: "Couples getaways" },
    { value: "nightlife", label: "🎉 Nightlife", desc: "Parties & shows" }
  ];

  // Get current image based on selected vibe or default
  const getCurrentImage = () => {
    const vibe = formData.vibe || selectedVibe;
    if (vibe && vibeImages[vibe]) {
      return vibeImages[vibe];
    }
    return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"; // Default travel image
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
    alert(`Trip "${formData.tripName}" created! Check console for details.`);
  };

  return (
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
              <h2 className={styles.vibeQuote}>
                {formData.vibe 
                  ? `Experience the ${formData.vibe} lifestyle.`
                  : "Plan your next great adventure."}
              </h2>
              <span className={styles.vibeTag}>
                {formData.vibe ? vibes.find(v => v.value === formData.vibe)?.label : "TRAVEL VIBES"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.header}>
            <h1 className={styles.title}>Create Your Dream Trip</h1>
            <p className={styles.subtitle}>Step {currentStep} of {steps.length}: {steps[currentStep-1].title}</p>
          </div>

          <div className={styles.progressDots}>
            {steps.map(step => (
              <div 
                key={step.id} 
                className={`${styles.dot} ${currentStep === step.id ? styles.dotActive : ''} ${currentStep > step.id ? styles.dotCompleted : ''}`}
              />
            ))}
          </div>

          <div className={styles.formContent}>
            {currentStep === 1 && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Give your trip a name</label>
                <div className="control has-icons-left">
                  <input
                    type="text"
                    name="tripName"
                    value={formData.tripName}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="e.g., Summer in Italy 2025"
                  />
                  <span className="icon is-small is-left" style={{position: 'absolute', left: '12px', top: '12px', color: '#dbdbdb'}}>
                    <i className="fas fa-map-marked-alt"></i>
                  </span>
                </div>
                {errors.tripName && <p className={styles.errorText}>{errors.tripName}</p>}
              </div>
            )}

            {currentStep === 2 && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Start Date</label>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    className={styles.input}
                    placeholderText="Select start date"
                    minDate={new Date()}
                    wrapperClassName={styles.datePickerWrapper}
                  />
                  {errors.startDate && <p className={styles.errorText}>{errors.startDate}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>End Date</label>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    className={styles.input}
                    placeholderText="Select end date"
                    minDate={formData.startDate || new Date()}
                    wrapperClassName={styles.datePickerWrapper}
                  />
                  {errors.endDate && <p className={styles.errorText}>{errors.endDate}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Number of Travelers</label>
                  <input
                    type="number"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="1"
                    placeholder="How many people?"
                  />
                  {errors.travelers && <p className={styles.errorText}>{errors.travelers}</p>}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Select Vibe</label>
                <div className="select is-fullwidth">
                  <select
                    name="vibe"
                    value={formData.vibe}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">Choose a vibe...</option>
                    {vibes.map(v => (
                      <option key={v.value} value={v.value}>{v.label} - {v.desc}</option>
                    ))}
                  </select>
                </div>
                {errors.vibe && <p className={styles.errorText}>{errors.vibe}</p>}
              </div>
            )}
          </div>

          <div className={styles.navigationButtons}>
            {currentStep > 1 ? (
              <button type="button" onClick={prevStep} className={`${styles.navButton} ${styles.prevButton}`}>
                Back
              </button>
            ) : (
              <div></div> // Spacer
            )}
            
            <button type="button" onClick={nextStep} className={`${styles.navButton} ${styles.nextButton}`}>
              {currentStep === steps.length ? 'Create Trip' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTripPage;
