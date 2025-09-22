import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProjects } from '../../../../contexts/ProjectContext';
import type { Report } from '../../../../models/Report';
import type { ReportPage } from '../../../../models/ReportPage';
import type { Photo } from '../../../../models/Photo';
import type { ReportTemplate } from '../../../../models/ReportTemplate';

export interface ReportGenerationData {
  name: string;
  details: {
    clientName: string;
    number: string;
    description: string;
    address: string;
    engineer: string;
    crea: string;
  };
  pages: ReportPage[];
}

export const useReportGeneration = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, updateProject } = useProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState<'template' | 'pages' | 'details' | 'export'>('template');
  const [selectedProject, setSelectedProject] = useState<string>(searchParams.get('projectId') || '');
  const [reportData, setReportData] = useState<ReportGenerationData>({
    name: '',
    details: {
      clientName: '',
      number: '',
      description: '',
      address: '',
      engineer: '',
      crea: ''
    },
    pages: []
  });
  const [currentPage, setCurrentPage] = useState<ReportPage | null>(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [pageEditMode, setPageEditMode] = useState<'info' | 'photos'>('info');
  const [showPhotoSourceModal, setShowPhotoSourceModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const handleProjectSelect = useCallback((projectId: string) => {
    setSelectedProject(projectId);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setReportData(prev => ({
        ...prev,
        name: `Relatório - ${project.name}`,
        details: {
          ...prev.details,
          clientName: project.name.split(' - ')[0] || '',
          address: project.address,
          engineer: 'Engenheiro Responsável',
          crea: '1234567'
        }
      }));
    }
  }, [projects]);

  const handleTemplateSelect = useCallback((template: ReportTemplate) => {
    setSelectedTemplate(template);
    
    if (!template.isBlank && template.pages.length > 0) {
      // Pre-load template pages
      const templatePages: ReportPage[] = template.pages.map((pageTemplate, index) => ({
        ...pageTemplate,
        id: `template-${template.id}-${index}-${Date.now()}`,
        photos: []
      }));
      
      setReportData(prev => ({
        ...prev,
        pages: templatePages
      }));
    } else {
      // Clear pages for blank template
      setReportData(prev => ({
        ...prev,
        pages: []
      }));
    }
  }, []);

  // Auto-select project if provided in URL
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId && !selectedProject) {
      handleProjectSelect(projectId);
    }
  }, [searchParams, selectedProject, handleProjectSelect]);

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleImportPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const photo: Photo = {
        file: file,
        subtitle: editingPhoto?.subtitle || '',
        lastModified: new Date()
      };
      setEditingPhoto(photo);
      setIsEditingPhoto(true);
      setShowPhotoSourceModal(false);
    }
  };

  const handleDeletePhoto = (index: number) => {
    if (!currentPage) return;
    
    const updatedPhotos = currentPage.photos.filter((_, i) => i !== index);
    setCurrentPage({
      ...currentPage,
      photos: updatedPhotos
    });
  };

  const handleDeletePage = (pageId: string) => {
    const updatedPages = reportData.pages.filter(page => page.id !== pageId);
    setReportData({
      ...reportData,
      pages: updatedPages
    });
    
    // If we're currently editing the deleted page, close the editor
    if (currentPage && currentPage.id === pageId) {
      setCurrentPage(null);
      setPageEditMode('info');
    }
  };

  const handlePhotoEdit = (photo: Photo, index: number) => {
    setEditingPhoto(photo);
    setEditingPhotoIndex(index);
    setIsEditingPhoto(true);
  };

  const handleSavePhoto = (editedPhoto: Photo) => {
    if (!currentPage) return;

    let updatedPhotos;
    if (editingPhotoIndex !== null) {
      updatedPhotos = currentPage.photos.map((photo, index) => 
        index === editingPhotoIndex ? editedPhoto : photo
      );
    } else {
      updatedPhotos = [...currentPage.photos, editedPhoto];
    }

    setCurrentPage({
      ...currentPage,
      photos: updatedPhotos
    });
    setIsEditingPhoto(false);
    setEditingPhoto(null);
    setEditingPhotoIndex(null);
  };

  const handleAddPage = () => {
    const newPage: ReportPage = {
      id: Date.now().toString(),
      title: `Página ${reportData.pages.length + 1}`,
      content: '',
      photos: [],
      order: reportData.pages.length,
      layout: {
        columns: 2,
        photoOrder: []
      }
    };
    setCurrentPage(newPage);
    setPageEditMode('info');
    setCurrentStep('pages');
  };

  const handleSavePageInfo = () => {
    if (!currentPage) return;
    setPageEditMode('photos');
  };

  const handleSavePage = () => {
    if (!currentPage) return;

    const updatedPages = reportData.pages.map(page => 
      page.id === currentPage.id ? currentPage : page
    );

    if (!reportData.pages.find(page => page.id === currentPage.id)) {
      updatedPages.push(currentPage);
    }

    setReportData(prev => ({
      ...prev,
      pages: updatedPages.sort((a, b) => a.order - b.order)
    }));

    setCurrentPage(null);
    setPageEditMode('info');
  };

  const handleEditPage = (page: ReportPage) => {
    setCurrentPage(page);
    setPageEditMode('photos');
    setCurrentStep('pages');
  };

  const handleReorderPages = (reorderedItems: { id: string; content: React.ReactNode }[]) => {
    const reorderedPages = reorderedItems.map(item => 
      reportData.pages.find(page => page.id === item.id)!
    );
    const updatedPages = reorderedPages.map((page, index) => ({
      ...page,
      order: index
    }));
    setReportData(prev => ({
      ...prev,
      pages: updatedPages
    }));
  };

  const handleGenerateReport = () => {
    if (!selectedProject) return;

    const newReport: Report = {
      id: Date.now().toString(),
      name: reportData.name,
      details: reportData.details,
      pages: reportData.pages,
      createdAt: new Date()
    };

    const project = projects.find(p => p.id === selectedProject);
    if (project) {
      // Extract all photos from report pages and add them to the project
      const reportPhotos: Photo[] = [];
      reportData.pages.forEach(page => {
        reportPhotos.push(...page.photos);
      });

      const updatedProject = {
        ...project,
        reports: [...project.reports, newReport],
        photos: [...project.photos, ...reportPhotos], // Add report photos to project
        lastModified: new Date()
      };
      updateProject(selectedProject, updatedProject);
    }

    router.push(`/project/${selectedProject}`);
  };

  return {
    // State
    currentStep,
    selectedProject,
    reportData,
    currentPage,
    isEditingPhoto,
    editingPhoto,
    editingPhotoIndex,
    pageEditMode,
    showPhotoSourceModal,
    selectedTemplate,
    
    // Refs
    fileInputRef,
    cameraInputRef,
    
    // Setters
    setCurrentStep,
    setReportData,
    setCurrentPage,
    setIsEditingPhoto,
    setEditingPhoto,
    setEditingPhotoIndex,
    setPageEditMode,
    setShowPhotoSourceModal,
    setSelectedTemplate,
    
    // Handlers
    handleProjectSelect,
    handleTemplateSelect,
    handleTakePhoto,
    handleImportPhoto,
    handlePhotoCapture,
    handleDeletePhoto,
    handleDeletePage,
    handlePhotoEdit,
    handleSavePhoto,
    handleAddPage,
    handleSavePageInfo,
    handleSavePage,
    handleEditPage,
    handleReorderPages,
    handleGenerateReport
  };
};
