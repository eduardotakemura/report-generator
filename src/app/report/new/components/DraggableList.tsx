'use client';

import React, { useState } from 'react';
import './DraggableList.css';

interface DraggableItem {
  id: string;
  content: React.ReactNode;
}

interface DraggableListProps {
  items: DraggableItem[];
  onReorder: (reorderedItems: DraggableItem[]) => void;
  className?: string;
}

const DraggableList: React.FC<DraggableListProps> = ({ items, onReorder, className = '' }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetItemId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetItemId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newItems = [...items];
    const [draggedItemData] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItemData);

    onReorder(newItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className={`draggable-list ${className}`}>
      <div className="drag-hint">
        <span className="drag-hint-icon">↕️</span>
        <span className="drag-hint-text">Arraste os cartões para reordenar</span>
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`draggable-item ${
            draggedItem === item.id ? 'dragging' : ''
          } ${
            dragOverItem === item.id ? 'drag-over' : ''
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="item-content">
            {item.content}
          </div>
          <div className="item-number">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DraggableList;
