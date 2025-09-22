'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useReportGeneration } from './hooks/useReportGeneration';
import TemplateSelector from './components/TemplateSelector';
import PageEditor from './components/PageEditor';
import PhotoEditor from './components/PhotoEditor';
import DetailsEditor from './components/DetailsEditor';
import ExportScreen from './components/ExportScreen';
import PagesList from './components/PagesList';
import PhotoSourceModal from './components/PhotoSourceModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import './ReportGenerationPage.css';

const ReportGenerationPage: React.FC = () => {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    // State
    currentStep,
    selectedProject,
    reportData,
    currentPage,
    editingPhoto,
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
    setShowPhotoSourceModal,
    
    // Handlers
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
  } = useReportGeneration();

  // Handle scroll to hide/show cancel button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePageChange = (page: typeof currentPage) => {
    setCurrentPage(page);
  };

  const handleCancelPage = () => {
    setCurrentPage(null);
  };

  const handleShowPhotoSourceModal = () => {
    setEditingPhotoIndex(null);
    setShowPhotoSourceModal(true);
  };

  const handleCancelPhoto = () => {
    setIsEditingPhoto(false);
    setEditingPhoto(null);
    setEditingPhotoIndex(null);
  };

  const handleCancelReport = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    if (selectedProject) {
      router.push(`/project/${selectedProject}`);
    } else {
      router.push('/dashboard');
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleStepClick = (step: 'template' | 'pages' | 'details' | 'export') => {
    setCurrentStep(step);
  };

  const isStepComplete = (step: 'template' | 'pages' | 'details' | 'export') => {
    switch (step) {
      case 'template':
        return selectedTemplate !== null;
      case 'pages':
        return reportData.pages.length > 0;
      case 'details':
        return reportData.name.trim() !== '';
      case 'export':
        return reportData.pages.length > 0 && reportData.name.trim() !== '';
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'template':
        return 'Escolher Template';
      case 'pages':
        return currentPage ? 'Editar Página' : 'Páginas do Relatório';
      case 'details':
        return 'Detalhes do Relatório';
      case 'export':
        return 'Exportar Relatório';
      default:
        return 'Gerar Relatório';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'template':
        return 'Selecione um template para começar seu relatório ou crie um do zero';
      case 'pages':
        return currentPage ? 'Edite o conteúdo e fotos desta página' : 'Organize e edite as páginas do seu relatório';
      case 'details':
        return 'Preencha as informações do relatório';
      case 'export':
        return 'Revise e exporte seu relatório';
      default:
        return '';
    }
  };

  return (
    <div className="report-generation-page">
      <div className="report-container">
        {/* Header */}
        <div className={`report-header ${isScrolled ? 'hidden-cancel' : ''}`}>
          {!isScrolled && (
            <button 
              className="cancel-btn"
              onClick={handleCancelReport}
            >
              ✕ Cancelar
            </button>
          )}
          <div className="header-content">
            <div className="step-indicator">
              <button 
                className={`step ${currentStep === 'template' ? 'active' : ''} ${isStepComplete('template') ? 'complete' : ''}`}
                onClick={() => handleStepClick('template')}
                title="Escolher Template"
              >
                {isStepComplete('template') ? '✓' : '1'}
              </button>
              <button 
                className={`step ${currentStep === 'pages' ? 'active' : ''} ${isStepComplete('pages') ? 'complete' : ''}`}
                onClick={() => handleStepClick('pages')}
                title="Páginas do Relatório"
              >
                {isStepComplete('pages') ? '✓' : '2'}
              </button>
              <button 
                className={`step ${currentStep === 'details' ? 'active' : ''} ${isStepComplete('details') ? 'complete' : ''}`}
                onClick={() => handleStepClick('details')}
                title="Detalhes do Relatório"
              >
                {isStepComplete('details') ? '✓' : '3'}
              </button>
              <button 
                className={`step ${currentStep === 'export' ? 'active' : ''} ${isStepComplete('export') ? 'complete' : ''}`}
                onClick={() => handleStepClick('export')}
                title="Exportar Relatório"
              >
                {isStepComplete('export') ? '✓' : '4'}
              </button>
            </div>
            <div className="page-title-section">
              <h1>{getStepTitle()}</h1>
              <p className="page-description">{getStepDescription()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentStep === 'template' && (
          <TemplateSelector
            onTemplateSelect={(template) => {
              handleTemplateSelect(template);
              setCurrentStep('pages');
            }}
          />
        )}
        
        {currentStep === 'pages' && currentPage && (
          <PageEditor
            currentPage={currentPage}
            pageEditMode={pageEditMode}
            onPageChange={handlePageChange}
            onSavePageInfo={handleSavePageInfo}
            onSavePage={handleSavePage}
            onCancel={handleCancelPage}
            onPhotoEdit={handlePhotoEdit}
            onDeletePhoto={handleDeletePhoto}
            onShowPhotoSourceModal={handleShowPhotoSourceModal}
          />
        )}
        
        {currentStep === 'pages' && !currentPage && (
          <PagesList
            pages={reportData.pages}
            onEditPage={handleEditPage}
            onDeletePage={handleDeletePage}
            onAddPage={handleAddPage}
            onReorderPages={handleReorderPages}
            onContinue={() => setCurrentStep('details')}
          />
        )}
        
        {currentStep === 'details' && (
          <DetailsEditor
            reportData={reportData}
            onReportDataChange={setReportData}
            onBack={() => setCurrentStep('pages')}
            onContinue={() => setCurrentStep('export')}
          />
        )}
        
        {currentStep === 'export' && (
          <ExportScreen
            reportData={reportData}
            onBack={() => setCurrentStep('details')}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoCapture}
          style={{ display: 'none' }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          style={{ display: 'none' }}
        />

        {/* Photo Source Selection Modal */}
        <PhotoSourceModal
          isOpen={showPhotoSourceModal}
          onClose={() => setShowPhotoSourceModal(false)}
          onTakePhoto={handleTakePhoto}
          onImportPhoto={handleImportPhoto}
        />

        {/* Photo Editor Modal */}
        <PhotoEditor
          editingPhoto={editingPhoto}
          onSavePhoto={handleSavePhoto}
          onCancel={handleCancelPhoto}
        />

        {/* Cancel Confirmation Modal */}
        <ConfirmationModal
          isOpen={showCancelModal}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancel}
          title="Cancelar Relatório"
          message="Tem certeza que deseja cancelar a criação do relatório? Todas as alterações não salvas serão perdidas."
          confirmText="Sim, Cancelar"
          cancelText="Continuar Editando"
          isDestructive={true}
        />
      </div>
    </div>
  );
};

const ReportGenerationPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ReportGenerationPage />
  </Suspense>
);

export default ReportGenerationPageWithSuspense;