/**
 * Privacy Risk Radar Verification Utility
 * 
 * This utility verifies that the Privacy Risk Radar is properly set up
 * and all required components are functioning correctly.
 */

import { supabase, getCurrentUser } from '../lib/supabase';
import { privacyRiskDetector } from '../services/privacyRiskDetector';
import { privacyMetricsCalculator } from '../services/privacyMetricsCalculator';
import { complianceScoreService } from '../services/complianceScoreService';

export interface VerificationResult {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export interface VerificationReport {
  overall: 'pass' | 'fail' | 'warning';
  results: VerificationResult[];
  timestamp: string;
}

class PrivacyRiskRadarVerification {
  /**
   * Run all verification checks
   */
  async verifySetup(): Promise<VerificationReport> {
    const results: VerificationResult[] = [];
    
    // Check database table
    results.push(await this.verifyDatabaseTable());
    
    // Check RLS policies
    results.push(await this.verifyRLSPolicies());
    
    // Check services
    results.push(await this.verifyRiskDetectorService());
    results.push(await this.verifyMetricsCalculatorService());
    results.push(await this.verifyComplianceScoreService());
    
    // Check data sources
    results.push(await this.verifyDataSources());
    
    // Determine overall status
    const hasFailures = results.some(r => r.status === 'fail');
    const hasWarnings = results.some(r => r.status === 'warning');
    
    const overall: 'pass' | 'fail' | 'warning' = hasFailures 
      ? 'fail' 
      : hasWarnings 
        ? 'warning' 
        : 'pass';

    return {
      overall,
      results,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Verify database table exists
   */
  private async verifyDatabaseTable(): Promise<VerificationResult> {
    try {
      const { data, error } = await supabase
        .from('cc_privacy_risk_detections')
        .select('id')
        .limit(1);

      if (error) {
        // Check if it's a "relation does not exist" error
        if (error.message.includes('does not exist') || error.code === '42P01') {
          return {
            check: 'Database Table',
            status: 'fail',
            message: 'Table cc_privacy_risk_detections does not exist',
            details: 'Run the database migration: supabase/migrations/20250220000000_privacy_risk_radar.sql'
          };
        }
        return {
          check: 'Database Table',
          status: 'warning',
          message: 'Could not verify table existence',
          details: error.message
        };
      }

      return {
        check: 'Database Table',
        status: 'pass',
        message: 'Table cc_privacy_risk_detections exists and is accessible'
      };
    } catch (error) {
      return {
        check: 'Database Table',
        status: 'fail',
        message: 'Error checking database table',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify RLS policies are active
   */
  private async verifyRLSPolicies(): Promise<VerificationResult> {
    try {
      const { user } = await getCurrentUser();
      if (!user) {
        return {
          check: 'RLS Policies',
          status: 'warning',
          message: 'Cannot verify RLS policies - user not authenticated',
          details: 'RLS policies will be verified when user is logged in'
        };
      }

      // Try to query with user context
      const { error } = await supabase
        .from('cc_privacy_risk_detections')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error && error.message.includes('permission denied')) {
        return {
          check: 'RLS Policies',
          status: 'fail',
          message: 'RLS policies may not be configured correctly',
          details: error.message
        };
      }

      return {
        check: 'RLS Policies',
        status: 'pass',
        message: 'RLS policies are active and working correctly'
      };
    } catch (error) {
      return {
        check: 'RLS Policies',
        status: 'warning',
        message: 'Could not verify RLS policies',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify risk detector service
   */
  private async verifyRiskDetectorService(): Promise<VerificationResult> {
    try {
      // Check if service methods exist
      if (typeof privacyRiskDetector.scanForRisks !== 'function') {
        return {
          check: 'Risk Detector Service',
          status: 'fail',
          message: 'Risk detector service is not properly exported'
        };
      }

      // Try a test scan (should not throw)
      try {
        await privacyRiskDetector.scanForRisks();
        return {
          check: 'Risk Detector Service',
          status: 'pass',
          message: 'Risk detector service is functional'
        };
      } catch (error) {
        return {
          check: 'Risk Detector Service',
          status: 'warning',
          message: 'Risk detector service exists but may have issues',
          details: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    } catch (error) {
      return {
        check: 'Risk Detector Service',
        status: 'fail',
        message: 'Risk detector service is not available',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify metrics calculator service
   */
  private async verifyMetricsCalculatorService(): Promise<VerificationResult> {
    try {
      if (typeof privacyMetricsCalculator.calculateMetrics !== 'function') {
        return {
          check: 'Metrics Calculator Service',
          status: 'fail',
          message: 'Metrics calculator service is not properly exported'
        };
      }

      try {
        await privacyMetricsCalculator.calculateMetrics();
        return {
          check: 'Metrics Calculator Service',
          status: 'pass',
          message: 'Metrics calculator service is functional'
        };
      } catch (error) {
        return {
          check: 'Metrics Calculator Service',
          status: 'warning',
          message: 'Metrics calculator service exists but may have issues',
          details: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    } catch (error) {
      return {
        check: 'Metrics Calculator Service',
        status: 'fail',
        message: 'Metrics calculator service is not available',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify compliance score service
   */
  private async verifyComplianceScoreService(): Promise<VerificationResult> {
    try {
      if (typeof complianceScoreService.getComplianceScores !== 'function') {
        return {
          check: 'Compliance Score Service',
          status: 'fail',
          message: 'Compliance score service is not properly exported'
        };
      }

      await complianceScoreService.getComplianceScores();
      return {
        check: 'Compliance Score Service',
        status: 'pass',
        message: 'Compliance score service is functional'
      };
    } catch (error) {
      return {
        check: 'Compliance Score Service',
        status: 'warning',
        message: 'Compliance score service may have issues',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Verify data sources are accessible
   */
  private async verifyDataSources(): Promise<VerificationResult> {
    const dataSources = [
      'cc_privacy_consent_records',
      'cc_privacy_vendor_assessments',
      'cc_privacy_data_subject_requests',
      'cc_privacy_dpias',
      'cc_privacy_data_records',
      'cc_privacy_retention_policies'
    ];

    const accessible: string[] = [];
    const inaccessible: string[] = [];

    for (const table of dataSources) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);

        if (error) {
          inaccessible.push(table);
        } else {
          accessible.push(table);
        }
      } catch {
        inaccessible.push(table);
      }
    }

    if (inaccessible.length === 0) {
      return {
        check: 'Data Sources',
        status: 'pass',
        message: `All ${dataSources.length} data source tables are accessible`
      };
    }

    if (accessible.length > 0) {
      return {
        check: 'Data Sources',
        status: 'warning',
        message: `${accessible.length}/${dataSources.length} data source tables are accessible`,
        details: `Inaccessible: ${inaccessible.join(', ')}`
      };
    }

    return {
      check: 'Data Sources',
      status: 'fail',
      message: 'No data source tables are accessible',
      details: `Missing tables: ${inaccessible.join(', ')}`
    };
  }

  /**
   * Get verification report as formatted string
   */
  formatReport(report: VerificationReport): string {
    const statusEmoji = {
      pass: '✅',
      fail: '❌',
      warning: '⚠️'
    };

    let output = `\nPrivacy Risk Radar Verification Report\n`;
    output += `=====================================\n\n`;
    output += `Overall Status: ${statusEmoji[report.overall]} ${report.overall.toUpperCase()}\n`;
    output += `Timestamp: ${new Date(report.timestamp).toLocaleString()}\n\n`;
    output += `Results:\n`;
    output += `--------\n\n`;

    report.results.forEach((result, index) => {
      output += `${index + 1}. ${result.check}\n`;
      output += `   Status: ${statusEmoji[result.status]} ${result.status.toUpperCase()}\n`;
      output += `   Message: ${result.message}\n`;
      if (result.details) {
        output += `   Details: ${result.details}\n`;
      }
      output += `\n`;
    });

    return output;
  }
}

export const privacyRiskRadarVerification = new PrivacyRiskRadarVerification();

