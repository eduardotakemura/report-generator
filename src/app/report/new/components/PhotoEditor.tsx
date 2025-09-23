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
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  // Update local state when editingPhoto prop changes
  React.useEffect(() => {
    if (editingPhoto) {
      // Ensure File object is preserved by creating a new object with all properties
      const preservedPhoto: Photo = {
        subtitle: editingPhoto.subtitle,
        lastModified: editingPhoto.lastModified,
        file: editingPhoto.file, // Explicitly preserve the File object
        url: editingPhoto.url
      };
      setPhoto(preservedPhoto);
      
      // Generate image source
      const src = getPhotoSrc(preservedPhoto);
      setImageSrc(src || null);
      setIsImageLoading(true);
    } else {
      setPhoto(null);
      setImageSrc(null);
      setIsImageLoading(false);
    }
  }, [editingPhoto]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageSrc(null);
  };

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
            {isImageLoading && (
              <div className="image-loading">
                <div className="loading-spinner">⏳</div>
                <p>Carregando imagem...</p>
              </div>
            )}
            {imageSrc && (
              <img 
                src={imageSrc} 
                alt="Preview" 
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: isImageLoading ? 'none' : 'block' }}
              />
            )}
            {!imageSrc && !isImageLoading && (
              <div className="image-error">
                <div className="error-icon">❌</div>
                <p>Erro ao carregar imagem</p>
              </div>
            )}
          </div>
          
          <div className="photo-edit-form">
            <div className="form-group">
              <label>Legenda da Foto</label>
              <input
                type="text"
                value={photo?.subtitle}
                onChange={(e) => {
                  if (photo) {
                    const updatedPhoto = {
                      subtitle: e.target.value,
                      lastModified: photo.lastModified,
                      file: photo.file, // Explicitly preserve the File object
                      url: photo.url
                    };
                    setPhoto(updatedPhoto);
                    
                    // Update image source if needed
                    const newSrc = getPhotoSrc(updatedPhoto);
                    setImageSrc(newSrc || null);
                  }
                }}
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
