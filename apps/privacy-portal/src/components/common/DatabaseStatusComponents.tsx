// src/components/common/DatabaseStatusBanner.tsx
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, WifiOff, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { databaseService, DatabaseStatus } from '../../services/DatabaseService';

interface DatabaseStatusBannerProps {
  onSync?: () => void;
}

export function DatabaseStatusBanner({ onSync }: DatabaseStatusBannerProps) {
  const [status, setStatus] = useState<DatabaseStatus>(databaseService.getStatus());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(databaseService.getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await databaseService.syncPendingData();
      setStatus(databaseService.getStatus());
      onSync?.();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status.mode) {
      case 'production':
        return status.isConnected ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-500" />
        );
      case 'demo':
        return <Database className="h-5 w-5 text-blue-500" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status.mode) {
      case 'production':
        if (status.isConnected) {
          return 'Connected to production database';
        } else {
          return 'Database unavailable - working offline';
        }
      case 'demo':
        return 'Running in demo mode with sample data';
      case 'offline':
        return 'Working offline - data will sync when connection is restored';
      default:
        return 'Database status unknown';
    }
  };

  const getStatusColor = () => {
    switch (status.mode) {
      case 'production':
        return status.isConnected ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800';
      case 'demo':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'offline':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const showSyncButton = status.mode === 'offline' || (!status.isConnected && status.mode === 'production');

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium">{getStatusMessage()}</p>
            {status.error && (
              <p className="text-sm opacity-75 mt-1">{status.error}</p>
            )}
            {status.lastSync && (
              <p className="text-sm opacity-75 mt-1">
                Last sync: {status.lastSync.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        {showSyncButton && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// src/components/common/DemoModeWarning.tsx

interface DemoModeWarningProps {
  onDismiss?: () => void;
}

export function DemoModeWarning({ onDismiss }: DemoModeWarningProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Demo Mode Active
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              You're currently viewing the application in demo mode with sample data. 
              This means:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>All data is stored locally in your browser</li>
              <li>Data will not persist between browser sessions</li>
              <li>No real database connection is established</li>
              <li>Some features may be limited</li>
            </ul>
            <p className="mt-2">
              To enable full functionality, configure your Supabase environment variables.
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// src/components/common/DataLossWarning.tsx

interface DataLossWarningProps {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function DataLossWarning({ onConfirm, onCancel, isOpen }: DataLossWarningProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              Data Loss Warning
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                You're about to perform an action that may result in data loss:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Local data will be cleared</li>
                <li>Unsaved changes will be lost</li>
                <li>This action cannot be undone</li>
              </ul>
              <p className="mt-2 font-medium">
                Are you sure you want to continue?
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// src/hooks/useDatabaseStatus.ts

// eslint-disable-next-line react-refresh/only-export-components
export function useDatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus>(databaseService.getStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(databaseService.getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    status,
    isOnline: databaseService.isOnline(),
    isDemoMode: databaseService.isDemoMode(),
    refreshStatus: () => setStatus(databaseService.getStatus())
  };
}
