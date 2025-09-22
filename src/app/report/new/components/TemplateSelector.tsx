'use client';

import React from 'react';
import { REPORT_TEMPLATES, type ReportTemplate } from '../../../../models/ReportTemplate';
import './TemplateSelector.css';

interface TemplateSelectorProps {
  onTemplateSelect: (template: ReportTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelect
}) => {
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
    <div className="template-selector">
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
