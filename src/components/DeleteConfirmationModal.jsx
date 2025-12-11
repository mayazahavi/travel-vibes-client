import styles from '../styles/ExplorePage.module.css'; // Reusing styles or creating inline overrides
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className={`modal is-active`} style={{ zIndex: 9999 }}>
      <div className="modal-background" onClick={onClose} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}></div>
      <div className="modal-content" style={{ padding: '20px', maxWidth: '400px', width: '90%' }}>
        <div className="box" style={{ 
          borderRadius: '20px', 
          padding: '30px', 
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: '#fee2e2', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#ef4444',
            fontSize: '24px'
          }}>
            <FaTrash />
          </div>
          
          <h3 className="title is-4" style={{ marginBottom: '10px', color: '#1f2937' }}>
            {title || 'Delete Trip?'}
          </h3>
          
          <p className="subtitle is-6" style={{ color: '#6b7280', marginBottom: '30px' }}>
            {message || 'Are you sure you want to delete this trip? This action cannot be undone.'}
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              className="button is-rounded" 
              onClick={onClose}
              style={{ flex: 1, fontWeight: '600' }}
            >
              Cancel
            </button>
            <button 
              className="button is-danger is-rounded" 
              onClick={onConfirm}
              style={{ flex: 1, fontWeight: '600', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
}

export default DeleteConfirmationModal;

