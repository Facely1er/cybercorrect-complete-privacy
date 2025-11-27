/**
 * Welcome Screen Component
 * Phase 3 of onboarding flow - Welcome & Introduction
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Shield,
  FileCheck,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  Target,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBrand } from '../../hooks/useBrand';

interface WelcomeScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
  userName?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onComplete,
  onSkip,
  userName
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { brand } = useBrand();

  const steps = [
    {
      title: `Welcome to ${brand.brandName}`,
      subtitle: 'Your complete privacy compliance platform',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {`Welcome${userName ? `, ${userName}` : ''}!`}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {brand.brandName} helps you manage privacy compliance, data rights requests,
              and regulatory requirements with tools aligned with GDPR, CCPA, and other frameworks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-muted/50 p-4 rounded-lg">
                <FileCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-foreground">Privacy Compliance</div>
                <div className="text-muted-foreground">GDPR, CCPA aligned tools</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-foreground">Data Rights Management</div>
                <div className="text-muted-foreground">Automated request handling</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="font-medium text-foreground">Compliance Tracking</div>
                <div className="text-muted-foreground">Real-time compliance dashboards</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Your Role & Organization',
      subtitle: 'Help us tailor your experience',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Users className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Tell us about yourself
            </h3>
            <p className="text-muted-foreground">
              This helps us show you the most relevant features and content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Primary Role
              </label>
              <select 
                className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
                defaultValue=""
              >
                <option value="">Select your role</option>
                <option value="privacy_officer">Privacy Officer</option>
                <option value="compliance_manager">Compliance Manager</option>
                <option value="data_protection_officer">Data Protection Officer</option>
                <option value="legal_counsel">Legal Counsel</option>
                <option value="it_manager">IT Manager</option>
                <option value="executive">Executive</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Organization Size
              </label>
              <select 
                className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
                defaultValue=""
              >
                <option value="">Select size</option>
                <option value="startup">Startup (1-50 employees)</option>
                <option value="small">Small Business (51-200 employees)</option>
                <option value="medium">Medium Business (201-1000 employees)</option>
                <option value="large">Large Enterprise (1000+ employees)</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Industry
              </label>
              <select 
                className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
                defaultValue=""
              >
                <option value="">Select industry</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="financial">Financial Services</option>
                <option value="technology">Technology</option>
                <option value="retail">Retail/E-commerce</option>
                <option value="government">Government/Public Sector</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Get Started',
      subtitle: 'Choose your first action',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Target className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              What would you like to do first?
            </h3>
            <p className="text-muted-foreground">
              Choose an action to get started with {brand.brandName}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Link to="/privacy/data-inventory" className="block">
              <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileCheck className="h-8 w-8 text-primary mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Create Data Inventory</h4>
                    <p className="text-sm text-muted-foreground">
                      Document your data processing activities
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
            
            <Link to="/privacy/compliance-obligations" className="block">
              <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-primary mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Run Compliance Assessment</h4>
                    <p className="text-sm text-muted-foreground">
                      Evaluate your organization's compliance posture
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
            
            <Link to="/privacy/dashboard" className="block">
              <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-primary mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Explore Your Dashboard</h4>
                    <p className="text-sm text-muted-foreground">
                      Review your privacy metrics and analytics
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
            
            <div 
              className="border border-border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
              onClick={onComplete}
            >
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary mr-4" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Take a Quick Tour</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn about key features with a guided walkthrough
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                {steps[currentStep].title}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {steps[currentStep].subtitle}
              </p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= currentStep
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="min-h-[400px]">
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip Tour
                </Button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={onComplete}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

