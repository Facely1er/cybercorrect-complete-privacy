/**
 * Reusable Confirmation Dialog Component
 * 
 * Used for confirming destructive actions like journey resets, data deletion, etc.
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  details?: string[];
  requireExplicitConfirm?: boolean;
}

interface ConfirmDialogProps extends ConfirmDialogOptions {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  details,
  requireExplicitConfirm = false,
  onConfirm,
  onCancel,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText('');
      setIsConfirming(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireExplicitConfirm && confirmationText.toLowerCase() !== 'confirm') {
      return;
    }
    setIsConfirming(true);
    onConfirm();
  };

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const isConfirmDisabled = requireExplicitConfirm && confirmationText.toLowerCase() !== 'confirm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-w-lg w-full animate-in fade-in zoom-in duration-200">
        <Card className={`border-2 ${config.borderColor} shadow-xl`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.iconBg}`}>
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </div>
              <button
                onClick={onCancel}
                className="text-muted-foreground hover:text-foreground transition-colors"
                disabled={isConfirming}
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">{message}</p>

            {details && details.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">This action will:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {requireExplicitConfirm && (
              <div className="space-y-2 pt-2">
                <p className="text-sm text-muted-foreground">
                  Type <span className="font-mono font-bold text-foreground">CONFIRM</span> to proceed:
                </p>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type CONFIRM"
                  autoFocus
                  disabled={isConfirming}
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
                disabled={isConfirming}
              >
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                className={`flex-1 ${config.buttonClass}`}
                disabled={isConfirmDisabled || isConfirming}
              >
                {isConfirming ? 'Processing...' : confirmText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/**
 * Hook to manage confirmation dialog state
 */
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmDialogOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: {
      title: '',
      message: '',
    },
    resolve: null,
  });

  const showConfirm = (options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    dialogState.resolve?.(true);
    setDialogState({ isOpen: false, options: { title: '', message: '' }, resolve: null });
  };

  const handleCancel = () => {
    dialogState.resolve?.(false);
    setDialogState({ isOpen: false, options: { title: '', message: '' }, resolve: null });
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      {...dialogState.options}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return {
    showConfirm,
    ConfirmDialogComponent,
  };
}

export default ConfirmDialog;

