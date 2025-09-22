'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProjects } from '../../../contexts/ProjectContext';
import { ProjectStatus } from '../../../models/ProjectStatus';
import PhotoTab from './components/PhotoTab';
import ReportsTab from './components/ReportsTab';
import DetailsTab from './components/DetailsTab';
import Modal from '../../../components/Modal';
import './ProjectPage.css';

const ProjectPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { getProject } = useProjects();
  const projectId = params.id as string;
  
  const project = getProject(projectId);
  
  const [activeTab, setActiveTab] = useState<'photos' | 'reports' | 'details'>('photos');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  if (!project) {
    return (
      <div className="project-page">
        <div className="project-not-found">
          <h1>Projeto não encontrado</h1>
          <p>O projeto solicitado não foi encontrado.</p>
          <button 
            className="project-page-btn-primary"
            onClick={() => router.push('/dashboard')}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.Active:
        return '#10B981';
      case ProjectStatus.Completed:
        return '#059669';
      case ProjectStatus.Paused:
        return '#F59E0B';
      case ProjectStatus.Cancelled:
        return '#EF4444';
      case ProjectStatus.Submitted:
        return '#8B5CF6';
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
      case ProjectStatus.Cancelled:
        return 'Cancelado';
      case ProjectStatus.Submitted:
        return 'Enviado';
      default:
        return 'Desconhecido';
    }
  };


  return (
    <div className="project-page project-page-wrapper">
      <div className="project-page-container">
        {/* Header */}
        <div className="project-header">
          <div className="project-header-left">
            <button 
              className="project-page-btn-back"
              onClick={() => router.push('/dashboard')}
            >
              ← Voltar
            </button>
            <div className="project-title-section">
              <h1>{project.name}</h1>
              <div className="project-meta">
                <span className="project-address">📍 {project.address}</span>
                <span 
                  className="project-status"
                  style={{ color: getStatusColor(project.status) }}
                >
                  ● {getStatusText(project.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="project-actions">
            <button 
              className="project-page-btn-secondary"
              onClick={() => setIsEditModalOpen(true)}
            >
              Editar Projeto
            </button>
            <button 
              className="project-page-btn-primary"
              onClick={() => router.push(`/report/new?projectId=${projectId}`)}
            >
              Novo Relatório
            </button>
          </div>
        </div>


        {/* Tabs */}
        <div className="project-page-tabs">
          <button 
            className={`project-page-tab ${activeTab === 'photos' ? 'project-page-tab-active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            📸 Fotos ({project.photos.length})
          </button>
          <button 
            className={`project-page-tab ${activeTab === 'reports' ? 'project-page-tab-active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📄 Relatórios ({project.reports.length})
          </button>
          <button 
            className={`project-page-tab ${activeTab === 'details' ? 'project-page-tab-active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            ℹ️ Detalhes
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'photos' && <PhotoTab photos={project.photos} projectId={projectId} />}
          {activeTab === 'reports' && <ReportsTab reports={project.reports} projectId={projectId} />}
          {activeTab === 'details' && <DetailsTab project={project} />}
        </div>
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        project={project}
      />
    </div>
  );
};

export default ProjectPage;
