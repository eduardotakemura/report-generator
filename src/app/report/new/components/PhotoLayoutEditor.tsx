'use client';

import React, { useState, useRef, useCallback } from 'react';
import type { Photo } from '../../../../models/Photo';
import { getPhotoSrc } from '../../../../utils/photoUtils';

interface PhotoLayoutEditorProps {
  photos: Photo[];
  layout: {
    columns: number;
    photoOrder: number[];
  };
  onLayoutChange: (layout: { columns: number; photoOrder: number[] }) => void;
  onClose: () => void;
}

interface DragItem {
  photo: Photo;
  index: number;
}

const PhotoLayoutEditor: React.FC<PhotoLayoutEditorProps> = ({
  photos,
  layout,
  onLayoutChange,
  onClose
}) => {
  const [gridColumns, setGridColumns] = useState(layout.columns);
  const [photoOrder, setPhotoOrder] = useState(layout.photoOrder.length > 0 ? layout.photoOrder : photos.map((_, index) => index));
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, photo: Photo, index: number) => {
    setDraggedItem({ photo, index });
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
    
    // Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      width: 120px;
      height: 90px;
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #3b82f6;
      font-weight: 600;
    `;
    dragImage.textContent = photo.subtitle || 'Foto';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 60, 45);
    
    // Clean up the drag image after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.index === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const newPhotoOrder = [...photoOrder];
    const [removed] = newPhotoOrder.splice(draggedItem.index, 1);
    newPhotoOrder.splice(dropIndex, 0, removed);
    
    setPhotoOrder(newPhotoOrder);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleColumnChange = (columns: number) => {
    setGridColumns(columns);
  };

  const handleSave = () => {
    onLayoutChange({
      columns: gridColumns,
      photoOrder: photoOrder
    });
    onClose();
  };

  // Smart merging logic
  const getPhotoLayout = () => {
    const orderedPhotos = photoOrder.map(index => photos[index]).filter(Boolean);
    const totalPhotos = orderedPhotos.length;
    const rows = Math.ceil(totalPhotos / gridColumns);
    const totalSlots = rows * gridColumns;
    
    const layout: Array<{ photo: Photo | null; span: number; isMerged: boolean }> = [];
    
    for (let i = 0; i < totalSlots; i++) {
      const photoIndex = Math.floor(i / gridColumns) * gridColumns + (i % gridColumns);
      const photo = orderedPhotos[photoIndex] || null;
      
      if (photo) {
        // Check if this photo should be merged (last photo in a row with empty slots)
        const isLastInRow = (i + 1) % gridColumns === 0;
        const isLastPhoto = photoIndex === totalPhotos - 1;
        const hasEmptySlotsAfter = (i + 1) % gridColumns !== 0 && photoIndex === totalPhotos - 1;
        
        if (isLastPhoto && hasEmptySlotsAfter) {
          const remainingSlots = gridColumns - ((i + 1) % gridColumns);
          layout.push({ photo, span: remainingSlots + 1, isMerged: true });
          // Skip the remaining slots
          i += remainingSlots;
        } else {
          layout.push({ photo, span: 1, isMerged: false });
        }
      } else {
        layout.push({ photo: null, span: 1, isMerged: false });
      }
    }
    
    return layout;
  };

  const renderGridSlot = (item: { photo: Photo | null; span: number; isMerged: boolean }, index: number) => {
    const isDragOver = dragOverIndex === index;
    const isDragged = draggedItem?.index === index;

    return (
      <div
        key={index}
        className={`grid-slot ${isDragOver ? 'drag-over' : ''} ${isDragged ? 'dragged' : ''} ${item.isMerged ? 'merged' : ''}`}
        style={{ gridColumn: `span ${item.span}` }}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
        onDragLeave={handleDragLeave}
      >
        {item.photo ? (
          <div
            className="photo-item"
            draggable
            onDragStart={(e) => handleDragStart(e, item.photo!, index)}
            onDragEnd={handleDragEnd}
          >
            <img src={getPhotoSrc(item.photo)} alt={item.photo.subtitle || `Foto ${index + 1}`} />
            <div className="photo-overlay">
              <span className="photo-subtitle">{item.photo.subtitle || 'Sem legenda'}</span>
              <div className="drag-handle">⋮⋮</div>
            </div>
          </div>
        ) : (
          <div className="empty-slot">
            <div className="empty-slot-content">
              <span>+</span>
              <span>Arraste uma foto aqui</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const photoLayout = getPhotoLayout();

  return (
    <div className="layout-editor-modal">
      <div className="layout-editor-content">
        <div className="layout-editor-header">
          <h3>Organizar Layout das Fotos</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="layout-editor-body">
          <div className="layout-controls">
            <div className="grid-controls">
              <label>Colunas:</label>
              <div className="column-buttons">
                {[1, 2, 3].map(cols => (
                  <button
                    key={cols}
                    className={`column-btn ${gridColumns === cols ? 'active' : ''}`}
                    onClick={() => handleColumnChange(cols)}
                  >
                    {cols}
                  </button>
                ))}
              </div>
            </div>
            
          </div>

          <div 
            className="photo-grid"
            style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
            ref={dragRef}
          >
            {photoLayout.map((item, index) => renderGridSlot(item, index))}
          </div>

          <div className="layout-instructions">
            <p>💡 <strong>Dica:</strong> Arraste as fotos para reorganizar o layout. Use os botões acima para alterar o número de colunas.</p>
          </div>
        </div>

        <div className="layout-editor-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Salvar Layout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoLayoutEditor;
