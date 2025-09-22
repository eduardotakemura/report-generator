'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '../../contexts/ProjectContext';
import { ProjectStatus } from '../../models/ProjectStatus';
import ProjectCard from './components/ProjectCard';
import Modal from '../../components/Modal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { projects } = useProjects();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleNewProject = () => {
    setIsNewProjectModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNewProjectModalOpen(false);
  };


  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Gerencie seus projetos</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{projects.length}</h3>
              <p>Total de Projetos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{projects.filter(p => p.status === ProjectStatus.Completed).length}</h3>
              <p>Concluídos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{projects.filter(p => p.status === ProjectStatus.Active).length}</h3>
              <p>Em Andamento</p>
            </div>
          </div>
        </div>

        <div className="projects-section">
          <div className="section-header">
            <h2>Meus Projetos</h2>
            <button className="btn-primary" onClick={handleNewProject}>
              Novo Projeto
            </button>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onOpen={() => handleProjectClick(project.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      <Modal 
        isOpen={isNewProjectModalOpen}
        onClose={handleCloseModal}
        mode="create"
      />
    </div>
  );
};

export default Dashboard;
