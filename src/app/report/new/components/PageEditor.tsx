'use client';

import React, { useState } from 'react';
import type { ReportPage } from '../../../../models/ReportPage';
import type { Photo } from '../../../../models/Photo';
import { getPhotoSrc } from '../../../../utils/photoUtils';
import PhotoLayoutEditor from './PhotoLayoutEditor';

interface PageEditorProps {
  currentPage: ReportPage | null;
  pageEditMode: 'info' | 'photos';
  onPageChange: (page: ReportPage) => void;
  onSavePageInfo: () => void;
  onSavePage: () => void;
  onCancel: () => void;
  onPhotoEdit: (photo: Photo, index: number) => void;
  onDeletePhoto: (index: number) => void;
  onShowPhotoSourceModal: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({
  currentPage,
  pageEditMode,
  onPageChange,
  onSavePageInfo,
  onSavePage,
  onCancel,
  onPhotoEdit,
  onDeletePhoto,
  onShowPhotoSourceModal
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);

  if (!currentPage) return null;

  const handleEditClick = () => {
    setEditTitle(currentPage.title);
    setEditContent(currentPage.content || '');
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    onPageChange({
      ...currentPage,
      title: editTitle,
      content: editContent
    });
    setShowEditModal(false);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditTitle(currentPage.title);
    setEditContent(currentPage.content || '');
  };

  const handleLayoutClick = () => {
    setShowLayoutEditor(true);
  };

  const handleLayoutClose = () => {
    setShowLayoutEditor(false);
  };

  const handlePhotosLayoutChange = (layout: { columns: number; photoOrder: number[] }) => {
    onPageChange({
      ...currentPage,
      layout: layout
    });
  };

  return (
    <div className="step-content">
      {pageEditMode === 'photos' && (
        <div className="page-indicator">
          <div className="page-indicator-content">
            <div className="page-indicator-title">{currentPage.title}</div>
            {currentPage.content && (
              <div className="page-indicator-description">{currentPage.content}</div>
            )}
          </div>
          <button 
            className="page-indicator-edit-btn"
            onClick={handleEditClick}
            title="Editar informações da página"
          >
            ✏️
          </button>
        </div>
      )}

      {pageEditMode === 'info' && (
        <div className="page-editor">
          <div className="page-title-section">
            <label>Título da Página</label>
            <input
              type="text"
              value={currentPage.title}
              onChange={(e) => onPageChange({
                ...currentPage,
                title: e.target.value
              })}
              className="page-title-input"
              placeholder="Digite o título da página"
            />
          </div>

          <div className="page-content-section">
            <label>Descrição da Página</label>
            <textarea
              value={currentPage.content}
              onChange={(e) => onPageChange({
                ...currentPage,
                content: e.target.value
              })}
              className="page-content-input"
              placeholder="Descreva o conteúdo desta página..."
              rows={4}
            />
          </div>

          <div className="page-actions">
            <button className="btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={onSavePageInfo}>
              Continuar para Fotos
            </button>
          </div>
        </div>
      )}

      {pageEditMode === 'photos' && (
        <div className="page-editor">
          <div className="photos-section">
            <div className="photos-header">
              <h3>Fotos da Página</h3>
              <div className="photos-header-actions">
                <span className="photos-count">{currentPage.photos.length} fotos</span>
                {currentPage.photos.length > 0 && (
                  <button 
                    className="layout-btn"
                    onClick={handleLayoutClick}
                    title="Organizar layout das fotos"
                  >
                    📐 Organizar Layout
                  </button>
                )}
              </div>
            </div>

            <div className="page-editor-photos-grid">
              {currentPage.photos.map((photo, index) => (
                <div key={index} className="photo-card">
                  <div className="photo-preview">
                    <img src={getPhotoSrc(photo)} alt={`Foto ${index + 1}`} />
                    <div className="photo-overlay">
                      <button 
                        className="photo-action-btn edit-btn"
                        onClick={() => onPhotoEdit(photo, index)}
                        title="Editar foto"
                      >
                        ✏️
                      </button>
                      <button 
                        className="photo-action-btn delete-btn"
                        onClick={() => onDeletePhoto(index)}
                        title="Excluir foto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="photo-subtitle">
                    {photo.subtitle || 'Sem legenda'}
                  </div>
                </div>
              ))}
              
              <div className="add-photo-card" onClick={onShowPhotoSourceModal}>
                <div className="add-photo-content">
                  <div className="add-photo-icon">+</div>
                  <div className="add-photo-text">Adicionar Foto</div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-actions">
            <button className="btn-primary" onClick={onSavePage}>
              Salvar Página
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="edit-modal-overlay" onClick={handleEditCancel}>
          <div className="edit-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Editar Página</h3>
              <button 
                className="edit-modal-close"
                onClick={handleEditCancel}
              >
                ×
              </button>
            </div>
            
            <div className="edit-modal-body">
              <div className="form-group">
                <label>Título da Página</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="page-title-input"
                  placeholder="Digite o título da página"
                />
              </div>

              <div className="form-group">
                <label>Descrição da Página</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="page-content-input"
                  placeholder="Descreva o conteúdo desta página..."
                  rows={4}
                />
              </div>
            </div>

            <div className="edit-modal-actions">
              <button className="btn-secondary" onClick={handleEditCancel}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleEditSave}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Layout Editor Modal */}
      {showLayoutEditor && (
        <PhotoLayoutEditor
          photos={currentPage.photos}
          layout={currentPage.layout}
          onLayoutChange={handlePhotosLayoutChange}
          onClose={handleLayoutClose}
        />
      )}
    </div>
  );
};

export default PageEditor;
