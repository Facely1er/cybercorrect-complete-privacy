// Database health check service
import { supabase } from '../lib/supabase';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  database: {
    connected: boolean;
    responseTime?: number;
    schema: string;
  };
  application: {
    name: string;
    version: string;
    schemaVersion: string;
  };
  errors?: string[];
}

export class DatabaseHealthService {
  private lastHealthCheck: HealthStatus | null = null;
  private checkInterval: number = 30000; // 30 seconds
  private intervalId: NodeJS.Timeout | null = null;

  constructor(checkInterval: number = 30000) {
    this.checkInterval = checkInterval;
  }

  async checkHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    const errors: string[] = [];
    let databaseConnected = false;
    let responseTime: number | undefined;

    try {
      // Test basic database connection
      const { data, error } = await supabase
        .from('cybercorrect.application_metadata')
        .select('application_name, version, schema_version')
        .limit(1);

      responseTime = Date.now() - startTime;

      if (error) {
        errors.push(`Database query failed: ${error.message}`);
      } else if (data && data.length > 0) {
        databaseConnected = true;
      } else {
        errors.push('No application metadata found');
      }
    } catch (error) {
      errors.push(`Database connection failed: ${error}`);
    }

    // Test schema access
    try {
      const { error: schemaError } = await supabase
        .from('cybercorrect.profiles')
        .select('id')
        .limit(1);

      if (schemaError) {
        errors.push(`Schema access failed: ${schemaError.message}`);
      }
    } catch (error) {
      errors.push(`Schema test failed: ${error}`);
    }

    // Test RLS policies
    try {
      const { error: rlsError } = await supabase
        .from('cybercorrect.data_subject_requests')
        .select('id')
        .limit(1);

      if (rlsError && rlsError.code === 'PGRST301') {
        errors.push('RLS policies may be blocking access');
      }
    } catch (error) {
      errors.push(`RLS test failed: ${error}`);
    }

    const healthStatus: HealthStatus = {
      status: errors.length === 0 ? 'healthy' : errors.length < 3 ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: databaseConnected,
        responseTime,
        schema: 'cybercorrect'
      },
      application: {
        name: 'cybercorrect-privacy-portal',
        version: '1.0.0',
        schemaVersion: '1.0.0'
      },
      errors: errors.length > 0 ? errors : undefined
    };

    this.lastHealthCheck = healthStatus;
    return healthStatus;
  }

  async getLastHealthCheck(): Promise<HealthStatus | null> {
    return this.lastHealthCheck;
  }

  startPeriodicChecks(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      try {
        await this.checkHealth();
      } catch (error) {
        console.error('Periodic health check failed:', error);
      }
    }, this.checkInterval);
  }

  stopPeriodicChecks(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async testDatabaseOperations(): Promise<{
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
  }> {
    const results = {
      read: false,
      write: false,
      update: false,
      delete: false
    };

    try {
      // Test read operation
      const { error: readError } = await supabase
        .from('cybercorrect.application_metadata')
        .select('*')
        .limit(1);
      
      results.read = !readError;

      // Test write operation (create a test record)
      const testRecord = {
        cache_key: `health-test-${Date.now()}`,
        cache_type: 'preferences',
        data_hash: 'test-hash',
        user_id: '00000000-0000-0000-0000-000000000000' // Test UUID
      };

      const { error: writeError } = await supabase
        .from('cybercorrect.cache_metadata')
        .insert([testRecord]);

      results.write = !writeError;

      if (!writeError) {
        // Test update operation
        const { error: updateError } = await supabase
          .from('cybercorrect.cache_metadata')
          .update({ data_hash: 'updated-test-hash' })
          .eq('cache_key', testRecord.cache_key);

        results.update = !updateError;

        // Test delete operation
        const { error: deleteError } = await supabase
          .from('cybercorrect.cache_metadata')
          .delete()
          .eq('cache_key', testRecord.cache_key);

        results.delete = !deleteError;
      }
    } catch (error) {
      console.error('Database operations test failed:', error);
    }

    return results;
  }

  async getDatabaseStats(): Promise<{
    totalTables: number;
    totalRecords: number;
    schemaSize: string;
  }> {
    try {
      // Get table count
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'cybercorrect');

      if (tablesError) throw tablesError;

      // Get record counts for each table
      let totalRecords = 0;
      await Promise.all(
        (tables || []).map(async (table) => {
          try {
            const { count, error } = await supabase
              .from(`cybercorrect.${table.table_name}`)
              .select('*', { count: 'exact', head: true });

            if (!error && count) {
              totalRecords += count;
            }
            return { table: table.table_name, count: count || 0 };
          } catch {
            return { table: table.table_name, count: 0 };
          }
        })
      );

      return {
        totalTables: tables?.length || 0,
        totalRecords,
        schemaSize: 'Unknown' // Would need additional query to get actual size
      };
    } catch (error) {
      console.error('Failed to get database stats:', error instanceof Error ? error.message : 'Unknown error');
      return {
        totalTables: 0,
        totalRecords: 0,
        schemaSize: 'Unknown'
      };
    }
  }
}

// Export singleton instance
export const databaseHealthService = new DatabaseHealthService();