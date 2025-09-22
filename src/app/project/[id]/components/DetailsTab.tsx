import React from 'react';
import { Project } from '../../../../models/Project';
import { ProjectStatus } from '../../../../models/ProjectStatus';
import './DetailsTab.css';

interface DetailsTabProps {
  project: Project;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ project }) => {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Active:
        return '#10B981';
      case ProjectStatus.Completed:
        return '#059669';
      case ProjectStatus.Paused:
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Active:
        return 'Em Andamento';
      case ProjectStatus.Completed:
        return 'Concluído';
      case ProjectStatus.Paused:
        return 'Pausado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="details-section">
      <div className="details-grid">
        <div className="detail-card">
          <h4>Informações do Projeto</h4>
          <div className="detail-item">
            <label>Nome:</label>
            <span>{project.name}</span>
          </div>
          <div className="detail-item">
            <label>Endereço:</label>
            <span>{project.address}</span>
          </div>
          <div className="detail-item">
            <label>Status:</label>
            <span style={{ color: getStatusColor(project.status) }}>
              {getStatusText(project.status)}
            </span>
          </div>
          <div className="detail-item">
            <label>Criado em:</label>
            <span>{new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="detail-item">
            <label>Última modificação:</label>
            <span>{new Date(project.lastModified).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
