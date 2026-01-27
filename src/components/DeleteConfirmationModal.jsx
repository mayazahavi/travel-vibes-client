import modalStyles from "./DeleteConfirmationModal.module.css";
import { FaTrash } from "react-icons/fa";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className={`modal is-active ${modalStyles.modal}`}>
      <div
        className={`modal-background ${modalStyles.backdrop}`}
        onClick={onClose}
      ></div>
      <div
        className={`modal-content ${modalStyles.content}`}
      >
        <div
          className={`box ${modalStyles.box}`}
        >
          <div
            className={modalStyles.icon}
          >
            <FaTrash />
          </div>

          <h3
            className={`title is-4 ${modalStyles.title}`}
          >
            {title || "Delete Trip?"}
          </h3>

          <p
            className={`subtitle is-6 ${modalStyles.subtitle}`}
          >
            {message ||
              "Are you sure you want to delete this trip? This action cannot be undone."}
          </p>

          <div className={modalStyles.actions}>
            <button
              className={`button is-rounded ${modalStyles.cancelButton}`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`button is-danger is-rounded ${modalStyles.deleteButton}`}
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
}

export default DeleteConfirmationModal;
