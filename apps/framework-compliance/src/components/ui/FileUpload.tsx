/**
 * FileUpload Component
 * Reusable file upload component with drag-and-drop support
 */

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/common/cn';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export function FileUpload({
  onFileSelect,
  accept = '.csv,.json',
  maxSize = 10 * 1024 * 1024, // 10MB default
  disabled = false,
  className,
  title = 'Upload File',
  description = 'Drag and drop or click to browse',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File too large. Maximum size is ${maxSizeMB}MB.`,
      };
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!acceptedExtensions.includes(fileExtension)) {
        return {
          valid: false,
          error: `Invalid file type. Accepted types: ${accept}`,
        };
      }
    }

    return { valid: true };
  };

  const handleFile = (file: File) => {
    setError(null);
    
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
          isDragging && 'border-primary bg-primary/5 scale-[1.02]',
          !isDragging && !error && !selectedFile && 'border-border hover:border-primary/50 hover:bg-muted/30',
          error && 'border-destructive bg-destructive/5',
          selectedFile && !error && 'border-success bg-success/5',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
          aria-label="File upload input"
        />

        {!selectedFile && !error && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className={cn(
                'h-12 w-12 transition-colors',
                isDragging ? 'text-primary' : 'text-muted-foreground'
              )} />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Accepted formats: {accept} • Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={disabled}>
              Browse Files
            </Button>
          </div>
        )}

        {selectedFile && !error && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">File Selected</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <File className="h-4 w-4" />
                <span className="font-medium">{selectedFile.name}</span>
                <span>({(selectedFile.size / 1024).toFixed(2)} KB)</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        )}

        {error && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <div>
              <p className="text-lg font-medium text-destructive mb-1">Upload Failed</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

