// Hook for managing data migration
import { useState, useEffect, useCallback } from 'react';
import { dataMigrationService, type MigrationStatus } from '../services/dataMigrationService';

interface MigrationInfo {
  needsMigration: boolean;
  currentVersion: string;
  targetVersion: string;
  estimatedDataSize: number;
}

interface UseDataMigrationReturn {
  migrationStatus: MigrationStatus;
  migrationInfo: MigrationInfo | null;
  isMigrating: boolean;
  migrationProgress: number;
  migrationErrors: string[];
  startMigration: () => Promise<void>;
  checkMigrationStatus: () => Promise<void>;
  cleanupOldData: () => Promise<void>;
}

export function useDataMigration(): UseDataMigrationReturn {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    completed: false,
    lastMigration: '',
    version: '',
    errors: []
  });
  
  const [migrationInfo, setMigrationInfo] = useState<MigrationInfo | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationErrors, setMigrationErrors] = useState<string[]>([]);

  const checkMigrationStatus = useCallback(async () => {
    try {
      const status = await dataMigrationService.checkMigrationStatus();
      setMigrationStatus(status);
      
      const info = await dataMigrationService.getMigrationInfo();
      setMigrationInfo(info);
    } catch (error) {
      console.error('Error checking migration status:', error);
      setMigrationErrors([error.message]);
    }
  }, []);

  const startMigration = useCallback(async () => {
    if (isMigrating) return;
    
    setIsMigrating(true);
    setMigrationProgress(0);
    setMigrationErrors([]);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setMigrationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      const result = await dataMigrationService.migrateDataToNewSchema();
      
      clearInterval(progressInterval);
      setMigrationProgress(100);
      
      if (result.success) {
        setMigrationErrors([]);
        await checkMigrationStatus();
      } else {
        setMigrationErrors(result.errors);
      }
      
    } catch (error) {
      console.error('Error during migration:', error);
      setMigrationErrors([error.message]);
    } finally {
      setIsMigrating(false);
    }
  }, [isMigrating, checkMigrationStatus]);

  const cleanupOldData = useCallback(async () => {
    try {
      await dataMigrationService.cleanupOldData();
      await checkMigrationStatus();
    } catch (error) {
      console.error('Error during cleanup:', error);
      setMigrationErrors([error.message]);
    }
  }, [checkMigrationStatus]);

  // Check migration status on mount
  useEffect(() => {
    checkMigrationStatus();
  }, [checkMigrationStatus]);

  return {
    migrationStatus,
    migrationInfo,
    isMigrating,
    migrationProgress,
    migrationErrors,
    startMigration,
    checkMigrationStatus,
    cleanupOldData
  };
}