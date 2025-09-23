import React, { useRef, useState } from 'react';
import { Photo } from '../../../../models/Photo';
import { getPhotoSrc } from '../../../../utils/photoUtils';
import { useProjects } from '../../../../contexts/ProjectContext';
import PhotoSourceModal from '../../../report/new/components/PhotoSourceModal';
import PhotoEditor from '../../../report/new/components/PhotoEditor';
import '../../../report/new/ReportGenerationPage.css';
import './PhotoTab.css';

interface PhotoTabProps {
  photos: Photo[];
  projectId: string;
}

const PhotoTab: React.FC<PhotoTabProps> = ({ photos, projectId }) => {
  const { updateProject } = useProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [showPhotoSourceModal, setShowPhotoSourceModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleImportPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const photo: Photo = {
        file: file,
        subtitle: editingPhoto?.subtitle || '',
        lastModified: new Date()
      };
      setEditingPhoto(photo);
      setShowPhotoSourceModal(false);
    }
    
    // Reset the file input so the same file can be selected again
    event.target.value = '';
  };

  const handleSavePhoto = (editedPhoto: Photo) => {
    const updatedPhotos = [...photos];
    
    if (editingPhotoIndex !== null) {
      // Editing existing photo
      updatedPhotos[editingPhotoIndex] = editedPhoto;
    } else {
      // Adding new photo
      updatedPhotos.push(editedPhoto);
    }

    updateProject(projectId, { photos: updatedPhotos });
    setEditingPhoto(null);
    setEditingPhotoIndex(null);
  };

  const handlePhotoEdit = (photo: Photo, index: number) => {
    setEditingPhoto(photo);
    setEditingPhotoIndex(index);
  };

  const handlePhotoDelete = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    updateProject(projectId, { photos: updatedPhotos });
  };

  const handleCancelPhoto = () => {
    setEditingPhoto(null);
    setEditingPhotoIndex(null);
  };

  return (
    <div className="photos-section">
      <div className="photos-header">
        <h3>Fotos do Projeto</h3>
        <div className="photos-actions">
          <button 
            className="project-page-btn-secondary"
            onClick={() => setShowPhotoSourceModal(true)}
          >
            Adicionar
          </button>
        </div>
      </div>
      
      {photos.length === 0 ? (
        <div className="no-photos-state">
          <div className="no-photos-icon">📸</div>
          <h3>Nenhuma foto adicionada</h3>
          <p>Aqui você pode conferir as fotos do projeto.</p>
          <p>Adicione fotos através do botão &quot;Adicionar&quot; acima, ou através de &quot;Novo Relatório&quot;</p>
        </div>
      ) : (
        <div className="photos-grid">
          {photos.map((photo, index) => (
            <div key={index} className="photo-card">
              <div className="photo-image">
                <img src={getPhotoSrc(photo)} alt={photo.subtitle} />
                <div className="photo-overlay">
                  <button 
                    className="photo-action-btn edit-btn"
                    onClick={() => handlePhotoEdit(photo, index)}
                    title="Editar foto"
                  >
                    ✏️
                  </button>
                  <button 
                    className="photo-action-btn delete-btn"
                    onClick={() => handlePhotoDelete(index)}
                    title="Excluir foto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="photo-info">
                <p className="photo-subtitle">{photo.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoCapture}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCapture}
        style={{ display: 'none' }}
      />

      {/* Photo Source Selection Modal */}
      <PhotoSourceModal
        isOpen={showPhotoSourceModal}
        onClose={() => setShowPhotoSourceModal(false)}
        onTakePhoto={handleTakePhoto}
        onImportPhoto={handleImportPhoto}
      />

      {/* Photo Editor Modal */}
      <PhotoEditor
        editingPhoto={editingPhoto}
        onSavePhoto={handleSavePhoto}
        onCancel={handleCancelPhoto}
      />
    </div>
  );
};

export default PhotoTab;
