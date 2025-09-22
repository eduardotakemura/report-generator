'use client';

import React, { useEffect, useRef } from 'react';
import { REPORT_TEMPLATES, type ReportTemplate } from '../../../../models/ReportTemplate';
import './TemplateSelector.css';

interface TemplateSelectorProps {
  onTemplateSelect: (template: ReportTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure proper margin is applied after component mounts
  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current;
      // Force apply the margin if it's not already applied
      if (element.style.marginTop !== '200px') {
        element.style.marginTop = '200px';
        element.style.paddingTop = '2rem';
      }
    }
  }, []);

  const handleTemplateClick = (template: ReportTemplate) => {
    onTemplateSelect(template);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'inspection':
        return 'Vistoria';
      case 'maintenance':
        return 'Manutenção';
      case 'blank':
        return 'Personalizado';
      default:
        return 'Outros';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="template-selector"
      style={{ 
        marginTop: '200px', // Fallback for production build CSS loading issues
        paddingTop: '2rem'
      }}
    >
      <div className="templates-grid">
        {REPORT_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`template-card ${template.isBlank ? 'blank-template' : ''}`}
            onClick={() => handleTemplateClick(template)}
          >
            <div className="template-category">
              {getCategoryLabel(template.category)}
            </div>
            
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              {!template.isBlank && (
                <div className="template-stats">
                  <span className="page-count">
                    {template.pages.length} páginas
                  </span>
                </div>
              )}
            </div>

            <div className="template-action-indicator">
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TemplateSelector;
