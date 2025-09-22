'use client';

import React from 'react';

interface PhotoSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onImportPhoto: () => void;
}

const PhotoSourceModal: React.FC<PhotoSourceModalProps> = ({
  isOpen,
  onClose,
  onTakePhoto,
  onImportPhoto
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Adicionar Foto</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="photo-source-options">
            <button 
              className="photo-source-btn"
              onClick={() => {
                onClose();
                onTakePhoto();
              }}
            >
              <div className="source-icon">📷</div>
              <div className="source-text">
                <h4>Tirar Foto</h4>
                <p>Use a câmera do dispositivo</p>
              </div>
            </button>
            <button 
              className="photo-source-btn"
              onClick={() => {
                onClose();
                onImportPhoto();
              }}
            >
              <div className="source-icon">📁</div>
              <div className="source-text">
                <h4>Importar Foto</h4>
                <p>Selecionar da galeria</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoSourceModal;
