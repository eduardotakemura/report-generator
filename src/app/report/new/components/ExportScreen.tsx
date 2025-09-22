'use client';

import React, { useState } from 'react';
import type { ReportGenerationData } from '../hooks/useReportGeneration';
import { generatePDF } from '../../../../services/pdfGenerator';
import ComingSoonModal from '../../../../components/ComingSoonModal';

interface ExportScreenProps {
  reportData: ReportGenerationData;
  onBack: () => void;
  onGenerateReport: () => void;
}

const ExportScreen: React.FC<ExportScreenProps> = ({
  reportData,
  onBack,
  onGenerateReport
}) => {
  const [showEditableModal, setShowEditableModal] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  
  // Validation logic
  const isReportNameValid = reportData.name.trim().length > 0;
  const hasPages = reportData.pages.length > 0;
  const canExportOrSave = isReportNameValid && hasPages;

  // Helper function to check if a field is filled
  const isFieldFilled = (value: string) => value.trim().length > 0;

  // Helper function to render field with highlighting for empty fields
  const renderField = (label: string, value: string, isRequired: boolean = false) => {
    const isEmpty = !isFieldFilled(value);
    const shouldHighlight = isEmpty && !isRequired; // Only highlight optional fields that are empty
    
    return (
      <p className={shouldHighlight ? 'field-missing' : ''}>
        <strong>{label}:</strong> {isEmpty ? (isRequired ? 'Obrigatório' : 'Não preenchido') : value}
      </p>
    );
  };

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!canExportOrSave || isExportingPDF) return;
    
    setIsExportingPDF(true);
    try {
      const filename = `${reportData.name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      await generatePDF(reportData, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Handle editable export (placeholder for future implementation)
  const handleExportEditable = () => {
    if (!canExportOrSave) return;
    setShowEditableModal(true);
  };

  // Handle report saving with loading state
  const handleSaveReport = async () => {
    if (!canExportOrSave || isSavingReport) return;
    
    setIsSavingReport(true);
    try {
      await onGenerateReport();
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Erro ao salvar relatório. Tente novamente.');
    } finally {
      setIsSavingReport(false);
    }
  };

  return (
    <div className="step-content">
      <div className="report-preview">
        <h3>{reportData.name || 'Nome do relatório não definido'}</h3>
        
        <div className="report-info">
          <h4>Detalhes do Relatório</h4>
          {renderField('Nome do Relatório', reportData.name, true)}
          {renderField('Cliente', reportData.details.clientName)}
          {renderField('Número', reportData.details.number)}
          {renderField('Endereço', reportData.details.address)}
          {renderField('Descrição', reportData.details.description)}
          {renderField('Engenheiro', reportData.details.engineer)}
          {renderField('CREA', reportData.details.crea)}
        </div>
        
        <div className="pages-summary">
          <h4>Páginas ({reportData.pages.length})</h4>
          {reportData.pages.length === 0 ? (
            <p className="field-missing">Nenhuma página adicionada</p>
          ) : (
            reportData.pages.map((page, index) => (
              <div key={page.id} className="page-summary">
                <span>{index + 1}. {page.title}</span>
                <span>{page.photos.length} fotos</span>
              </div>
            ))
          )}
        </div>

        {!canExportOrSave && (
          <div className="validation-warning">
            <p>⚠️ Para exportar ou salvar o relatório, é necessário:</p>
            <ul>
              {!isReportNameValid && <li>• Definir o nome do relatório</li>}
              {!hasPages && <li>• Adicionar pelo menos uma página</li>}
            </ul>
          </div>
        )}
      </div>

      <div className="export-options">
        <button 
          className="btn-primary export-btn" 
          disabled={!canExportOrSave || isExportingPDF || isSavingReport}
          onClick={handleExportPDF}
        >
          {isExportingPDF ? (
            <>
              <span className="spinner"></span>
              Gerando PDF...
            </>
          ) : (
            '📄 Exportar PDF'
          )}
        </button>
        <button 
          className="btn-secondary export-btn" 
          disabled={!canExportOrSave || isExportingPDF || isSavingReport}
          onClick={handleExportEditable}
        >
          📝 Exportar Editável
        </button>
      </div>

      <div className="step-actions">
        <button 
          className="btn-secondary" 
          onClick={onBack}
          disabled={isExportingPDF || isSavingReport}
        >
          Voltar
        </button>
        <button 
          className="btn-primary" 
          onClick={handleSaveReport}
          disabled={!canExportOrSave || isExportingPDF || isSavingReport}
        >
          {isSavingReport ? (
            <>
              <span className="spinner"></span>
              Salvando...
            </>
          ) : (
            'Salvar Relatório'
          )}
        </button>
      </div>

      <ComingSoonModal
        isOpen={showEditableModal}
        onClose={() => setShowEditableModal(false)}
        title="Em breve!"
        message="A funcionalidade disponível em breve!"
      />
    </div>
  );
};

export default ExportScreen;
