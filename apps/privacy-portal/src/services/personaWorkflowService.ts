// Persona-specific workflow service that integrates with existing platform features
// import { Persona, UseCase, UseCaseStep } from '../types/personas';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  component: string;
  route: string;
  required: boolean;
  estimatedTime: string;
  dependencies: string[];
  validationRules: ValidationRule[];
  nextSteps: string[];
  previousSteps: string[];
  platformFeature: string;
  apiEndpoint?: string;
  formFields?: FormField[];
  successCriteria: string[];
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'phone' | 'date' | 'number' | 'custom';
  message: string;
  customValidator?: (value: unknown) => boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'checkbox' | 'date';
  required: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
}

export interface WorkflowProgress {
  workflowId: string;
  currentStep: string;
  completedSteps: string[];
  startedAt: string;
  lastUpdated: string;
  data: Record<string, unknown>;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'failed';
}

// Persona-specific workflow definitions that integrate with existing platform features
export const PERSONA_WORKFLOWS: Record<string, Record<string, WorkflowStep[]>> = {
  worker: {
    'data-access-request': [
      {
        id: 'welcome-data-access',
        title: 'Welcome to Data Access Request',
        description: 'Learn about your right to access personal employment data',
        component: 'DataAccessWelcomeStep',
        route: '/privacy/data-rights/access/welcome',
        required: true,
        estimatedTime: '1 minute',
        dependencies: [],
        validationRules: [],
        nextSteps: ['select-data-types'],
        previousSteps: [],
        platformFeature: 'data-rights-portal',
        successCriteria: ['User understands data access rights']
      },
      {
        id: 'select-data-types',
        title: 'Select Data Types to Access',
        description: 'Choose which types of personal data you want to access',
        component: 'DataTypeSelectionStep',
        route: '/privacy/data-rights/access/select-types',
        required: true,
        estimatedTime: '2 minutes',
        dependencies: ['welcome-data-access'],
        validationRules: [
          { field: 'dataTypes', type: 'required', message: 'Please select at least one data type' }
        ],
        nextSteps: ['provide-identity-verification'],
        previousSteps: ['welcome-data-access'],
        platformFeature: 'data-rights-form',
        formFields: [
          {
            name: 'dataTypes',
            label: 'Data Types to Access',
            type: 'checkbox',
            required: true,
            options: [
              { value: 'personal_info', label: 'Personal Information' },
              { value: 'employment_records', label: 'Employment Records' },
              { value: 'performance_data', label: 'Performance Data' },
              { value: 'payroll_data', label: 'Payroll Information' },
              { value: 'benefits_data', label: 'Benefits Information' },
              { value: 'disciplinary_records', label: 'Disciplinary Records' }
            ],
            helpText: 'Select all types of data you want to access'
          }
        ],
        successCriteria: ['User selects at least one data type']
      },
      {
        id: 'provide-identity-verification',
        title: 'Identity Verification',
        description: 'Provide information to verify your identity',
        component: 'IdentityVerificationStep',
        route: '/privacy/data-rights/access/verify-identity',
        required: true,
        estimatedTime: '2 minutes',
        dependencies: ['select-data-types'],
        validationRules: [
          { field: 'employeeId', type: 'required', message: 'Employee ID is required' },
          { field: 'verificationMethod', type: 'required', message: 'Please select verification method' }
        ],
        nextSteps: ['review-request'],
        previousSteps: ['select-data-types'],
        platformFeature: 'identity-verification',
        formFields: [
          {
            name: 'employeeId',
            label: 'Employee ID',
            type: 'text',
            required: true,
            placeholder: 'Enter your employee ID'
          },
          {
            name: 'verificationMethod',
            label: 'Verification Method',
            type: 'select',
            required: true,
            options: [
              { value: 'email', label: 'Email Verification' },
              { value: 'phone', label: 'Phone Verification' },
              { value: 'id_document', label: 'ID Document Upload' }
            ]
          }
        ],
        successCriteria: ['User provides valid employee ID and verification method']
      },
      {
        id: 'review-request',
        title: 'Review Your Request',
        description: 'Review and submit your data access request',
        component: 'RequestReviewStep',
        route: '/privacy/data-rights/access/review',
        required: true,
        estimatedTime: '1 minute',
        dependencies: ['provide-identity-verification'],
        validationRules: [],
        nextSteps: ['submit-request'],
        previousSteps: ['provide-identity-verification'],
        platformFeature: 'data-rights-form',
        successCriteria: ['User reviews request details']
      },
      {
        id: 'submit-request',
        title: 'Submit Request',
        description: 'Submit your data access request for processing',
        component: 'RequestSubmissionStep',
        route: '/privacy/data-rights/access/submit',
        required: true,
        estimatedTime: '30 seconds',
        dependencies: ['review-request'],
        validationRules: [],
        nextSteps: ['track-request'],
        previousSteps: ['review-request'],
        platformFeature: 'data-rights-service',
        apiEndpoint: '/api/data-rights/requests',
        successCriteria: ['Request submitted successfully']
      },
      {
        id: 'track-request',
        title: 'Track Request Status',
        description: 'Monitor the progress of your data access request',
        component: 'RequestTrackingStep',
        route: '/privacy/data-rights/access/track',
        required: false,
        estimatedTime: '30 seconds',
        dependencies: ['submit-request'],
        validationRules: [],
        nextSteps: [],
        previousSteps: ['submit-request'],
        platformFeature: 'request-tracking',
        successCriteria: ['User can view request status']
      }
    ],
    'data-correction-request': [
      {
        id: 'welcome-correction',
        title: 'Welcome to Data Correction Request',
        description: 'Learn about your right to correct inaccurate personal data',
        component: 'DataCorrectionWelcomeStep',
        route: '/privacy/data-rights/correction/welcome',
        required: true,
        estimatedTime: '1 minute',
        dependencies: [],
        validationRules: [],
        nextSteps: ['identify-inaccurate-data'],
        previousSteps: [],
        platformFeature: 'data-rights-portal',
        successCriteria: ['User understands data correction rights']
      },
      {
        id: 'identify-inaccurate-data',
        title: 'Identify Inaccurate Data',
        description: 'Specify which personal data is inaccurate or incomplete',
        component: 'InaccurateDataIdentificationStep',
        route: '/privacy/data-rights/correction/identify',
        required: true,
        estimatedTime: '3 minutes',
        dependencies: ['welcome-correction'],
        validationRules: [
          { field: 'inaccurateFields', type: 'required', message: 'Please specify which data is inaccurate' },
          { field: 'currentValue', type: 'required', message: 'Please provide current value' },
          { field: 'correctValue', type: 'required', message: 'Please provide correct value' }
        ],
        nextSteps: ['provide-supporting-documentation'],
        previousSteps: ['welcome-correction'],
        platformFeature: 'data-rights-form',
        formFields: [
          {
            name: 'inaccurateFields',
            label: 'Inaccurate Data Fields',
            type: 'checkbox',
            required: true,
            options: [
              { value: 'name', label: 'Name' },
              { value: 'address', label: 'Address' },
              { value: 'phone', label: 'Phone Number' },
              { value: 'email', label: 'Email Address' },
              { value: 'emergency_contact', label: 'Emergency Contact' },
              { value: 'benefits_info', label: 'Benefits Information' }
            ]
          },
          {
            name: 'currentValue',
            label: 'Current (Inaccurate) Value',
            type: 'textarea',
            required: true,
            placeholder: 'Describe the current inaccurate information'
          },
          {
            name: 'correctValue',
            label: 'Correct Value',
            type: 'textarea',
            required: true,
            placeholder: 'Provide the correct information'
          }
        ],
        successCriteria: ['User identifies specific inaccurate data fields']
      },
      {
        id: 'provide-supporting-documentation',
        title: 'Supporting Documentation',
        description: 'Upload documents that support your correction request',
        component: 'SupportingDocumentationStep',
        route: '/privacy/data-rights/correction/documentation',
        required: false,
        estimatedTime: '2 minutes',
        dependencies: ['identify-inaccurate-data'],
        validationRules: [],
        nextSteps: ['review-correction-request'],
        previousSteps: ['identify-inaccurate-data'],
        platformFeature: 'file-upload',
        successCriteria: ['User uploads supporting documents (optional)']
      },
      {
        id: 'review-correction-request',
        title: 'Review Correction Request',
        description: 'Review and submit your data correction request',
        component: 'CorrectionRequestReviewStep',
        route: '/privacy/data-rights/correction/review',
        required: true,
        estimatedTime: '1 minute',
        dependencies: ['provide-supporting-documentation'],
        validationRules: [],
        nextSteps: ['submit-correction-request'],
        previousSteps: ['provide-supporting-documentation'],
        platformFeature: 'data-rights-form',
        successCriteria: ['User reviews correction request details']
      },
      {
        id: 'submit-correction-request',
        title: 'Submit Correction Request',
        description: 'Submit your data correction request for processing',
        component: 'CorrectionRequestSubmissionStep',
        route: '/privacy/data-rights/correction/submit',
        required: true,
        estimatedTime: '30 seconds',
        dependencies: ['review-correction-request'],
        validationRules: [],
        nextSteps: ['track-correction-request'],
        previousSteps: ['review-correction-request'],
        platformFeature: 'data-rights-service',
        apiEndpoint: '/api/data-rights/requests',
        successCriteria: ['Correction request submitted successfully']
      },
      {
        id: 'track-correction-request',
        title: 'Track Correction Request',
        description: 'Monitor the progress of your data correction request',
        component: 'CorrectionRequestTrackingStep',
        route: '/privacy/data-rights/correction/track',
        required: false,
        estimatedTime: '30 seconds',
        dependencies: ['submit-correction-request'],
        validationRules: [],
        nextSteps: [],
        previousSteps: ['submit-correction-request'],
        platformFeature: 'request-tracking',
        successCriteria: ['User can view correction request status']
      }
    ]
  },
  hr_staff: {
    'process-data-request': [
      {
        id: 'review-incoming-request',
        title: 'Review Incoming Data Request',
        description: 'Review the data rights request submitted by an employee',
        component: 'IncomingRequestReviewStep',
        route: '/privacy/data-rights/process/review',
        required: true,
        estimatedTime: '3 minutes',
        dependencies: [],
        validationRules: [
          { field: 'requestId', type: 'required', message: 'Request ID is required' }
        ],
        nextSteps: ['verify-requester-identity'],
        previousSteps: [],
        platformFeature: 'data-rights-management',
        successCriteria: ['HR staff reviews request details']
      },
      {
        id: 'verify-requester-identity',
        title: 'Verify Requester Identity',
        description: 'Verify the identity of the person making the request',
        component: 'RequesterIdentityVerificationStep',
        route: '/privacy/data-rights/process/verify-identity',
        required: true,
        estimatedTime: '2 minutes',
        dependencies: ['review-incoming-request'],
        validationRules: [
          { field: 'verificationStatus', type: 'required', message: 'Please verify identity' }
        ],
        nextSteps: ['collect-requested-data'],
        previousSteps: ['review-incoming-request'],
        platformFeature: 'identity-verification',
        successCriteria: ['Requester identity verified']
      },
      {
        id: 'collect-requested-data',
        title: 'Collect Requested Data',
        description: 'Gather the requested employee data from various systems',
        component: 'DataCollectionStep',
        route: '/privacy/data-rights/process/collect-data',
        required: true,
        estimatedTime: '10 minutes',
        dependencies: ['verify-requester-identity'],
        validationRules: [],
        nextSteps: ['prepare-response'],
        previousSteps: ['verify-requester-identity'],
        platformFeature: 'data-collection',
        successCriteria: ['All requested data collected']
      },
      {
        id: 'prepare-response',
        title: 'Prepare Response',
        description: 'Prepare the response with the requested data',
        component: 'ResponsePreparationStep',
        route: '/privacy/data-rights/process/prepare-response',
        required: true,
        estimatedTime: '5 minutes',
        dependencies: ['collect-requested-data'],
        validationRules: [],
        nextSteps: ['deliver-response'],
        previousSteps: ['collect-requested-data'],
        platformFeature: 'response-preparation',
        successCriteria: ['Response prepared with requested data']
      },
      {
        id: 'deliver-response',
        title: 'Deliver Response',
        description: 'Deliver the response to the requester within legal timeframes',
        component: 'ResponseDeliveryStep',
        route: '/privacy/data-rights/process/deliver',
        required: true,
        estimatedTime: '2 minutes',
        dependencies: ['prepare-response'],
        validationRules: [],
        nextSteps: ['update-request-status'],
        previousSteps: ['prepare-response'],
        platformFeature: 'response-delivery',
        successCriteria: ['Response delivered to requester']
      },
      {
        id: 'update-request-status',
        title: 'Update Request Status',
        description: 'Update the request status and log completion',
        component: 'RequestStatusUpdateStep',
        route: '/privacy/data-rights/process/update-status',
        required: true,
        estimatedTime: '1 minute',
        dependencies: ['deliver-response'],
        validationRules: [],
        nextSteps: [],
        previousSteps: ['deliver-response'],
        platformFeature: 'request-management',
        successCriteria: ['Request status updated to completed']
      }
    ],
    'manage-consent': [
      {
        id: 'review-consent-status',
        title: 'Review Employee Consent Status',
        description: 'Review current consent status for all employees',
        component: 'ConsentStatusReviewStep',
        route: '/privacy/consent/review-status',
        required: true,
        estimatedTime: '5 minutes',
        dependencies: [],
        validationRules: [],
        nextSteps: ['identify-consent-issues'],
        previousSteps: [],
        platformFeature: 'consent-management',
        successCriteria: ['HR staff reviews consent status']
      },
      {
        id: 'identify-consent-issues',
        title: 'Identify Consent Issues',
        description: 'Identify employees with missing or expired consent',
        component: 'ConsentIssuesIdentificationStep',
        route: '/privacy/consent/identify-issues',
        required: true,
        estimatedTime: '3 minutes',
        dependencies: ['review-consent-status'],
        validationRules: [],
        nextSteps: ['update-consent-records'],
        previousSteps: ['review-consent-status'],
        platformFeature: 'consent-tracking',
        successCriteria: ['Consent issues identified']
      },
      {
        id: 'update-consent-records',
        title: 'Update Consent Records',
        description: 'Update consent records based on employee preferences',
        component: 'ConsentRecordsUpdateStep',
        route: '/privacy/consent/update-records',
        required: true,
        estimatedTime: '10 minutes',
        dependencies: ['identify-consent-issues'],
        validationRules: [],
        nextSteps: ['notify-employees'],
        previousSteps: ['identify-consent-issues'],
        platformFeature: 'consent-management',
        successCriteria: ['Consent records updated']
      },
      {
        id: 'notify-employees',
        title: 'Notify Employees',
        description: 'Notify employees about consent updates or requirements',
        component: 'EmployeeNotificationStep',
        route: '/privacy/consent/notify-employees',
        required: false,
        estimatedTime: '2 minutes',
        dependencies: ['update-consent-records'],
        validationRules: [],
        nextSteps: [],
        previousSteps: ['update-consent-records'],
        platformFeature: 'notification-system',
        successCriteria: ['Employees notified about consent changes']
      }
    ]
  },
  dpo: {
    'privacy-program-oversight': [
      {
        id: 'review-compliance-status',
        title: 'Review Compliance Status',
        description: 'Review overall privacy compliance status and metrics',
        component: 'ComplianceStatusReviewStep',
        route: '/privacy/analytics/compliance-status',
        required: true,
        estimatedTime: '10 minutes',
        dependencies: [],
        validationRules: [],
        nextSteps: ['identify-compliance-gaps'],
        previousSteps: [],
        platformFeature: 'compliance-analytics',
        successCriteria: ['DPO reviews compliance metrics']
      },
      {
        id: 'identify-compliance-gaps',
        title: 'Identify Compliance Gaps',
        description: 'Identify areas where compliance may be lacking',
        component: 'ComplianceGapsIdentificationStep',
        route: '/privacy/analytics/identify-gaps',
        required: true,
        estimatedTime: '15 minutes',
        dependencies: ['review-compliance-status'],
        validationRules: [],
        nextSteps: ['develop-remediation-plan'],
        previousSteps: ['review-compliance-status'],
        platformFeature: 'risk-assessment',
        successCriteria: ['Compliance gaps identified']
      },
      {
        id: 'develop-remediation-plan',
        title: 'Develop Remediation Plan',
        description: 'Create a plan to address identified compliance gaps',
        component: 'RemediationPlanDevelopmentStep',
        route: '/privacy/analytics/remediation-plan',
        required: true,
        estimatedTime: '20 minutes',
        dependencies: ['identify-compliance-gaps'],
        validationRules: [],
        nextSteps: ['implement-remediation'],
        previousSteps: ['identify-compliance-gaps'],
        platformFeature: 'remediation-planning',
        successCriteria: ['Remediation plan developed']
      },
      {
        id: 'implement-remediation',
        title: 'Implement Remediation',
        description: 'Implement the remediation plan to address compliance gaps',
        component: 'RemediationImplementationStep',
        route: '/privacy/analytics/implement-remediation',
        required: true,
        estimatedTime: '30 minutes',
        dependencies: ['develop-remediation-plan'],
        validationRules: [],
        nextSteps: ['monitor-remediation-progress'],
        previousSteps: ['develop-remediation-plan'],
        platformFeature: 'remediation-tracking',
        successCriteria: ['Remediation implementation started']
      },
      {
        id: 'monitor-remediation-progress',
        title: 'Monitor Remediation Progress',
        description: 'Monitor the progress of remediation efforts',
        component: 'RemediationProgressMonitoringStep',
        route: '/privacy/analytics/monitor-progress',
        required: true,
        estimatedTime: '5 minutes',
        dependencies: ['implement-remediation'],
        validationRules: [],
        nextSteps: [],
        previousSteps: ['implement-remediation'],
        platformFeature: 'progress-tracking',
        successCriteria: ['Remediation progress monitored']
      }
    ]
  }
};

