import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { logError, logWarning } from '../common/logger';

// Generate PDF from HTML element using HTML2Canvas
export const generatePdfFromElement = async (
  elementId: string,
  filename: string = 'document.pdf',
  options: {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  } = {}
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      useCORS: options.useCORS || true,
      allowTaint: options.allowTaint || false,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Error generating PDF from element'), { component: 'html2canvasPdf' });
    throw error;
  }
};

// Generate PDF from multiple HTML elements
export const generatePdfFromElements = async (
  elementIds: string[],
  filename: string = 'document.pdf',
  options: {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  } = {}
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let isFirstPage = true;

  for (const elementId of elementIds) {
    const element = document.getElementById(elementId);
    if (!element) {
      logWarning(`Element with id "${elementId}" not found, skipping...`, { component: 'html2canvasPdf', elementId });
      continue;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: options.scale || 2,
        useCORS: options.useCORS || true,
        allowTaint: options.allowTaint || false,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error(`Error generating PDF from element ${elementId}`), { component: 'html2canvasPdf', elementId });
      throw error;
    }
  }

  pdf.save(filename);
};
