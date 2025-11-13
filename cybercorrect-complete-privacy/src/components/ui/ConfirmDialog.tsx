import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'default';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-lg shadow-lg animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close dialog"
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                variant === 'destructive' && 'bg-destructive/10',
                variant === 'warning' && 'bg-warning/10',
                variant === 'default' && 'bg-primary/10'
              )}
            >
              <AlertTriangle
                className={cn(
                  'h-5 w-5',
                  variant === 'destructive' && 'text-destructive',
                  variant === 'warning' && 'text-warning',
                  variant === 'default' && 'text-primary'
                )}
                aria-hidden="true"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-semibold text-foreground"
              >
                {title}
              </h2>
              <p
                id="confirm-dialog-description"
                className="text-sm text-muted-foreground"
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