// Workflow management service
export class PersonaWorkflowService {
  private static instance: PersonaWorkflowService;
  private workflows: Record<string, Record<string, WorkflowStep[]>> = PERSONA_WORKFLOWS;

  static getInstance(): PersonaWorkflowService {
    if (!PersonaWorkflowService.instance) {
      PersonaWorkflowService.instance = new PersonaWorkflowService();
    }
    return PersonaWorkflowService.instance;
  }

  getWorkflowSteps(personaId: string, workflowId: string): WorkflowStep[] {
    return this.workflows[personaId]?.[workflowId] || [];
  }

  getAvailableWorkflows(personaId: string): string[] {
    return Object.keys(this.workflows[personaId] || {});
  }

  getNextStep(personaId: string, workflowId: string, currentStepId: string): WorkflowStep | null {
    const steps = this.getWorkflowSteps(personaId, workflowId);
    const currentStep = steps.find(step => step.id === currentStepId);
    if (!currentStep || currentStep.nextSteps.length === 0) {
      return null;
    }
    return steps.find(step => step.id === currentStep.nextSteps[0]) || null;
  }

  getPreviousStep(personaId: string, workflowId: string, currentStepId: string): WorkflowStep | null {
    const steps = this.getWorkflowSteps(personaId, workflowId);
    const currentStep = steps.find(step => step.id === currentStepId);
    if (!currentStep || currentStep.previousSteps.length === 0) {
      return null;
    }
    return steps.find(step => step.id === currentStep.previousSteps[0]) || null;
  }

