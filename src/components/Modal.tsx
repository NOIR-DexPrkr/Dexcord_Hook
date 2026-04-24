import React from 'react';
import { translations } from '../translations';
import type { Language } from '../translations';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'info' | 'danger' | 'warning';
  language?: Language;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel, 
  cancelLabel, 
  onConfirm, 
  onCancel,
  type = 'info',
  language = 'es'
}) => {
  const t = translations[language];

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getAccentColor = () => {
    if (type === 'danger') return '#ef4444';
    if (type === 'warning') return '#f59e0b';
    return 'var(--text-primary)';
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content glass fade-in" onClick={(e) => e.stopPropagation()} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', maxWidth: '400px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{title}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.5' }}>{message}</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8125rem' }} onClick={onCancel}>
            {cancelLabel || t.modal_cancel || 'Cancel'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onConfirm}
            style={{ 
              background: getAccentColor(), 
              color: type === 'info' ? 'var(--bg-color)' : '#fff',
              padding: '0.4rem 0.8rem',
              fontSize: '0.8125rem',
              border: type === 'info' ? 'none' : `1px solid ${getAccentColor()}`
            }}
          >
            {confirmLabel || t.modal_confirm || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
