'use client';

import React from 'react';
import type { Photo } from '../../../../models/Photo';
import { getPhotoSrc } from '../../../../utils/photoUtils';

interface PhotoEditorProps {
  editingPhoto: Photo | null;
  onSavePhoto: (editedPhoto: Photo) => void;
  onCancel: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({
  editingPhoto,
  onSavePhoto,
  onCancel
}) => {
  const [photo, setPhoto] = React.useState<Photo | null>(editingPhoto);

  if (!editingPhoto) return null;

  const handleSave = () => {
    if (photo) {
      onSavePhoto(photo);
    }
  };

  return (
    <div className="photo-editor-modal">
      <div className="photo-editor-content">
        <div className="photo-editor-header">
          <h3>Editar Foto</h3>
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="photo-editor-body">
          <div className="photo-preview">
            <img src={getPhotoSrc(photo!)} alt="Preview" />
          </div>
          
          <div className="photo-edit-form">
            <div className="form-group">
              <label>Legenda da Foto</label>
              <input
                type="text"
                value={photo?.subtitle}
                onChange={(e) => setPhoto({
                  ...photo!,
                  subtitle: e.target.value
                })}
                placeholder="Digite a legenda da foto"
              />
            </div>
          </div>

          <div className="photo-editor-actions">
            <button className="btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
