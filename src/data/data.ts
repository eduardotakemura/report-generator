import type { Project } from '../models/Project';
import { ProjectStatus } from '../models/ProjectStatus';

export const projects: Project[] = [
        {
      id: '1',
      name: 'Relatório Fotográfico - Edifício Residencial',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      status: ProjectStatus.Active,
      photos: [
        {url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop', subtitle : 'Exterior view' , lastModified: new Date('2024-01-01')},
        { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop', subtitle: 'Building structure' , lastModified: new Date('2024-01-01')},
        { url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&h=200&fit=crop', subtitle: 'Construction details' , lastModified: new Date('2024-01-01')},
        { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop', subtitle: 'Interior view' , lastModified: new Date('2024-01-01')},
        { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop', subtitle: 'Technical details' , lastModified: new Date('2024-01-01')}
      ],
      reports: [], // Will be populated with generated reports
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-15')
    },
  ];
