import { generateSSPPdf, SSPExportData } from '../pdf/generateSSPPdf';
import { generateSSPWordDocument } from '../pdf/generateWord';

// Test data for export functionality
const testSSPData: SSPExportData = {
  metadata: {
    exportDate: new Date().toISOString(),
    version: '1.0',
    organization: 'Test Organization',
    systemName: 'Test System',
    classification: 'CUI'
  },
  systemInfo: {
    name: 'Test System',
    owner: 'Test Owner',
    identifier: 'TEST-001',
    description: 'This is a test system for validating export functionality.',
    classification: 'CUI'
  },
  sections: [
    {
      title: 'System Overview',
      status: 'complete',
      content: { description: 'System overview content' }
    },
    {
      title: 'Security Controls',
      status: 'in-progress',
      content: { controls: 'Security controls content' }
    }
  ],
  controls: [
    {
      id: 'AC-1',
      title: 'Access Control Policy',
      description: 'Establish and maintain access control policies',
      status: 'implemented',
      priority: 'high',
      implementation: {
        status: 'implemented',
        notes: 'Policy has been established and documented',
        lastAssessed: new Date().toISOString(),
        assessedBy: 'Test User'
      }
    },
    {
      id: 'AC-2',
      title: 'Account Management',
      description: 'Manage user accounts and access privileges',
      status: 'partially-implemented',
      priority: 'medium',
      implementation: {
        status: 'partially-implemented',
        notes: 'Basic account management in place, needs enhancement',
        lastAssessed: new Date().toISOString(),
        assessedBy: 'Test User'
      }
    }
  ],
  metrics: {
    totalControls: 2,
    implementedControls: 1,
    compliancePercentage: 75
  }
};

// Test functions
export const testPDFExport = () => {
  try {
    console.log('Testing PDF export...');
    generateSSPPdf(testSSPData);
    console.log('✅ PDF export test completed successfully');
    return true;
  } catch (error) {
    console.error('❌ PDF export test failed:', error);
    return false;
  }
};

export const testWordExport = async () => {
  try {
    console.log('Testing Word export...');
    await generateSSPWordDocument(testSSPData);
    console.log('✅ Word export test completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Word export test failed:', error);
    return false;
  }
};

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - add test buttons to window for manual testing
  (window as Window & { testPDFExport: () => boolean; testWordExport: () => Promise<boolean> }).testPDFExport = testPDFExport;
  (window as Window & { testPDFExport: () => boolean; testWordExport: () => Promise<boolean> }).testWordExport = testWordExport;
  console.log('Export test functions available: window.testPDFExport() and window.testWordExport()');
}
