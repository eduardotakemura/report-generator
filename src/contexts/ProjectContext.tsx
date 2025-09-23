'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Project } from '../models/Project';
import { projects as initialProjects } from '../data/data';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  getProject: (projectId: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  // Initialize with dummy data - no localStorage, data will be lost on refresh
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => {
        if (project.id === projectId) {
          // Ensure File objects in photos are preserved
          const updatedProject = { ...project, ...updates, lastModified: new Date() };
          
          if (updates.photos) {
            // Explicitly preserve File objects in photos
            updatedProject.photos = updates.photos.map(photo => ({
              subtitle: photo.subtitle,
              lastModified: photo.lastModified,
              file: photo.file, // Explicitly preserve File object
              url: photo.url
            }));
          }
          
          return updatedProject;
        }
        return project;
      })
    );
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const getProject = (projectId: string) => {
    return projects.find(project => project.id === projectId);
  };

  const value: ProjectContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
