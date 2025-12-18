/**
 * ImportDialog Component
 * Reusable dialog for importing CSV/JSON data into tools
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './Dialog';
import { Button } from './Button';
import { FileUpload } from './FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import { parseCSV, readFileAsText as readCSV, ParsedCSVData } from '../../utils/import/csvParser';
import { parseJSON, readFileAsText as readJSON, ParsedJSONData, JSONValidateOptions } from '../../utils/import/jsonValidator';
import { toast } from './Toaster';
import { AlertCircle, CheckCircle, Upload, Info, FileText, Code } from 'lucide-react';

export interface ImportDialogProps<T = Record<string, unknown>> {
  open: boolean;
  onClose: () => void;
  onImport: (data: T[]) => void | Promise<void>;
  title?: string;
  description?: string;
  csvHeaders?: string[];
  jsonValidation?: JSONValidateOptions<T>;
  maxRecords?: number;
}

type ImportFormat = 'csv' | 'json';

export function ImportDialog<T = Record<string, unknown>>({
  open,
  onClose,
  onImport,
  title = 'Import Data',
  description = 'Upload a CSV or JSON file to import data',
  csvHeaders,
  jsonValidation,
  maxRecords = 1000,
}: ImportDialogProps<T>) {
  const [format, setFormat] = useState<ImportFormat>('csv');
  const [parseResult, setParseResult] = useState<ParsedCSVData<T> | ParsedJSONData<T> | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFileSelect = async (selectedFile: File) => {
    setParseResult(null);

    try {
      if (format === 'csv') {
        const content = await readCSV(selectedFile);
        const result = parseCSV<T>(content, {
          headers: csvHeaders,
          validateHeaders: !!csvHeaders,
        });
        setParseResult(result);

        if (result.errors.length > 0) {
          toast.error('Parse Errors', `Found ${result.errors.length} error(s) in CSV file`);
        } else if (result.data.length > maxRecords) {
          toast.warning('Large Import', `File contains ${result.data.length} records. Only first ${maxRecords} will be imported.`);
        } else {
          toast.success('File Parsed', `Successfully parsed ${result.data.length} record(s)`);
        }
      } else {
        const content = await readJSON(selectedFile);
        const result = parseJSON<T>(content, jsonValidation);
        setParseResult(result);

        if (result.errors.length > 0) {
          toast.error('Parse Errors', `Found ${result.errors.length} error(s) in JSON file`);
        } else if (result.data.length > maxRecords) {
          toast.warning('Large Import', `File contains ${result.data.length} records. Only first ${maxRecords} will be imported.`);
        } else {
          toast.success('File Parsed', `Successfully parsed ${result.data.length} record(s)`);
        }
      }
    } catch (error) {
      toast.error('Parse Failed', error instanceof Error ? error.message : 'Failed to parse file');
      setParseResult(null);
    }
  };

  const handleImport = async () => {
    if (!parseResult || parseResult.data.length === 0) {
      toast.error('No Data', 'No valid data to import');
      return;
    }

    try {
      setImporting(true);
      
      // Limit records if necessary
      const dataToImport = parseResult.data.slice(0, maxRecords);
      
      await onImport(dataToImport);
      
      toast.success(
        'Import Successful',
        `Successfully imported ${dataToImport.length} record(s)`
      );
      
      handleClose();
    } catch (error) {
      toast.error('Import Failed', error instanceof Error ? error.message : 'Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setParseResult(null);
    setImporting(false);
    onClose();
  };

  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat as ImportFormat);
    setParseResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {title}
            </div>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Format Selection */}
          <Tabs value={format} onValueChange={handleFormatChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                CSV File
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                JSON File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="mt-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".csv"
                title="Upload CSV File"
                description="Drag and drop or click to browse"
              />
              
              {csvHeaders && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Expected Headers:</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {csvHeaders.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="json" className="mt-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".json"
                title="Upload JSON File"
                description="Drag and drop or click to browse"
              />
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Expected Format:</p>
                    <p className="text-muted-foreground text-xs">
                      JSON array of objects or single object
                    </p>
                    <pre className="mt-2 p-2 bg-background rounded text-xs font-mono overflow-x-auto">
{`[
  { "field1": "value1", "field2": "value2" },
  { "field1": "value3", "field2": "value4" }
]`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Parse Results */}
          {parseResult && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {parseResult.validCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Valid Records</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {parseResult.invalidCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Invalid Records</div>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {parseResult.warnings.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Warnings</div>
                </div>
              </div>

              {/* Errors */}
              {parseResult.errors.length > 0 && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <p className="font-medium text-sm text-destructive">
                      {parseResult.errors.length} Error(s) Found
                    </p>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {parseResult.errors.slice(0, 5).map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                      {parseResult.errors.length > 5 && (
                        <li className="text-muted-foreground italic">
                          ... and {parseResult.errors.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {parseResult.warnings.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <p className="font-medium text-sm text-yellow-700 dark:text-yellow-300">
                      {parseResult.warnings.length} Warning(s)
                    </p>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      {parseResult.warnings.slice(0, 3).map((warning, idx) => (
                        <li key={idx}>• {warning}</li>
                      ))}
                      {parseResult.warnings.length > 3 && (
                        <li className="text-muted-foreground italic">
                          ... and {parseResult.warnings.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {parseResult.validCount > 0 && parseResult.errors.length === 0 && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <p className="font-medium text-sm text-success">
                      Ready to import {Math.min(parseResult.validCount, maxRecords)} record(s)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={importing}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!parseResult || parseResult.validCount === 0 || importing}
              className="min-w-[120px]"
            >
              {importing ? (
                <>Processing...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


