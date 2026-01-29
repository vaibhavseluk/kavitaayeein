import * as XLSX from 'xlsx';
import type { Env } from './types';
import { translateText, countWords } from './translator';

export interface FileData {
  headers: string[];
  rows: any[][];
  textColumns: number[]; // Indices of columns containing text
  numericColumns: number[]; // Indices of columns with numbers/IDs
}

export interface TranslationResult {
  originalData: FileData;
  translatedData: Map<string, any[][]>; // language code -> translated rows
  totalWords: number;
  errors: string[];
}

// Detect if a column contains mostly text (vs numbers/IDs)
function isTextColumn(columnData: any[]): boolean {
  let textCount = 0;
  let totalNonEmpty = 0;

  for (const value of columnData) {
    if (value === null || value === undefined || value === '') continue;
    
    totalNonEmpty++;
    const str = String(value).trim();
    
    // Check if it's mostly text (has spaces, letters, > 10 chars)
    const hasSpaces = str.includes(' ');
    const hasLetters = /[a-zA-Z]/.test(str);
    const longEnough = str.length > 10;
    
    // Exclude things that look like IDs, SKUs, or prices
    const looksLikeId = /^[A-Z0-9-_]+$/.test(str);
    const looksLikePrice = /^\$?\d+(\.\d{2})?$/.test(str);
    
    if ((hasSpaces || longEnough) && hasLetters && !looksLikeId && !looksLikePrice) {
      textCount++;
    }
  }

  // If more than 60% are text-like, consider it a text column
  return totalNonEmpty > 0 && (textCount / totalNonEmpty) > 0.6;
}

// Parse CSV file
export function parseCSV(fileContent: string): FileData {
  const lines = fileContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('Empty file');
  }

  // Parse CSV (simple parser, assumes comma-separated)
  const rows: string[][] = lines.map(line => {
    // Handle quoted fields
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim());
    
    return fields;
  });

  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Detect text columns
  const textColumns: number[] = [];
  const numericColumns: number[] = [];

  for (let colIndex = 0; colIndex < headers.length; colIndex++) {
    const columnData = dataRows.map(row => row[colIndex]);
    
    if (isTextColumn(columnData)) {
      textColumns.push(colIndex);
    } else {
      numericColumns.push(colIndex);
    }
  }

  return {
    headers,
    rows: dataRows,
    textColumns,
    numericColumns
  };
}

