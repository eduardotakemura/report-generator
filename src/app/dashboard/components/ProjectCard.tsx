import React from 'react';
import Image from 'next/image';
import type { Project } from '../../../models/Project';
import { getStatusColor, getStatusText } from '../../../utils/status';
import { getPhotoSrc } from '../../../utils/photoUtils';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onOpen?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    }
  };

  // Show all photos that can fit in the row
  const photosToShow = project.photos;

  return (
    <div className="project-card" onClick={handleOpen}>
      {/* Status label positioned at top right */}
      <span 
        className="project-status"
        style={{ backgroundColor: getStatusColor(project.status) }}
      >
        {getStatusText(project.status)}
      </span>
      
      {/* Project name and address */}
      <div className="project-info">
        <h3>{project.name}</h3>
        <p className="project-address">{project.address}</p>
      </div>
      
      {/* Image Miniatures Section */}
      {project.photos.length > 0 && (
        <div className="project-images-preview">
          <div className="images-grid">
            {photosToShow.map((photo, index) => {
              const photoSrc = getPhotoSrc(photo);
              const isObjectUrl = photoSrc.startsWith('blob:');
              
              return (
                <div key={photo.url || photo.file?.name || index} className="image-preview">
                  {isObjectUrl ? (
                    <img 
                      src={photoSrc} 
                      alt={`Preview ${index + 1}`}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Image 
                      src={photoSrc} 
                      alt={`Preview ${index + 1}`}
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Improved Stats Layout */}
      <div className="project-stats">
        <div className="project-stat">
          <div className="stat-icon">📸</div>
          <div className="stat-content">
            <span className="project-stat-number">{project.photos.length}</span>
            <span className="project-stat-label">Fotos</span>
          </div>
        </div>
        <div className="project-stat">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <span className="project-stat-number">{project.reports.length}</span>
            <span className="project-stat-label">Relatórios</span>
          </div>
        </div>
      </div>
      
      {/* Footer with date only */}
      <div className="project-footer">
        <span className="project-date">
          Modificado em: {project.lastModified.toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
