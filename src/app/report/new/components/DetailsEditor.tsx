'use client';

import React from 'react';
import type { ReportGenerationData } from '../hooks/useReportGeneration';

interface DetailsEditorProps {
  reportData: ReportGenerationData;
  onReportDataChange: (data: ReportGenerationData) => void;
  onBack: () => void;
  onContinue: () => void;
}

const DetailsEditor: React.FC<DetailsEditorProps> = ({
  reportData,
  onReportDataChange,
  onBack,
  onContinue
}) => {
  return (
    <div className="step-content">
      <div className="details-form">
        <div className="form-group">
          <label>Nome do Relatório</label>
          <input
            type="text"
            value={reportData.name}
            onChange={(e) => onReportDataChange({
              ...reportData,
              name: e.target.value
            })}
            placeholder="Nome do relatório"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Cliente</label>
            <input
              type="text"
              value={reportData.details.clientName}
              onChange={(e) => onReportDataChange({
                ...reportData,
                details: { ...reportData.details, clientName: e.target.value }
              })}
              placeholder="Nome do cliente"
            />
          </div>
          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              value={reportData.details.number}
              onChange={(e) => onReportDataChange({
                ...reportData,
                details: { ...reportData.details, number: e.target.value }
              })}
              placeholder="Número do relatório"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Endereço</label>
          <input
            type="text"
            value={reportData.details.address}
            onChange={(e) => onReportDataChange({
              ...reportData,
              details: { ...reportData.details, address: e.target.value }
            })}
            placeholder="Endereço do projeto"
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            value={reportData.details.description}
            onChange={(e) => onReportDataChange({
              ...reportData,
              details: { ...reportData.details, description: e.target.value }
            })}
            placeholder="Descrição do relatório"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Engenheiro</label>
            <input
              type="text"
              value={reportData.details.engineer}
              onChange={(e) => onReportDataChange({
                ...reportData,
                details: { ...reportData.details, engineer: e.target.value }
              })}
              placeholder="Nome do engenheiro"
            />
          </div>
          <div className="form-group">
            <label>CREA</label>
            <input
              type="text"
              value={reportData.details.crea}
              onChange={(e) => onReportDataChange({
                ...reportData,
                details: { ...reportData.details, crea: e.target.value }
              })}
              placeholder="Número do CREA"
            />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={onBack}>
          Voltar
        </button>
        <button className="btn-primary" onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default DetailsEditor;
