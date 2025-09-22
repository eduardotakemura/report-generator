import { ProjectStatus } from '../models/ProjectStatus';

export const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Active:
      return '#10b981';
    case ProjectStatus.Completed:
      return '#3b82f6';
    case ProjectStatus.Paused:
      return '#f59e0b';
    case ProjectStatus.Cancelled:
      return '#ef4444';
    case ProjectStatus.Submitted:
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};

export const getStatusText = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.Active:
      return 'Ativo';
    case ProjectStatus.Completed:
      return 'Concluído';
    case ProjectStatus.Paused:
      return 'Pausado';
    case ProjectStatus.Cancelled:
      return 'Cancelado';
    case ProjectStatus.Submitted:
      return 'Enviado';
    default:
      return status;
  }
};
