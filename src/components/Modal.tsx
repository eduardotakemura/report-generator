'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '../contexts/ProjectContext';
import { ProjectStatus } from '../models/ProjectStatus';
import type { Project } from '../models/Project';
import ConfirmationModal from './ConfirmationModal';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  project?: Project; // Required for edit mode
}

interface ProjectFormData {
  name: string;
  address: string;
  status?: ProjectStatus; // Only for edit mode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, mode, project }) => {
  const router = useRouter();
  const { addProject, updateProject, deleteProject } = useProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    address: '',
    status: ProjectStatus.Active
  });

  // Reset form when modal opens/closes or project changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && project) {
        setFormData({
          name: project.name,
          address: project.address,
          status: project.status
        });
      } else {
        setFormData({
          name: '',
          address: '',
          status: ProjectStatus.Active
        });
      }
      setErrors({});
      setIsDeleteModalOpen(false);
    }
  }, [isOpen, mode, project]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do projeto é obrigatório';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ProjectFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'create') {
        // Create new project
        const newProject: Project = {
          id: Date.now().toString(),
          name: formData.name.trim(),
          address: formData.address.trim(),
          status: ProjectStatus.Active,
          photos: [],
          reports: [],
          createdAt: new Date(),
          lastModified: new Date()
        };
        
        // Add project using context
        addProject(newProject);
        
        // Close modal
        onClose();
        
        // Redirect to the new project page
        router.push(`/project/${newProject.id}`);
      } else if (mode === 'edit' && project) {
        // Update existing project
        updateProject(project.id, {
          name: formData.name.trim(),
          address: formData.address.trim(),
          status: formData.status || ProjectStatus.Active
        });
        
        // Close modal
        onClose();
      }
      
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} project:`, error);
      alert(`Erro ao ${mode === 'create' ? 'criar' : 'atualizar'} projeto. Tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    
    setIsDeleting(true);
    
    try {
      deleteProject(project.id);
      onClose();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erro ao excluir projeto. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusOptions = () => {
    return Object.values(ProjectStatus).map(status => ({
      value: status,
      label: getStatusText(status)
    }));
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>{mode === 'create' ? 'Criar Novo Projeto' : 'Editar Projeto'}</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">
              Nome do Projeto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Ex: Relatório Fotográfico - Edifício Residencial"
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Endereço
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={errors.address ? 'error' : ''}
              placeholder="Ex: Rua das Flores, 123 - São Paulo/SP"
              disabled={isSubmitting}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          {mode === 'edit' && (
            <div className="form-group">
              <label htmlFor="status">
                Status do Projeto
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || ProjectStatus.Active}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="status-select"
              >
                {getStatusOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="modal-actions">
            {mode === 'edit' && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isSubmitting}
              >
                Excluir Projeto
              </button>
            )}
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  {mode === 'create' ? 'Criando...' : 'Salvando...'}
                </>
              ) : (
                mode === 'create' ? 'Criar Projeto' : 'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Excluir Projeto"
        message={`Tem certeza que deseja excluir o projeto "${project?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Modal;
