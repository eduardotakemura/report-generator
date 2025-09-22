import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import { getPhotoSrc } from '../utils/photoUtils';
import type { ReportGenerationData } from '../app/report/new/hooks/useReportGeneration';
import type { ReportPage } from '../models/ReportPage';
import type { Photo } from '../models/Photo';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 18,
    fontFamily: 'Helvetica',
  },
  pageFrame: {
    position: 'absolute',
    top: 9,
    left: 9,
    right: 9,
    bottom: 9,
    border: '0.5px solid #000000',
  },
  coverPage: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.3px solid #000000',
    minHeight: 12,
  },
  tableLabel: {
    width: '20%',
    padding: 4,
    fontSize: 11,
    fontWeight: 'bold',
    borderRight: '0.3px solid #000000',
  },
  tableValue: {
    width: '80%',
    padding: 4,
    fontSize: 11,
    flexWrap: 'wrap',
  },
  tableValueHalf: {
    width: '40%',
    padding: 4,
    fontSize: 11,
    borderRight: '0.3px solid #000000',
  },
  descriptionBox: {
    border: '0.2px solid #000000',
    padding: 6,
    marginTop: 10,
    minHeight: 24,
  },
  descriptionText: {
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 12,
    left: 18,
    fontSize: 9,
    color: '#505050',
  },
  contentPage: {
    flexDirection: 'column',
  },
  pageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 7,
    textTransform: 'uppercase',
  },
  titleLine: {
    height: '0.2px',
    backgroundColor: '#000000',
    marginBottom: 4,
  },
  contentBox: {
    border: '0.2px solid #000000',
    padding: 6,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 10,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  imageContainer: {
    width: '48%',
    marginBottom: 18,
  },
  image: {
    width: '100%',
    height: 70,
    objectFit: 'contain',
  },
  imageSubtitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 6,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    right: 18,
    fontSize: 9,
  },
  placeholder: {
    width: '100%',
    height: 70,
    backgroundColor: '#F5F5F5',
    border: '0.2px solid #000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 9,
    color: '#666666',
  },
});

// Cover Page Component
const CoverPage: React.FC<{ reportData: ReportGenerationData }> = ({ reportData }) => {
  const details = reportData.details || ({} as any);
  const now = new Date();
  const timestamp = now.toLocaleDateString('pt-BR') + ' - ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const rows = [
    { label: 'Cliente', value: details.clientName },
    { label: 'Nota Técnica', value: details.number },
    { label: 'Endereço', value: details.address },
    { label: 'Assunto', value: reportData.name },
    { label: 'Engenheiro', value: details.engineer },
    { label: 'CREA', value: details.crea },
  ].filter(r => r.value && r.value.trim());

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageFrame} />
      
      <View style={styles.coverPage}>
        <Text style={styles.title}>RELATÓRIO FOTOGRÁFICO</Text>
        
        <View style={styles.table}>
          {rows.map((row, index) => {
            if (row.label === 'CREA') return null; // handled with Engenheiro
            
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableLabel}>{row.label}:</Text>
                {row.label === 'Engenheiro' && details.crea ? (
                  <>
                    <Text style={styles.tableValueHalf}>{row.value}</Text>
                    <View style={styles.tableValueHalf}>
                      <Text style={[styles.tableValueHalf, { fontWeight: 'bold' }]}>CREA:</Text>
                      <Text style={styles.tableValueHalf}>{details.crea}</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.tableValue}>{row.value}</Text>
                )}
              </View>
            );
          })}
        </View>

        {details.description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{details.description}</Text>
          </View>
        )}
      </View>

      <Text style={styles.footer}>Gerado em: {timestamp}</Text>
    </Page>
  );
};

// Content Page Component
const ContentPage: React.FC<{ page: ReportPage; pageIndex: number; startFigureNumber?: number }> = ({ page, pageIndex, startFigureNumber = 1 }) => {
  const columns = page.layout?.columns || 2;
  const photosPerRow = columns;
  
  const renderPhotos = () => {
    if (!page.photos?.length) return null;

    const photoRows = [];
    let figureCounter = startFigureNumber;
    
    for (let i = 0; i < page.photos.length; i += photosPerRow) {
      const rowPhotos = page.photos.slice(i, i + photosPerRow);
      photoRows.push(
        <View key={i} style={styles.imageGrid}>
          {rowPhotos.map((photo, photoIndex) => {
            const currentFigureNumber = figureCounter++;
            return (
              <View key={photoIndex} style={styles.imageContainer}>
                {getPhotoSrc(photo) ? (
                  <Image
                    src={getPhotoSrc(photo)}
                    style={styles.image}
                    cache={false}
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>Imagem não disponível</Text>
                  </View>
                )}
                {photo.subtitle && (
                  <Text style={styles.imageSubtitle}>
                    Figura {currentFigureNumber}: {photo.subtitle}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      );
    }
    return photoRows;
  };

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageFrame} />
      
      <View style={styles.contentPage}>
        <Text style={styles.pageTitle}>{page.title || 'Sem título'}</Text>
        <View style={styles.titleLine} />
        <View style={styles.titleLine} />
        
        {page.content?.trim() && (
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>{page.content}</Text>
          </View>
        )}

        {renderPhotos()}
      </View>

      <Text style={styles.pageNumber}>Página {pageIndex}</Text>
    </Page>
  );
};

// Main Document Component
const ReportDocument: React.FC<{ reportData: ReportGenerationData }> = ({ reportData }) => {
  // Calculate starting figure number for each page
  let currentFigureNumber = 1;
  const pagesWithFigureNumbers = reportData.pages.map((page, index) => {
    const startFigureNumber = currentFigureNumber;
    currentFigureNumber += page.photos?.length || 0;
    return { page, pageIndex: index + 1, startFigureNumber };
  });

  return (
    <Document>
      <CoverPage reportData={reportData} />
      {pagesWithFigureNumbers.map(({ page, pageIndex, startFigureNumber }) => (
        <ContentPage 
          key={page.id} 
          page={page} 
          pageIndex={pageIndex} 
          startFigureNumber={startFigureNumber}
        />
      ))}
    </Document>
  );
};

// PDF Generator Class
export class PDFGeneratorReact {
  async generateReport(reportData: ReportGenerationData): Promise<Blob> {
    const doc = <ReportDocument reportData={reportData} />;
    return await pdf(doc).toBlob();
  }

  async download(reportData: ReportGenerationData, filename?: string): Promise<void> {
    const blob = await this.generateReport(reportData);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  getBlob(reportData: ReportGenerationData): Promise<Blob> {
    return this.generateReport(reportData);
  }
}

// Export function for backward compatibility
export const generatePDFReact = async (reportData: ReportGenerationData, filename?: string): Promise<void> => {
  const generator = new PDFGeneratorReact();
  await generator.download(reportData, filename);
};
