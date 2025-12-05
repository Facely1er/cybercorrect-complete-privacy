import { jsPDF } from 'jspdf';

/**
 * Adds the CyberCorrect logo to a PDF document
 * @param doc - The jsPDF document instance
 * @param x - X position (default: 20)
 * @param y - Y position (default: 10)
 * @param width - Logo width in mm (default: 40)
 * @param height - Logo height in mm (default: auto-calculated to maintain aspect ratio)
 */
export const addCyberCorrectLogo = async (
  doc: jsPDF,
  x: number = 20,
  y: number = 10,
  width: number = 40
): Promise<void> => {
  try {
    // Load the logo image from the public folder
    const logoUrl = '/cybercorrect.png';
    
    // Create an image element to get dimensions
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          // Calculate height to maintain aspect ratio
          const aspectRatio = img.height / img.width;
          const height = width * aspectRatio;
          
          // Add the image to the PDF
          doc.addImage(img, 'PNG', x, y, width, height);
          resolve();
        } catch (error) {
          console.warn('Failed to add logo to PDF:', error);
          // Continue without logo if it fails
          resolve();
        }
      };
      
      img.onerror = () => {
        console.warn('Failed to load logo image, continuing without logo');
        // Continue without logo if it fails to load
        resolve();
      };
      
      img.src = logoUrl;
    });
  } catch (error) {
    console.warn('Error adding logo to PDF:', error);
    // Continue without logo if there's an error
  }
};

/**
 * Adds a footer with CyberCorrect branding to all pages
 * @param doc - The jsPDF document instance
 * @param additionalText - Optional additional text to include in footer
 */
export const addCyberCorrectFooter = (doc: jsPDF, additionalText?: string): void => {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 280, 190, 280);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    
    // Left: CyberCorrect branding
    doc.text('CyberCorrect™ Privacy Platform', 20, 290);
    
    // Center: Page number
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    
    // Right: Date and optional additional text
    const rightText = additionalText 
      ? `${additionalText} | ${new Date().toISOString().split('T')[0]}`
      : new Date().toISOString().split('T')[0];
    doc.text(rightText, 190, 290, { align: 'right' });
  }
};

/**
 * Adds a header with CyberCorrect logo and title
 * @param doc - The jsPDF document instance
 * @param title - Title text for the header
 * @param subtitle - Optional subtitle text
 */
export const addCyberCorrectHeader = async (
  doc: jsPDF,
  title: string,
  subtitle?: string
): Promise<number> => {
  let y = 20;
  
  // Add logo
  await addCyberCorrectLogo(doc, 20, y, 35);
  
  // Title (positioned to the right of logo)
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 65, y + 12);
  
  // Subtitle if provided
  if (subtitle) {
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 65, y + 12);
  }
  
  // Return the Y position after the header
  return y + 25;
};

