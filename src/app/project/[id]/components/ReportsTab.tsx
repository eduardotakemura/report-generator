import React from 'react';
import { useRouter } from 'next/navigation';
import { Report } from '../../../../models/Report';
import './ReportsTab.css';

interface ReportsTabProps {
  reports: Report[];
  projectId: string;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ reports, projectId }) => {
  const router = useRouter();

  return (
    <div className="reports-section">
      <div className="reports-header">
        <h3>Histórico de Relatórios</h3>
      </div>
      
      {reports.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>Nenhum relatório gerado</h3>
          <p>Aqui você pode conferir o histórico de relatórios do projeto.</p>
          <button 
            className="project-page-btn-primary"
            onClick={() => router.push(`/report/new?projectId=${projectId}`)}
          >
            Começar Agora
          </button>
        </div>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-info">
                <h4>{report.name}</h4>
                <p>{report.details.description}</p>
                <div className="report-meta">
                  <span>Cliente: {report.details.clientName}</span>
                  <span>Engenheiro: {report.details.engineer}</span>
                  <span>Criado em: {new Date(report.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className="report-actions">
                <button className="project-page-btn-secondary">Visualizar</button>
                <button className="project-page-btn-danger">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
