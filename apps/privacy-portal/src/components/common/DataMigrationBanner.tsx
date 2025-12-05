// Data migration banner component
import React from 'react';
import { useDataMigration } from '../../hooks/useDataMigration';
import { AlertCircle, CheckCircle, Loader2, Trash2 } from 'lucide-react';

export function DataMigrationBanner() {
  const {
    migrationStatus,
    migrationInfo,
    isMigrating,
    migrationProgress,
    migrationErrors,
    startMigration,
    cleanupOldData
  } = useDataMigration();

  // Don't show banner if migration is complete and no errors
  if (migrationStatus.completed && migrationErrors.length === 0) {
    return null;
  }

  const formatDataSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {isMigrating ? (
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
          ) : migrationErrors.length > 0 ? (
            <AlertCircle className="h-5 w-5 text-red-400" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-400" />
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            {isMigrating 
              ? 'Updating Data Storage...' 
              : migrationErrors.length > 0 
                ? 'Data Migration Required'
                : 'Data Storage Updated'
            }
          </h3>
          
          <div className="mt-2 text-sm text-blue-700">
            {isMigrating ? (
              <div>
                <p>Migrating your data to the new optimized storage system...</p>
                <div className="mt-2">
                  <div className="bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${migrationProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs">{Math.round(migrationProgress)}% complete</p>
                </div>
              </div>
            ) : migrationErrors.length > 0 ? (
              <div>
                <p>We need to update your data storage for better performance and security.</p>
                {migrationInfo && (
                  <p className="mt-1">
                    Estimated data size: {formatDataSize(migrationInfo.estimatedDataSize)}
                  </p>
                )}
                <div className="mt-3">
                  <button
                    onClick={startMigration}
                    disabled={isMigrating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMigrating ? 'Updating...' : 'Update Now'}
                  </button>
                </div>
                {migrationErrors.map((error, index) => (
                  <p key={index} className="mt-2 text-red-600 text-xs">
                    Error: {error}
                  </p>
                ))}
              </div>
            ) : (
              <div>
                <p>Your data has been successfully migrated to the new storage system.</p>
                <div className="mt-3">
                  <button
                    onClick={cleanupOldData}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clean Up Old Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}