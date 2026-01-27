import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes, FaSave, FaCalendarAlt, FaPen, FaUserFriends } from "react-icons/fa";

function EditTripModal({ isOpen, onClose, onSave, trip }) {
    const [formData, setFormData] = useState({
        name: "",
        startDate: null,
        endDate: null,
        travelers: 1,
    });

    useEffect(() => {
        if (trip) {
            setFormData({
                name: trip.name || "",
                startDate: trip.startDate ? new Date(trip.startDate) : null,
                endDate: trip.endDate ? new Date(trip.endDate) : null,
                travelers: trip.travelers || 1,
            });
        }
    }, [trip]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
       onSave(trip._id, {
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
    };

    const handleStartDateChange = (date) => {
        // If new start date is after current end date, clear end date
        if (formData.endDate && date > formData.endDate) {
            setFormData({ ...formData, startDate: date, endDate: null });
        } else {
            setFormData({ ...formData, startDate: date });
        }
    };

    return (
        <div className="modal is-active" style={{ zIndex: 1000 }}>
            {/* Backdrop */}
            <div
                className="modal-background"
                onClick={onClose}
                style={{
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                    backdropFilter: "blur(8px)"
                }}
            ></div>

            {/* Modal Content */}
            <div className="modal-content" style={{ maxWidth: "500px", borderRadius: "24px", overflow: "visible" }}>
                <div className="box" style={{
                    padding: "0",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    background: "rgba(255, 255, 255, 0.95)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}>

                    {/* Header */}
                    <div style={{
                        padding: "24px 32px",
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "linear-gradient(to right, #ffffff, #f8fafc)",
                        borderTopLeftRadius: "24px",
                        borderTopRightRadius: "24px"
                    }}>
                        <h3 className="title is-4 mb-0" style={{
                            color: "#0f172a",
                            fontWeight: "700",
                            letterSpacing: "-0.5px"
                        }}>
                            <span className="icon-text">
                                <span className="icon has-text-info mr-2">
                                    <FaPen size={18} />
                                </span>
                                <span>Edit Trip Details</span>
                            </span>
                        </h3>
                        <button
                            className="delete is-medium"
                            onClick={onClose}
                            style={{ transition: "background-color 0.2s" }}
                        ></button>
                    </div>

                    {/* Form Body */}
                    <div style={{ padding: "32px" }}>
                        <form onSubmit={handleSubmit}>

                            {/* Trip Name Field */}
                            <div className="field mb-5">
                                <label className="label" style={{
                                    color: "#64748b",
                                    fontSize: "0.85rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}>
                                    Trip Name
                                </label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input is-medium"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        style={{
                                            borderRadius: "12px",
                                            border: "2px solid #e2e8f0",
                                            boxShadow: "none",
                                            fontSize: "1rem",
                                            color: "#334155",
                                            transition: "all 0.2s"
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                                    />
                                    <span className="icon is-left is-medium" style={{ color: "#94a3b8" }}>
                                        <FaPen size={14} />
                                    </span>
                                </div>
                            </div>

                            {/* Travelers Field */}
                            <div className="field mb-5">
                                <label className="label" style={{
                                    color: "#64748b",
                                    fontSize: "0.85rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}>
                                    Travelers
                                </label>
                                <div className="control has-icons-left">
                                    <input
                                        className="input is-medium"
                                        type="number"
                                        min="1"
                                        value={formData.travelers}
                                        onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                                        required
                                        style={{
                                            borderRadius: "12px",
                                            border: "2px solid #e2e8f0",
                                            boxShadow: "none",
                                            fontSize: "1rem",
                                            color: "#334155",
                                            transition: "all 0.2s"
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = "#0ea5e9"}
                                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                                    />
                                    <span className="icon is-left is-medium" style={{ color: "#94a3b8" }}>
                                        <FaUserFriends size={14} />
                                    </span>
                                </div>
                            </div>

                            {/* Dates Field - Row */}
                            <div className="field mb-6">
                                <label className="label" style={{
                                    color: "#64748b",
                                    fontSize: "0.85rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}>
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
                                                    <input style={{
                                                        borderRadius: "12px",
                                                        border: "2px solid #e2e8f0",
                                                        width: "100%",
                                                        padding: "10px 10px 10px 40px",
                                                        cursor: "pointer",
                                                        color: "#334155",
                                                        fontWeight: "500"
                                                    }} />
                                                }
                                            />
                                            <span className="icon is-left" style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "12px",
                                                transform: "translateY(-50%)",
                                                zIndex: 10,
                                                color: "#0ea5e9"
                                            }}>
                                                <FaCalendarAlt />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="column is-6">
                                        <div className="control has-icons-left">
                                            <DatePicker
                                                selected={formData.endDate}
                                                onChange={(date) => setFormData({ ...formData, endDate: date })}
                                                className="input"
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="End Date"
                                                minDate={formData.startDate || new Date()}
                                                customInput={
                                                    <input style={{
                                                        borderRadius: "12px",
                                                        border: "2px solid #e2e8f0",
                                                        width: "100%",
                                                        padding: "10px 10px 10px 40px",
                                                        cursor: "pointer",
                                                        color: "#334155",
                                                        fontWeight: "500"
                                                    }} />
                                                }
                                            />
                                            <span className="icon is-left" style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "12px",
                                                transform: "translateY(-50%)",
                                                zIndex: 10,
                                                color: "#0ea5e9"
                                            }}>
                                                <FaCalendarAlt />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="field is-grouped is-grouped-right">
                                <div className="control">
                                    <button
                                        type="button"
                                        className="button is-light has-text-grey"
                                        onClick={onClose}
                                        style={{
                                            borderRadius: "12px",
                                            fontWeight: "600",
                                            padding: "0 20px",
                                            height: "44px",
                                            background: "#f1f5f9",
                                            border: "none"
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className="control">
                                    <button
                                        type="submit"
                                        className="button is-info"
                                        style={{
                                            borderRadius: "12px",
                                            fontWeight: "600",
                                            padding: "0 24px",
                                            height: "44px",
                                            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                            border: "none",
                                            boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)"
                                        }}
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