  validateStepData(step: WorkflowStep, data: Record<string, unknown>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const rule of step.validationRules) {
      const value = data[rule.field];
      
      switch (rule.type) {
        case 'required':
          if (!value || (Array.isArray(value) && value.length === 0)) {
            errors.push(rule.message);
          }
          break;
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(rule.message);
          }
          break;
        case 'phone':
          if (value && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\D/g, ''))) {
            errors.push(rule.message);
          }
          break;
        case 'custom':
          if (value && rule.customValidator && !rule.customValidator(value)) {
            errors.push(rule.message);
          }
          break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getWorkflowProgress(personaId: string, workflowId: string): WorkflowProgress | null {
    // In a real implementation, this would fetch from a database
    const stored = localStorage.getItem(`workflow_progress_${personaId}_${workflowId}`);
    return stored ? JSON.parse(stored) : null;
  }

  saveWorkflowProgress(progress: WorkflowProgress): void {
    localStorage.setItem(
      `workflow_progress_${progress.workflowId}`,
      JSON.stringify(progress)
    );
  }

  completeWorkflowStep(personaId: string, workflowId: string, stepId: string, data: Record<string, unknown>): boolean {
    const step = this.workflows[personaId]?.[workflowId]?.find(s => s.id === stepId);
    if (!step) return false;

    const validation = this.validateStepData(step, data);
    if (!validation.isValid) return false;

    // Update workflow progress
    const progress = this.getWorkflowProgress(personaId, workflowId) || {
      workflowId: `${personaId}_${workflowId}`,
      currentStep: stepId,
      completedSteps: [],
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      data: {},
      status: 'in_progress' as const
    };

    progress.completedSteps.push(stepId);
    progress.data = { ...progress.data, ...data };
    progress.lastUpdated = new Date().toISOString();

    // Move to next step
    const nextStep = this.getNextStep(personaId, workflowId, stepId);
    if (nextStep) {
      progress.currentStep = nextStep.id;
    } else {
      progress.status = 'completed';
    }

    this.saveWorkflowProgress(progress);
    return true;
  }
}

export const personaWorkflowService = PersonaWorkflowService.getInstance();