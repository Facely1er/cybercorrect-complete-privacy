/**
 * Journey Validation and Error Recovery
 * 
 * Provides validation functions to detect and recover from inconsistent journey states.
 */

import { JOURNEY_STORAGE_KEYS, JOURNEY_VALIDATION, JOURNEY_VERSION } from '../config/journeyThresholds';
import { IdentifiedGap } from './gapJourneyConfig';

export interface JourneyState {
  currentStepIndex: number;
  completedSteps: string[];
  identifiedGaps: IdentifiedGap[];
  completedGapIds: string[];
  completedToolIds: string[];
  hasCompletedAssessment: boolean;
  version?: string;
  startedAt?: string;
  lastUpdatedAt?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  canRecover: boolean;
}

export interface ValidationError {
  code: string;
  message: string;
  severity: 'critical' | 'error' | 'warning';
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

/**
 * Validate the entire journey state
 */
export function validateJourneyState(state: JourneyState): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate current step index
  if (state.currentStepIndex < 0 || state.currentStepIndex > 3) {
    errors.push({
      code: 'INVALID_STEP_INDEX',
      message: `Invalid step index: ${state.currentStepIndex}. Must be between 0 and 3.`,
      severity: 'error',
      field: 'currentStepIndex',
    });
  }

  // Validate completed steps
  const validStepKeys = ['assess', 'discover', 'act', 'maintain'];
  const invalidSteps = state.completedSteps.filter(step => !validStepKeys.includes(step));
  if (invalidSteps.length > 0) {
    warnings.push({
      code: 'INVALID_COMPLETED_STEPS',
      message: `Found invalid completed step keys: ${invalidSteps.join(', ')}`,
      suggestion: 'These will be filtered out during recovery.',
    });
  }

  // Validate assessment completion consistency
  if (state.completedSteps.includes('assess') && !state.hasCompletedAssessment) {
    errors.push({
      code: 'ASSESSMENT_INCONSISTENCY',
      message: 'Step "assess" is marked as completed but hasCompletedAssessment is false.',
      severity: 'error',
      field: 'hasCompletedAssessment',
    });
  }

  // Validate gaps discovery consistency
  if (state.completedSteps.includes('discover') && state.identifiedGaps.length === 0) {
    warnings.push({
      code: 'NO_GAPS_IDENTIFIED',
      message: 'Discovery step is completed but no gaps were identified.',
      suggestion: 'User may need to retake the assessment.',
    });
  }

  // Validate tool completion consistency
  if (state.completedSteps.includes('act') && state.completedToolIds.length === 0) {
    warnings.push({
      code: 'NO_TOOLS_COMPLETED',
      message: 'Act step is completed but no tools have been used.',
      suggestion: 'Journey may have been manually advanced.',
    });
  }

  // Validate gap IDs consistency
  const validGapIds = state.identifiedGaps.map(g => g.id);
  const invalidCompletedGaps = state.completedGapIds.filter(id => !validGapIds.includes(id));
  if (invalidCompletedGaps.length > 0) {
    warnings.push({
      code: 'ORPHANED_COMPLETED_GAPS',
      message: `Found ${invalidCompletedGaps.length} completed gap(s) that don't exist in identified gaps.`,
      suggestion: 'These will be removed during recovery.',
    });
  }

  // Validate journey age
  if (state.lastUpdatedAt) {
    const lastUpdated = new Date(state.lastUpdatedAt);
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate > JOURNEY_VALIDATION.MAX_JOURNEY_AGE_DAYS) {
      warnings.push({
        code: 'STALE_JOURNEY_DATA',
        message: `Journey data hasn't been updated in ${daysSinceUpdate} days.`,
        suggestion: 'Consider starting a fresh assessment.',
      });
    }
  }

  // Validate version compatibility
  if (state.version && state.version !== JOURNEY_VERSION) {
    warnings.push({
      code: 'VERSION_MISMATCH',
      message: `Journey data version (${state.version}) doesn't match current version (${JOURNEY_VERSION}).`,
      suggestion: 'Data migration may be needed.',
    });
  }

  const criticalErrors = errors.filter(e => e.severity === 'critical');
  const canRecover = criticalErrors.length === 0;

  return {
    valid: errors.length === 0 && warnings.length === 0,
    errors,
    warnings,
    canRecover,
  };
}

/**
 * Attempt to recover from corrupted journey state
 */
export function recoverJourneyState(state: JourneyState): JourneyState {
  const recovered: JourneyState = { ...state };

  // Fix invalid step index
  if (recovered.currentStepIndex < 0) {
    recovered.currentStepIndex = 0;
  } else if (recovered.currentStepIndex > 3) {
    recovered.currentStepIndex = 3;
  }

  // Filter out invalid completed steps
  const validStepKeys = ['assess', 'discover', 'act', 'maintain'];
  recovered.completedSteps = recovered.completedSteps.filter(step => 
    validStepKeys.includes(step)
  );

  // Fix assessment completion inconsistency
  if (recovered.completedSteps.includes('assess') && !recovered.hasCompletedAssessment) {
    recovered.hasCompletedAssessment = true;
  }

  // Remove orphaned completed gaps
  const validGapIds = recovered.identifiedGaps.map(g => g.id);
  recovered.completedGapIds = recovered.completedGapIds.filter(id => 
    validGapIds.includes(id)
  );

  // Update version and timestamp
  recovered.version = JOURNEY_VERSION;
  recovered.lastUpdatedAt = new Date().toISOString();

  return recovered;
}

