import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { personaWorkflowService, WorkflowStep } from '../../../services/personaWorkflowService';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Select } from '../../ui/Select';
import { Checkbox } from '../../ui/Checkbox';
import { Badge } from '../../ui/Badge';
import { ProgressTracker } from '../../../common/ProgressTracker';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  FileText,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';

interface WorkflowStepComponentProps {
  step: WorkflowStep;
  workflowId: string;
  onStepComplete: (stepId: string, data: Record<string, unknown>) => void;
  onStepBack: () => void;
  progress: number;
}

export const WorkflowStepComponent: React.FC<WorkflowStepComponentProps> = ({
  step,
  workflowId,
  onStepComplete,
  onStepBack,
  progress
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { personaId } = useParams<{ personaId: string }>();

  useEffect(() => {
    // Load existing data if available
    const existingProgress = personaWorkflowService.getWorkflowProgress(personaId || '', workflowId);
    if (existingProgress?.data) {
      setFormData(existingProgress.data);
    }
  }, [personaId, workflowId]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const validation = personaWorkflowService.validateStepData(step, formData);
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        // Extract field name from error message (simplified approach)
        const field = step.validationRules.find(rule => rule.message === error)?.field || 'general';
        newErrors[field] = error;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = personaWorkflowService.completeWorkflowStep(
        personaId || '',
        workflowId,
        step.id,
        formData
      );

      if (success) {
        onStepComplete(step.id, formData);
        // Navigate to next step or complete workflow
        const nextStep = personaWorkflowService.getNextStep(personaId || '', workflowId, step.id);
        if (nextStep) {
          navigate(`/persona/${personaId}/workflow/${workflowId}/${nextStep.id}`);
        } else {
          navigate(`/persona/${personaId}/dashboard`);
        }
      }
    } catch (error) {
      console.error('Error completing step:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const previousStep = personaWorkflowService.getPreviousStep(personaId || '', workflowId, step.id);
    if (previousStep) {
      navigate(`/persona/${personaId}/workflow/${workflowId}/${previousStep.id}`);
    } else {
      onStepBack();
    }
  };

  const renderFormField = (field: { name: string; type: string; label: string; placeholder?: string; required?: boolean; options?: Array<{ value: string; label: string }> }) => {
    const commonProps = {
      value: formData[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleInputChange(field.name, e.target.value),
      error: errors[field.name],
      required: field.required
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
            label={field.label}
            helpText={field.helpText}
          />
        );
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            placeholder={field.placeholder}
            label={field.label}
            helpText={field.helpText}
          />
        );
      case 'select':
        return (
          <Select
            {...commonProps}
            label={field.label}
            helpText={field.helpText}
            options={field.options || []}
          />
        );
      case 'checkbox':
        return (
          <div>
            <label className="block text-sm font-medium mb-2">{field.label}</label>
            {field.helpText && (
              <p className="text-sm text-muted-foreground mb-3">{field.helpText}</p>
            )}
            <div className="space-y-2">
              {field.options?.map((option: { value: string; label: string }) => (
                <Checkbox
                  key={option.value}
                  checked={(formData[field.name] || []).includes(option.value)}
                  onChange={(checked) => {
                    const currentValues = formData[field.name] || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleInputChange(field.name, newValues);
                  }}
                  label={option.label}
                />
              ))}
            </div>
            {errors[field.name] && (
              <p className="text-sm text-red-600 mt-1">{errors[field.name]}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getStepIcon = () => {
    switch (step.platformFeature) {
      case 'data-rights-portal':
        return <Shield className="h-6 w-6" />;
      case 'data-rights-form':
        return <FileText className="h-6 w-6" />;
      case 'consent-management':
        return <CheckCircle className="h-6 w-6" />;
      case 'compliance-analytics':
        return <BarChart3 className="h-6 w-6" />;
      case 'stakeholder-management':
        return <Users className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getStepIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{step.title}</h1>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              <Clock className="h-3 w-3 mr-1" />
              {step.estimatedTime}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Step {step.required ? 'Required' : 'Optional'}
            </p>
          </div>
        </div>
        
        <ProgressTracker
          currentStep={step.id}
          totalSteps={10} // This would be calculated from workflow
          progress={progress}
        />
      </div>

      {/* Step Content */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Success Criteria */}
          {step.successCriteria.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                Success Criteria
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                {step.successCriteria.map((criterion, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Fields */}
          {step.formFields && step.formFields.length > 0 && (
            <div className="space-y-4">
              {step.formFields.map((field) => (
                <div key={field.name}>
                  {renderFormField(field)}
                </div>
              ))}
            </div>
          )}

          {/* Platform Feature Integration */}
          {step.platformFeature && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Platform Integration
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                This step integrates with: <strong>{step.platformFeature}</strong>
              </p>
              {step.apiEndpoint && (
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                  API Endpoint: {step.apiEndpoint}
                </p>
              )}
            </div>
          )}

          {/* Dependencies */}
          {step.dependencies.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 dark:text-gray-300 mb-2">
                Prerequisites
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                {step.dependencies.map((dep, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {dep}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step.previousSteps.length === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {step.nextSteps.length > 0 ? 'Next' : 'Complete'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};