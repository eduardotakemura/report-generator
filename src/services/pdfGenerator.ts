import jsPDF from 'jspdf';
import type { ReportGenerationData } from '../app/report/new/hooks/useReportGeneration';
import type { ReportPage } from '../models/ReportPage';
import type { Photo } from '../models/Photo';
import { getPhotoSrc } from '../utils/photoUtils';

type LoadedImage = {
  photo: Photo;
  img: HTMLImageElement;
};

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth = 210;
  private pageHeight = 297;
  private margin = 18;
  private contentWidth = this.pageWidth - this.margin * 2;
  private contentHeight = this.pageHeight - this.margin * 2;
  private figureCounter = 1;

  constructor() {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  }

  async generateReport(reportData: ReportGenerationData): Promise<void> {
    this.figureCounter = 1;

    await this.generateCoverPage(reportData);

    for (let i = 0; i < reportData.pages.length; i++) {
      this.doc.addPage();
      await this.generateContentPage(reportData.pages[i], i + 1);
    }
  }

  download(filename?: string): void {
    const defaultFilename = `relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(filename || defaultFilename);
  }

  getBlob(): Blob {
    return this.doc.output('blob');
  }

  /* ---------------- COVER ---------------- */
  private async generateCoverPage(reportData: ReportGenerationData): Promise<void> {
    const doc = this.doc;
    this.addPageFrame();

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    const title = 'RELATÓRIO FOTOGRÁFICO';
    const tx = (this.pageWidth - doc.getTextWidth(title)) / 2;
    doc.text(title, tx, 35);

    // Table setup
    const startY = 50;
    const rowHeight = 12;
    const labelWidth = 40;
    const tableWidth = this.contentWidth;
    const valueWidth = tableWidth - labelWidth;

    const details = reportData.details || ({} as any);
    const rows = [
      { label: 'Cliente', value: details.clientName },
      { label: 'Nota Técnica', value: details.number },
      { label: 'Endereço', value: details.address },
      { label: 'Assunto', value: reportData.name },
      { label: 'Engenheiro', value: details.engineer },
      { label: 'CREA', value: details.crea },
    ].filter(r => r.value && r.value.trim());

    // Table drawing
    let y = startY;
    doc.setFontSize(11);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    rows.forEach((row, i) => {
      const isEngineer = row.label === 'Engenheiro';
      const isCrea = row.label === 'CREA';

      if (isCrea) return; // handled together with Engenheiro row

      // Label cell
      doc.setFont('helvetica', 'bold');
      doc.rect(this.margin, y, labelWidth, rowHeight);
      doc.text(row.label + ':', this.margin + 3, y + 8);

      // Value cell(s)
      doc.setFont('helvetica', 'normal');

      if (row.label === 'Engenheiro' && details.crea) {
        // Special: Engenheiro + CREA side by side
        const engWidth = (valueWidth / 2);
        const creaWidth = valueWidth - engWidth;
        doc.rect(this.margin + labelWidth, y, engWidth, rowHeight);
        doc.text(row.value, this.margin + labelWidth + 3, y + 8);

        doc.rect(this.margin + labelWidth + engWidth, y, creaWidth, rowHeight);
        doc.setFont('helvetica', 'bold');
        doc.text('CREA:', this.margin + labelWidth + engWidth + 3, y + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(details.crea, this.margin + labelWidth + engWidth + 20, y + 8);
      } else {
        // Normal cell
        doc.rect(this.margin + labelWidth, y, valueWidth, rowHeight);
        const lines = doc.splitTextToSize(row.value, valueWidth - 6);
        doc.text(lines, this.margin + labelWidth + 3, y + 8);
      }

      y += rowHeight;
    });

    // Description field (if any)
    if (details.description) {
        const descLines = doc.splitTextToSize(details.description, tableWidth - 6);
        const minHeight = 24; // ~4 lines
        const descHeight = Math.max(minHeight, descLines.length * 6 + 6);
      
        doc.rect(this.margin, y, tableWidth, descHeight);
        doc.setFont('helvetica', 'normal');
        doc.text(descLines, this.margin + 3, y + 7);
        y += descHeight + 10;
    }

    // Footer with timestamp
const now = new Date();
const timestamp = now.toLocaleDateString('pt-BR') + ' - ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(80, 80, 80);
doc.text(`Gerado em: ${timestamp}`, this.margin, this.pageHeight - 12);
  }

  /* ---------------- CONTENT PAGE ---------------- */
  private async generateContentPage(page: ReportPage, pageIndex: number): Promise<void> {
    const doc = this.doc;
    this.addPageFrame();

    let y = this.margin + 8;

    // Title
    const title = (page.title || 'Sem título').toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, this.pageWidth / 2, y, { align: 'center' });

    // Lines above & below
    doc.setDrawColor(0, 0, 0);
    doc.line(this.margin, y - 6, this.pageWidth - this.margin, y - 6);
    doc.line(this.margin, y + 4, this.pageWidth - this.margin, y + 4);

    y += 7;

    // Description
    if (page.content?.trim()) {
        const lines = doc.splitTextToSize(page.content, this.contentWidth - 10);
        const boxHeight = lines.length * 5 + 6;
        const boxY = y;
      
        // Draw box
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.rect(this.margin, boxY, this.contentWidth, boxHeight);
      
        // Text centered inside box
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const textY = boxY + 6;
        doc.text(lines, this.pageWidth / 2, textY, { align: 'center', maxWidth: this.contentWidth - 12 });
      
        y += boxHeight + 12;
      }

    // Photos
    if (page.photos?.length) {
      await this.generateImagesGrid(page.photos, page.layout?.columns || 2, y);
    }

    // Page number
    const text = `Página ${pageIndex}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const tw = doc.getTextWidth(text);
    doc.text(text, this.pageWidth - this.margin - tw, this.pageHeight - 10);
  }

  private async generateImagesGrid(photos: Photo[], columns: number, startY: number): Promise<void> {
    const doc = this.doc;
    const gap = 8;
    const usableWidth = this.contentWidth;
    const colWidth = (usableWidth - (columns - 1) * gap) / columns;

    const loaded = await this.preloadPhotos(photos);

    let idx = 0;
    let y = startY;
    while (idx < loaded.length) {
      const remaining = loaded.length - idx;
      let rowCols = Math.min(columns, remaining);
      let spanLast = rowCols === 1 && columns > 1;

      let rowHeight = 70; // target height (will be scaled)
      let x = this.margin;

      for (let c = 0; c < rowCols; c++) {
        if (idx >= loaded.length) break;
        const item = loaded[idx];

        const boxW = spanLast ? usableWidth : colWidth;
        const boxH = rowHeight;

        // preserve aspect ratio
        const natW = item.img.naturalWidth;
        const natH = item.img.naturalHeight;
        const scale = Math.min(boxW / natW, boxH / natH);
        const drawW = natW * scale;
        const drawH = natH * scale;
        const dx = x + (boxW - drawW) / 2;
        const dy = y + (boxH - drawH) / 2;

        try {
          const mime = this.detectMime(getPhotoSrc(item.photo));
          doc.addImage(item.img, mime, dx, dy, drawW, drawH);
        } catch {
          this.drawPlaceholder(dx, dy, boxW, boxH);
        }

        // Subtitle

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            const sub = item.photo.subtitle ? `Figura ${this.figureCounter}: ${item.photo.subtitle}` : `Figura ${this.figureCounter}`;
            const subLines = doc.splitTextToSize(sub, boxW - 6);
          
            subLines.forEach((line: string, li: number) => {
              const lw = doc.getTextWidth(line);    
              const sx = x + (boxW - lw) / 2; // <-- center inside the image box
              const sy = y + boxH + 6 + li * 5;
              doc.text(line, sx, sy);
            });
          

        this.figureCounter++;
        idx++;
        x += colWidth + gap;
        if (spanLast) break;
      }

      y += rowHeight + 18;
    }
  }

  /* ---------------- HELPERS ---------------- */
  private addPageFrame(): void {
    const doc = this.doc;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(this.margin / 2, this.margin / 2, this.pageWidth - this.margin, this.pageHeight - this.margin);
  }

  private drawPlaceholder(x: number, y: number, w: number, h: number): void {
    const doc = this.doc;
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(245, 245, 245);
    doc.rect(x, y, w, h, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const txt = 'Imagem não disponível';
    const tw = doc.getTextWidth(txt);
    doc.text(txt, x + (w - tw) / 2, y + h / 2);
  }

  private preloadPhotos(photos: Photo[]): Promise<LoadedImage[]> {
    return Promise.all(
      photos.map(
        p =>
          new Promise<LoadedImage>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ photo: p, img });
            img.onerror = () => reject();
            img.src = getPhotoSrc(p) || '';
          }).catch(() => ({ photo: p, img: this.createBrokenImage() }))
      )
    );
  }

  private createBrokenImage(): HTMLImageElement {
    const img = document.createElement('canvas') as any;
    (img as any).naturalWidth = 1;
    (img as any).naturalHeight = 1;
    return img;
  }

  private detectMime(url: string): string {
    if (url.startsWith('data:image/png')) return 'PNG';
    return 'JPEG';
  }
}

export const generatePDF = async (reportData: ReportGenerationData, filename?: string): Promise<void> => {
  const generator = new PDFGenerator();
  await generator.generateReport(reportData);
  generator.download(filename);
};
