'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import DraggableList from './DraggableList';
import ComingSoonModal from '../../../../components/ComingSoonModal';
import type { ReportPage } from '../../../../models/ReportPage';
import { getPhotoSrc } from '../../../../utils/photoUtils';

interface PagesListProps {
  pages: ReportPage[];
  onEditPage: (page: ReportPage) => void;
  onDeletePage: (pageId: string) => void;
  onAddPage: () => void;
  onReorderPages: (reorderedItems: { id: string; content: React.ReactNode }[]) => void;
  onContinue: () => void;
}

const PagesList: React.FC<PagesListProps> = ({
  pages,
  onEditPage,
  onDeletePage,
  onAddPage,
  onReorderPages,
  onContinue
}) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  return (
    <div className="step-content">
      {pages.length === 0 ? (
        <div className="no-pages-state">
          <div className="no-pages-icon">📄</div>
          <h3>Nenhuma página adicionada</h3>
          <p>Comece criando a primeira página do seu relatório.</p>
          <div className="no-pages-actions">
            <button className="btn-primary" onClick={onAddPage}>
              Criar Primeira Página
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="pages-list">
            <DraggableList
              items={pages.map(page => ({
                id: page.id,
                content: (
                  <div className="page-content">
                    <div className="page-header">
                      <div className="page-info">
                        <h3 className="page-name">{page.title}</h3>
                        {page.content && (
                          <p className="page-description-left">{page.content}</p>
                        )}
                      </div>
                      <div className="page-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => onEditPage(page)}
                          title="Editar página"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => onDeletePage(page.id)}
                          title="Excluir página"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    {page.photos.length > 0 && (
                      <div className="page-photos">
                        <div className="photos-grid">
                          {page.photos.slice(0, 4).map((photo, index) => (
                            <div key={index} className="photo-thumbnail">
                              <Image 
                                src={getPhotoSrc(photo) || ''} 
                                alt={`Preview ${index + 1}`}
                                width={100}
                                height={100}
                                style={{ objectFit: 'cover' }}
                              />
                              {index === 3 && page.photos.length > 4 && (
                                <div className="more-count">+{page.photos.length - 4}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }))}
              onReorder={onReorderPages}
            />
          </div>

          <div className="add-page-section">
            <button className="btn-primary add-page-btn" onClick={onAddPage}>
              Adicionar Página
            </button>
            <button 
              className="btn-secondary preview-btn" 
              onClick={() => setShowPreviewModal(true)}
              title="Visualizar relatório"
            >
              👁️ Pré-visualizar
            </button>
          </div>
        </>
      )}

      <div className="step-actions">
        <button 
          className="btn-primary"
          onClick={onContinue}
          disabled={pages.length === 0}
        >
          Continuar
        </button>
      </div>

      <ComingSoonModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Em breve!"
        message="A funcionalidade disponível em breve!"
      />
    </div>
  );
};

export default PagesList;
