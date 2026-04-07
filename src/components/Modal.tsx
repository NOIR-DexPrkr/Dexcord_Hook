import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'info' | 'danger' | 'warning';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel', 
  onConfirm, 
  onCancel,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getAccentColor = () => {
    if (type === 'danger') return '#ef4444';
    if (type === 'warning') return '#f59e0b';
    return 'var(--accent-color)';
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content glass fade-in" onClick={(e) => e.stopPropagation()} style={{ borderTop: `4px solid ${getAccentColor()}` }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{title}</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{message}</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button 
            className="btn" 
            onClick={onConfirm}
            style={{ 
              background: getAccentColor(), 
              color: '#fff',
              boxShadow: type === 'danger' ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 0 20px var(--glow-color)'
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