/**
 * Load and validate journey state from localStorage
 */
export function loadJourneyState(): { state: JourneyState | null; validation: ValidationResult | null } {
  try {
    const currentStepIndex = parseInt(localStorage.getItem(JOURNEY_STORAGE_KEYS.CURRENT_STEP) || '0', 10);
    const completedSteps = JSON.parse(localStorage.getItem(JOURNEY_STORAGE_KEYS.COMPLETED_STEPS) || '[]');
    const identifiedGaps = JSON.parse(localStorage.getItem(JOURNEY_STORAGE_KEYS.IDENTIFIED_GAPS) || '[]');
    const completedGapIds = JSON.parse(localStorage.getItem(JOURNEY_STORAGE_KEYS.COMPLETED_GAPS) || '[]');
    const completedToolIds = JSON.parse(localStorage.getItem(JOURNEY_STORAGE_KEYS.COMPLETED_TOOLS) || '[]');
    const hasCompletedAssessment = localStorage.getItem(JOURNEY_STORAGE_KEYS.ASSESSMENT_COMPLETED) === 'true';
    const version = localStorage.getItem(JOURNEY_STORAGE_KEYS.VERSION) || undefined;
    const startedAt = localStorage.getItem(JOURNEY_STORAGE_KEYS.JOURNEY_STARTED_AT) || undefined;
    const lastUpdatedAt = localStorage.getItem(JOURNEY_STORAGE_KEYS.LAST_UPDATED_AT) || undefined;

    const state: JourneyState = {
      currentStepIndex,
      completedSteps,
      identifiedGaps,
      completedGapIds,
      completedToolIds,
      hasCompletedAssessment,
      version,
      startedAt,
      lastUpdatedAt,
    };

    const validation = validateJourneyState(state);

    return { state, validation };
  } catch (error) {
    console.error('Error loading journey state:', error);
    return { state: null, validation: null };
  }
}

/**
 * Save journey state to localStorage
 */
export function saveJourneyState(state: JourneyState): boolean {
  try {
    localStorage.setItem(JOURNEY_STORAGE_KEYS.CURRENT_STEP, state.currentStepIndex.toString());
    localStorage.setItem(JOURNEY_STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(state.completedSteps));
    localStorage.setItem(JOURNEY_STORAGE_KEYS.IDENTIFIED_GAPS, JSON.stringify(state.identifiedGaps));
    localStorage.setItem(JOURNEY_STORAGE_KEYS.COMPLETED_GAPS, JSON.stringify(state.completedGapIds));
    localStorage.setItem(JOURNEY_STORAGE_KEYS.COMPLETED_TOOLS, JSON.stringify(state.completedToolIds));
    localStorage.setItem(JOURNEY_STORAGE_KEYS.ASSESSMENT_COMPLETED, state.hasCompletedAssessment.toString());
    localStorage.setItem(JOURNEY_STORAGE_KEYS.VERSION, JOURNEY_VERSION);
    localStorage.setItem(JOURNEY_STORAGE_KEYS.LAST_UPDATED_AT, new Date().toISOString());

    if (!localStorage.getItem(JOURNEY_STORAGE_KEYS.JOURNEY_STARTED_AT)) {
      localStorage.setItem(JOURNEY_STORAGE_KEYS.JOURNEY_STARTED_AT, new Date().toISOString());
    }

    return true;
  } catch (error) {
    console.error('Error saving journey state:', error);
    return false;
  }
}

/**
 * Clear all journey data from localStorage
 */
export function clearJourneyState(): void {
  Object.values(JOURNEY_STORAGE_KEYS).forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  });
}

/**
 * Export journey state as JSON
 */
export function exportJourneyData(state: JourneyState): string {
  const exportData = {
    version: JOURNEY_VERSION,
    exportedAt: new Date().toISOString(),
    journey: state,
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import and validate journey data from JSON
 */
export function importJourneyData(jsonString: string): { 
  state: JourneyState | null; 
  validation: ValidationResult | null;
  error?: string;
} {
  try {
    const importData = JSON.parse(jsonString);

    if (!importData.journey) {
      return {
        state: null,
        validation: null,
        error: 'Invalid import format: missing journey data',
      };
    }

    const state: JourneyState = importData.journey;
    const validation = validateJourneyState(state);

    if (!validation.valid && !validation.canRecover) {
      return {
        state: null,
        validation,
        error: 'Import data contains critical errors and cannot be recovered',
      };
    }

    // Auto-recover if possible
    const finalState = validation.canRecover && !validation.valid 
      ? recoverJourneyState(state) 
      : state;

    return {
      state: finalState,
      validation: validateJourneyState(finalState),
    };
  } catch (error) {
    return {
      state: null,
      validation: null,
      error: error instanceof Error ? error.message : 'Failed to parse import data',
    };
  }
}

/**
 * Get a user-friendly error summary
 */
export function getValidationSummary(validation: ValidationResult): string {
  const { errors, warnings } = validation;

  if (errors.length === 0 && warnings.length === 0) {
    return 'Journey state is valid.';
  }

  const parts: string[] = [];

  if (errors.length > 0) {
    parts.push(`${errors.length} error(s) found`);
  }

  if (warnings.length > 0) {
    parts.push(`${warnings.length} warning(s) found`);
  }

  return parts.join(', ') + '.';
}

