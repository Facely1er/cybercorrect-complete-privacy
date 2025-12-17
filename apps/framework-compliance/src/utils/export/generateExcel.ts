/**
 * Excel Export Utility
 * Uses xlsx library to create Excel workbooks
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface ExcelSheetData {
  name: string;
  headers: string[];
  rows: Array<Array<string | number>>;
}

export interface ExcelWorkbookData {
  sheets: ExcelSheetData[];
  metadata?: {
    title?: string;
    author?: string;
    created?: string;
  };
}

/**
 * Generate Excel workbook from structured data
 */
export function generateExcelWorkbook(
  data: ExcelWorkbookData,
  filename?: string
): void {
  try {
    const workbook = XLSX.utils.book_new();

    // Add metadata if provided
    if (data.metadata) {
      if (data.metadata.title) {
        workbook.Props = {
          Title: data.metadata.title,
          Author: data.metadata.author || 'CyberCorrect',
          CreatedDate: data.metadata.created ? new Date(data.metadata.created) : new Date(),
        };
      }
    }

    // Add each sheet
    data.sheets.forEach((sheet) => {
      // Create worksheet data with headers
      const worksheetData: Array<Array<string | number>> = [
        sheet.headers,
        ...sheet.rows,
      ];

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Auto-size columns
      const columnWidths = sheet.headers.map((_, colIndex) => {
        const maxLength = Math.max(
          sheet.headers[colIndex].length,
          ...sheet.rows.map((row) => String(row[colIndex] || '').length)
        );
        return { wch: Math.min(Math.max(maxLength + 2, 10), 50) };
      });
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });

    // Generate file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const finalFilename = filename || `export-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, finalFilename);
  } catch (error) {
    console.error('Error generating Excel workbook:', error);
    throw new Error('Failed to generate Excel workbook');
  }
}

/**
 * Generate Excel from simple table data
 */
export function generateExcelFromTable(
  headers: string[],
  rows: Array<Array<string | number>>,
  sheetName: string = 'Sheet1',
  filename?: string
): void {
  generateExcelWorkbook(
    {
      sheets: [
        {
          name: sheetName,
          headers,
          rows,
        },
      ],
    },
    filename
  );
}

/**
 * Generate Excel from report data
 */
export function generateReportExcel(
  reportData: {
    title: string;
    summary?: Record<string, string | number>;
    recommendations?: Array<{
      priority: string;
      title: string;
      timeframe: string;
      description?: string;
    }>;
    metadata?: {
      generatedAt?: string;
      generatedBy?: string;
    };
  },
  filename?: string
): void {
  const sheets: ExcelSheetData[] = [];

  // Summary sheet
  if (reportData.summary) {
    sheets.push({
      name: 'Summary',
      headers: ['Metric', 'Value'],
      rows: Object.entries(reportData.summary).map(([key, value]) => [key, value]),
    });
  }

  // Recommendations sheet
  if (reportData.recommendations && reportData.recommendations.length > 0) {
    sheets.push({
      name: 'Recommendations',
      headers: ['Priority', 'Title', 'Timeframe', 'Description'],
      rows: reportData.recommendations.map((rec) => [
        rec.priority,
        rec.title,
        rec.timeframe,
        rec.description || '',
      ]),
    });
  }

  if (sheets.length === 0) {
    throw new Error('No data to export');
  }

  generateExcelWorkbook(
    {
      sheets,
      metadata: {
        title: reportData.title,
        author: reportData.metadata?.generatedBy || 'CyberCorrect',
        created: reportData.metadata?.generatedAt,
      },
    },
    filename
  );
}

