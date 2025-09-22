'use client';

import React from 'react';
import './ComingSoonModal.css';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  title = "Em Breve",
  message = "Esta funcionalidade estará disponível em breve!"
}) => {
  if (!isOpen) return null;

  return (
    <div className="coming-soon-modal-overlay" onClick={onClose}>
      <div className="coming-soon-modal" onClick={(e) => e.stopPropagation()}>
        <div className="coming-soon-modal-header">
          <h2>{title}</h2>
          <button className="coming-soon-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="coming-soon-modal-body">
          <div className="coming-soon-icon">🚀</div>
          <p className="coming-soon-message">{message}</p>
        </div>
        
        <div className="coming-soon-modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
