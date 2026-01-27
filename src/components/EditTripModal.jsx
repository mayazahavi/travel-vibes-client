import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSave, FaCalendarAlt, FaPen, FaUserFriends } from "react-icons/fa";
import useForm from "../hooks/useForm";
import styles from "./EditTripModal.module.css";
import { validateTrip } from "../utils/validation";

function EditTripModal({ isOpen, onClose, onSave, trip }) {
    const {
        values: formData,
        errors,
        handleChange,
        setValues: setFormData,
        setErrors,
    } = useForm({
        name: "",
        startDate: null,
        endDate: null,
        travelers: 1,
    });
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        if (trip) {
            setFormData({
                name: trip.name || "",
                startDate: trip.startDate ? new Date(trip.startDate) : null,
                endDate: trip.endDate ? new Date(trip.endDate) : null,
                travelers: trip.travelers || 1,
            });
        }
    }, [trip, setFormData]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);

        const validationErrors = validateTrip({
            name: formData.name,
            destination: trip?.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            vibe: trip?.vibe,
            travelers: Number(formData.travelers),
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await onSave(trip._id, {
                name: formData.name,
                startDate: formData.startDate?.toISOString(),
                endDate: formData.endDate?.toISOString(),
                travelers: formData.travelers,

                // required fields for server validation
                destination: trip.destination,
                vibe: trip.vibe,
                description: trip.description ?? "",
            });

            onClose();
        } catch (error) {
            setServerError(error.message || "Failed to update trip");
        }
    };

    const handleStartDateChange = (date) => {
        // If new start date is after current end date, clear end date
        if (formData.endDate && date > formData.endDate) {
            setFormData({ ...formData, startDate: date, endDate: null });
        } else {
            setFormData({ ...formData, startDate: date });
        }
        if (errors.startDate || errors.endDate) {
            setErrors((prev) => ({ ...prev, startDate: "", endDate: "" }));
        }
    };

    const handleEndDateChange = (date) => {
        setFormData({ ...formData, endDate: date });
        if (errors.endDate) {
            setErrors((prev) => ({ ...prev, endDate: "" }));
        }
    };

    const handleFieldChange = (e) => {
        setServerError(null);
        handleChange(e);
    };

    return (
        <div className={`modal is-active ${styles.modal}`}>
            {/* Backdrop */}
            <div
                className={`modal-background ${styles.backdrop}`}
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`modal-content ${styles.modalContent}`}>
                <div className={`box ${styles.modalBox}`}>

                    {/* Header */}
                    <div className={styles.header}>
                        <h3 className={`title is-4 mb-0 ${styles.headerTitle}`}>
                            <span className="icon-text">
                                <span className={`icon has-text-info mr-2 ${styles.headerIcon}`}>
                                    <FaPen size={18} />
                                </span>
                                <span>Edit Trip Details</span>
                            </span>
                        </h3>
                        <button
                            className={`delete is-medium ${styles.closeButton}`}
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* Form Body */}
                    <div className={styles.body}>
                        <form onSubmit={handleSubmit}>
                            {serverError && (
                                <div className="notification is-danger is-light mb-4">
                                    {serverError}
                                </div>
                            )}

                            {/* Trip Name Field */}
                            <div className="field mb-5">
                                <label className={`label ${styles.label}`}>
                                    Trip Name
                                </label>
                                <div className="control has-icons-left">
                                    <input
                                        className={`input is-medium ${styles.input}`}
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFieldChange}
                                        required
                                    />
                                    <span className={`icon is-left is-medium ${styles.inputIcon}`}>
                                        <FaPen size={14} />
                                    </span>
                                </div>
                                {errors.name && (
                                    <p className="help is-danger">{errors.name}</p>
                                )}
                            </div>

                            {/* Travelers Field */}
                            <div className="field mb-5">
                                <label className={`label ${styles.label}`}>
                                    Travelers
                                </label>
                                <div className="control has-icons-left">
                                    <input
                                        className={`input is-medium ${styles.input}`}
                                        type="number"
                                        name="travelers"
                                        min="1"
                                        value={formData.travelers}
                                        onChange={handleFieldChange}
                                        required
                                    />
                                    <span className={`icon is-left is-medium ${styles.inputIcon}`}>
                                        <FaUserFriends size={14} />
                                    </span>
                                </div>
                                {errors.travelers && (
                                    <p className="help is-danger">{errors.travelers}</p>
                                )}
                            </div>

                            {/* Dates Field - Row */}
                            <div className="field mb-6">
                                <label className={`label ${styles.label}`}>
                                    Travel Dates
                                </label>
                                <div className="columns is-mobile is-variable is-2">
                                    <div className="column is-6">
                                        <div className="control has-icons-left">
                                            <DatePicker
                                                selected={formData.startDate}
                                                onChange={handleStartDateChange}
                                                className="input"
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Start Date"
                                                minDate={new Date()}
                                                customInput={
                                                    <input className={styles.dateInput} />
                                                }
                                            />
                                            <span className={`icon is-left ${styles.dateIcon}`}>
                                                <FaCalendarAlt />
                                            </span>
                                        </div>
                                        {errors.startDate && (
                                            <p className="help is-danger">{errors.startDate}</p>
                                        )}
                                    </div>
                                    <div className="column is-6">
                                        <div className="control has-icons-left">
                                            <DatePicker
                                                selected={formData.endDate}
                                                onChange={handleEndDateChange}
                                                className="input"
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="End Date"
                                                minDate={formData.startDate || new Date()}
                                                customInput={
                                                    <input className={styles.dateInput} />
                                                }
                                            />
                                            <span className={`icon is-left ${styles.dateIcon}`}>
                                                <FaCalendarAlt />
                                            </span>
                                        </div>
                                        {errors.endDate && (
                                            <p className="help is-danger">{errors.endDate}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="field is-grouped is-grouped-right">
                                <div className="control">
                                    <button
                                        type="button"
                                        className={`button is-light has-text-grey ${styles.cancelButton}`}
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className="control">
                                    <button
                                        type="submit"
                                        className={`button is-info ${styles.submitButton}`}
                                    >
                                        <span className="icon is-small mr-2">
                                            <FaSave />
                                        </span>
                                        <span>Save Changes</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditTripModal;