// Parse Excel file
export function parseExcel(fileBuffer: ArrayBuffer): FileData {
  const workbook = XLSX.read(fileBuffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // Convert to array of arrays
  const data: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  
  if (data.length === 0) {
    throw new Error('Empty file');
  }

  const headers = data[0].map(h => String(h || ''));
  const dataRows = data.slice(1);

  // Detect text columns
  const textColumns: number[] = [];
  const numericColumns: number[] = [];

  for (let colIndex = 0; colIndex < headers.length; colIndex++) {
    const columnData = dataRows.map(row => row[colIndex]);
    
    if (isTextColumn(columnData)) {
      textColumns.push(colIndex);
    } else {
      numericColumns.push(colIndex);
    }
  }

  return {
    headers,
    rows: dataRows,
    textColumns,
    numericColumns
  };
}

// Translate file data
export async function translateFileData(
  fileData: FileData,
  targetLanguages: string[],
  sourceLanguage: string,
  tonePreset: string,
  brandTerms: string[],
  env: Env,
  db: D1Database,
  onProgress?: (progress: number, status: string) => void
): Promise<TranslationResult> {
  const translatedData = new Map<string, any[][]>();
  let totalWords = 0;
  const errors: string[] = [];

  // Calculate total work
  const totalTasks = targetLanguages.length * fileData.textColumns.length * fileData.rows.length;
  let completedTasks = 0;

  for (const targetLang of targetLanguages) {
    const translatedRows: any[][] = [];

    // Progress update
    if (onProgress) {
      onProgress(0, `Starting translation to ${targetLang}...`);
    }

    for (let rowIndex = 0; rowIndex < fileData.rows.length; rowIndex++) {
      const originalRow = fileData.rows[rowIndex];
      const translatedRow: any[] = [...originalRow]; // Copy row

      // Translate each text column
      for (const colIndex of fileData.textColumns) {
        const originalText = String(originalRow[colIndex] || '');
        
        if (!originalText.trim()) {
          completedTasks++;
          continue;
        }

        try {
          const result = await translateText(
            {
              text: originalText,
              sourceLanguage,
              targetLanguage: targetLang,
              tonePreset: tonePreset as any,
              brandTerms
            },
            env,
            db
          );

          translatedRow[colIndex] = result.translatedText;
          totalWords += result.wordCount;

        } catch (error) {
          const errorMsg = `Row ${rowIndex + 1}, Column "${fileData.headers[colIndex]}": ${error instanceof Error ? error.message : 'Translation failed'}`;
          errors.push(errorMsg);
          translatedRow[colIndex] = originalText; // Keep original on error
        }

        completedTasks++;
        
        // Progress update
        if (onProgress && completedTasks % 10 === 0) {
          const progress = Math.round((completedTasks / totalTasks) * 100);
          onProgress(progress, `Translating ${targetLang}... (${completedTasks}/${totalTasks})`);
        }
      }

      translatedRows.push(translatedRow);
    }

    translatedData.set(targetLang, translatedRows);
  }

  return {
    originalData: fileData,
    translatedData,
    totalWords,
    errors
  };
}

// Generate CSV from data
export function generateCSV(headers: string[], rows: any[][], language?: string): string {
  // Add language suffix to text column headers
  const languageSuffix = language ? `_${language}` : '';
  const csvHeaders = headers.map(h => `"${h}${languageSuffix}"`).join(',');
  
  const csvRows = rows.map(row => 
    row.map(cell => {
      const value = String(cell || '');
      // Escape quotes and wrap in quotes if contains comma or quotes
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  ).join('\n');

  return `${csvHeaders}\n${csvRows}`;
}

// Generate Excel from data
export function generateExcel(headers: string[], rows: any[][], language?: string): ArrayBuffer {
  const languageSuffix = language ? `_${language}` : '';
  const excelHeaders = headers.map(h => `${h}${languageSuffix}`);
  
  const data = [excelHeaders, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Translated');

  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
}

// Create combined file with all languages
export function generateCombinedFile(
  fileData: FileData,
  translatedData: Map<string, any[][]>,
  format: 'csv' | 'excel'
): ArrayBuffer | string {
  const allHeaders: string[] = [];
  const allRows: any[][] = [];

  // Add original headers
  fileData.headers.forEach(header => {
    allHeaders.push(`${header}_original`);
  });

  // Add headers for each language
  for (const [lang, _] of translatedData) {
    fileData.headers.forEach(header => {
      allHeaders.push(`${header}_${lang}`);
    });
  }

  // Combine rows
  for (let rowIndex = 0; rowIndex < fileData.rows.length; rowIndex++) {
    const combinedRow: any[] = [];
    
    // Add original data
    combinedRow.push(...fileData.rows[rowIndex]);
    
    // Add translated data for each language
    for (const [_, translatedRows] of translatedData) {
      combinedRow.push(...translatedRows[rowIndex]);
    }
    
    allRows.push(combinedRow);
  }

  if (format === 'csv') {
    return generateCSV(allHeaders, allRows);
  } else {
    return generateExcel(allHeaders, allRows);
  }
}

// Validate file size and format
export function validateFile(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
  const maxSize = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  const validExtensions = ['.csv', '.xlsx', '.xls'];
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!validExtensions.includes(extension)) {
    return { valid: false, error: 'Invalid file format. Only CSV and Excel files are supported.' };
  }

  return { valid: true };
}

// Estimate word count from file
export async function estimateWordCount(fileData: FileData): Promise<number> {
  let totalWords = 0;

  for (const row of fileData.rows) {
    for (const colIndex of fileData.textColumns) {
      const text = String(row[colIndex] || '');
      totalWords += countWords(text);
    }
  }

  return totalWords;
}
