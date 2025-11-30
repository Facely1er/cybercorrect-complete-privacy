// Data migration service for transitioning to new schema
// Note: Using lazy import to avoid circular dependency issues
import { enhancedLocalStorageService } from './enhancedLocalStorageService';

interface MigrationStatus {
  completed: boolean;
  lastMigration: string;
  version: string;
  errors: string[];
}

class DataMigrationService {
  private migrationVersion = '1.0.0';
  private migrationKey = 'cc_migration_status';

  async checkMigrationStatus(): Promise<MigrationStatus> {
    try {
      const status = await enhancedLocalStorageService.get(this.migrationKey, {
        completed: false,
        lastMigration: '',
        version: '',
        errors: []
      });
      return status;
    } catch (error) {
      console.error('Error checking migration status:', error);
      return {
        completed: false,
        lastMigration: '',
        version: '',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async markMigrationComplete(): Promise<void> {
    const status: MigrationStatus = {
      completed: true,
      lastMigration: new Date().toISOString(),
      version: this.migrationVersion,
      errors: []
    };
    
    await enhancedLocalStorageService.set(this.migrationKey, status);
  }

  async migrateDataToNewSchema(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      console.log('Starting data migration to new schema...');
      
      // Check if migration is already complete
      const migrationStatus = await this.checkMigrationStatus();
      if (migrationStatus.completed && migrationStatus.version === this.migrationVersion) {
        console.log('Migration already completed');
        return { success: true, errors: [] };
      }

      // Migrate localStorage data to new format
      await this.migrateLocalStorageData();
      
      // Migrate database data if needed
      await this.migrateDatabaseData();
      
      // Mark migration as complete
      await this.markMigrationComplete();
      
      console.log('Data migration completed successfully');
      return { success: true, errors };
      
    } catch (error) {
      console.error('Error during data migration:', error);
      errors.push(error.message);
      return { success: false, errors };
    }
  }

  private async migrateLocalStorageData(): Promise<void> {
    console.log('Migrating localStorage data...');
    
    // Get all existing localStorage keys
    const keys = Object.keys(localStorage);
    const ccKeys = keys.filter(key => 
      key.startsWith('data_rights_') ||
      key.startsWith('privacy_') ||
      key.startsWith('vendor_') ||
      key.startsWith('consent_') ||
      key.startsWith('compliance_') ||
      key.startsWith('form_') ||
      key.startsWith('user_preferences')
    );

    // Migrate each data type
    for (const key of ccKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsedData = JSON.parse(data);
          
          // Determine the data type and migrate accordingly
          if (key.startsWith('data_rights_')) {
            await this.migrateDataRightsRequests(parsedData);
          } else if (key.startsWith('privacy_')) {
            await this.migratePrivacyIncidents(parsedData);
          } else if (key.startsWith('consent_')) {
            await this.migrateConsentRecords(parsedData);
          } else if (key.startsWith('compliance_')) {
            await this.migrateComplianceObligations(parsedData);
          } else if (key.startsWith('vendor_')) {
            await this.migrateVendorAssessments(parsedData);
          } else if (key.startsWith('form_')) {
            await this.migrateFormData(key, parsedData);
          } else if (key.startsWith('user_preferences')) {
            await this.migrateUserPreferences(parsedData);
          }
        }
      } catch (error) {
        console.error(`Error migrating key ${key}:`, error);
      }
    }
  }

  private async migrateDataRightsRequests(data: unknown[]): Promise<void> {
    if (Array.isArray(data)) {
      for (const request of data) {
        await enhancedLocalStorageService.saveDataRightsRequest(request);
      }
    }
  }

  private async migratePrivacyIncidents(data: unknown[]): Promise<void> {
    if (Array.isArray(data)) {
      for (const incident of data) {
        await enhancedLocalStorageService.savePrivacyIncident(incident);
      }
    }
  }

  private async migrateConsentRecords(data: unknown[]): Promise<void> {
    if (Array.isArray(data)) {
      for (const consent of data) {
        await enhancedLocalStorageService.saveConsentRecord(consent);
      }
    }
  }

  private async migrateComplianceObligations(data: unknown[]): Promise<void> {
    if (Array.isArray(data)) {
      for (const obligation of data) {
        await enhancedLocalStorageService.saveComplianceObligation(obligation);
      }
    }
  }

  private async migrateVendorAssessments(data: unknown[]): Promise<void> {
    if (Array.isArray(data)) {
      for (const vendor of data) {
        // Process vendor data
        console.log('Migrating vendor:', vendor);
        await enhancedLocalStorageService.set('vendor_assessments', data);
        break; // Only set once for the array
      }
    }
  }

  private async migrateFormData(key: string, data: unknown): Promise<void> {
    const formId = key.replace('form_', '');
    if (data && data.data) {
      await enhancedLocalStorageService.saveFormData(formId, data.data);
    }
  }

  private async migrateUserPreferences(data: unknown): Promise<void> {
    await enhancedLocalStorageService.saveUserPreferences(data);
  }

  private async migrateDatabaseData(): Promise<void> {
    console.log('Checking database migration...');
    
    try {
      // Check if the new schema exists
      const { error } = await supabase
        .from('cybercorrect.application_metadata')
        .select('version')
        .limit(1);

      if (error) {
        console.log('New schema not found, skipping database migration');
        return;
      }

      console.log('New schema found, database migration not needed');
      
    } catch (error) {
      console.log('Database migration not needed or not possible:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async cleanupOldData(): Promise<void> {
    console.log('Cleaning up old data...');
    
    try {
      // Remove old localStorage keys
      const keys = Object.keys(localStorage);
      const oldKeys = keys.filter(key => 
        key.startsWith('data_rights_') ||
        key.startsWith('privacy_') ||
        key.startsWith('vendor_') ||
        key.startsWith('consent_') ||
        key.startsWith('compliance_') ||
        key.startsWith('form_') ||
        key.startsWith('user_preferences')
      );

      oldKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error(`Error removing old key ${key}:`, error instanceof Error ? error.message : 'Unknown error');
        }
      });

      console.log(`Cleaned up ${oldKeys.length} old localStorage keys`);
      
    } catch (error) {
      console.error('Error during cleanup:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async getMigrationInfo(): Promise<{
    needsMigration: boolean;
    currentVersion: string;
    targetVersion: string;
    estimatedDataSize: number;
  }> {
    const status = await this.checkMigrationStatus();
    const keys = Object.keys(localStorage);
    const dataKeys = keys.filter(key => 
      key.startsWith('data_rights_') ||
      key.startsWith('privacy_') ||
      key.startsWith('vendor_') ||
      key.startsWith('consent_') ||
      key.startsWith('compliance_') ||
      key.startsWith('form_') ||
      key.startsWith('user_preferences')
    );

    let estimatedDataSize = 0;
    dataKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          estimatedDataSize += data.length;
        }
      } catch {
        // Ignore errors
      }
    });

    return {
      needsMigration: !status.completed || status.version !== this.migrationVersion,
      currentVersion: status.version || '0.0.0',
      targetVersion: this.migrationVersion,
      estimatedDataSize
    };
  }
}

// Create singleton instance
export const dataMigrationService = new DataMigrationService();

// Export types
export type { MigrationStatus };