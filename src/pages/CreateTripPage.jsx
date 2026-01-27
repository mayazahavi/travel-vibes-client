import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/CreateTripPage.module.css";
import { VIBE_IMAGES, CREATE_TRIP_VIBES } from "../constants/vibes";
import ProgressBar from "../components/ProgressBar";
import { createTripAsync } from "../store/slices/tripsSlice";
import TripDetailsStep from "../components/create-trip/TripDetailsStep";
import TravelInfoStep from "../components/create-trip/TravelInfoStep";
import PreferencesStep from "../components/create-trip/PreferencesStep";
import TripSuccessModal from "../components/create-trip/TripSuccessModal";
import Toast from "../components/Toast";
import useForm from "../hooks/useForm";
import { validateTrip } from "../utils/validation";

function CreateTripPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedVibe = searchParams.get("vibe");

  const [currentStep, setCurrentStep] = useState(1);
  const {
    values: formData,
    errors,
    handleChange,
    setValues: setFormData,
    setErrors,
  } = useForm({
    tripName: "",
    destination: "",
    startDate: null,
    endDate: null,
    travelers: "",
    vibe: selectedVibe || "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Clear destination error when it updates (handled via setFormData in child)
  useEffect(() => {
    if (formData.destination && errors.destination) {
      setErrors((prev) => ({ ...prev, destination: "" }));
    }
  }, [formData.destination, errors.destination, setErrors]);

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

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const tripErrors = validateTrip({
      name: formData.tripName,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      vibe: formData.vibe,
      travelers: Number(formData.travelers),
    });

    const mappedErrors = {
      tripName: tripErrors.name,
      destination: tripErrors.destination,
      startDate: tripErrors.startDate,
      endDate: tripErrors.endDate,
      vibe: tripErrors.vibe,
      travelers: tripErrors.travelers,
    };

    const stepFieldMap = {
      1: ["tripName", "destination"],
      2: ["startDate", "endDate", "travelers"],
      3: ["vibe"],
    };

    const stepErrors = {};
    stepFieldMap[currentStep].forEach((field) => {
      if (mappedErrors[field]) {
        stepErrors[field] = mappedErrors[field];
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
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

  const handleSubmit = async () => {
    console.log("Trip Created Successfully:", formData);

    try {
      // Use async thunk to create trip on server
      await dispatch(
        createTripAsync({
          name: formData.tripName,
          destination: formData.destination,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
          vibe: formData.vibe,
          travelers: parseInt(formData.travelers, 10),
        }),
      ).unwrap();

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/explore?vibe=${formData.vibe || selectedVibe}`);
        setTimeout(() => window.scrollTo(0, 0), 100);
      }, 3000);
    } catch (error) {
      console.error("Failed to create trip:", error);
      setToast({
        message: "Failed to create trip. Please try again.",
        type: "error",
      });
    }
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
                <TripDetailsStep
                  formData={formData}
                  onChange={handleChange}
                  errors={errors}
                  setFormData={setFormData}
                />
              )}
              {currentStep === 2 && (
                <TravelInfoStep
                  formData={formData}
                  onChange={handleChange}
                  onDateChange={handleDateChange}
                  errors={errors}
                />
              )}
              {currentStep === 3 && (
                <PreferencesStep
                  formData={formData}
                  onChange={handleChange}
                  errors={errors}
                />
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
                className={`button is-primary ${styles.nextButton} ${currentStep === 1 ? styles.nextButtonAuto : ""}`}
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
      <TripSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        tripName={formData.tripName}
        startDate={formData.startDate}
        endDate={formData.endDate}
        travelers={formData.travelers}
        vibeLabel={
          CREATE_TRIP_VIBES.find((v) => v.value === formData.vibe)?.label
        }
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default CreateTripPage;
