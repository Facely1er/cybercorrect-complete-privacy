import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, BarChart2, CheckCircle, ArrowRight, Shield, Info, User, Users, Building2 } from 'lucide-react';

export interface SectionInfo {
  title: string;
  description: string;
  estimatedTime: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  questionCount: number;
}

export type AssessmentMode = 'individual' | 'organizational';

interface AssessmentStartScreenProps {
  title: string;
  description: string;
  frameworkName: string;
  sections: SectionInfo[];
  onStart: (mode: AssessmentMode) => void;
}

const AssessmentStartScreen: React.FC<AssessmentStartScreenProps> = ({
  title,
  description,
  frameworkName,
  sections,
  onStart
}) => {
  const [selectedMode, setSelectedMode] = useState<AssessmentMode | null>(null);
  const getTotalTime = () => {
    // Edge case: no sections
    if (sections.length === 0) {
      return '0 minutes';
    }

    // Normalize and attempt to sum minutes when possible
    const timeStrings = sections.map(s => s.estimatedTime);
    const minuteValues: number[] = [];
    let allParsable = true;

    for (const t of timeStrings) {
      const match = t.match(/(\d+)\s*(?:min|minutes)\b/i);
      if (match) {
        minuteValues.push(parseInt(match[1], 10));
      } else {
        allParsable = false;
        break;
      }
    }

    if (allParsable) {
      const totalMinutes = minuteValues.reduce((sum, m) => sum + m, 0);
      if (totalMinutes >= 60) {
        return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min`;
      }
      return `${totalMinutes} minutes`;
    }

    // If a single section and not parsable, show its value; else show range
    if (timeStrings.length === 1) {
      return timeStrings[0];
    }
    return `${timeStrings[0]} - ${timeStrings[timeStrings.length - 1]}`;
  };
  
  const getTotalQuestions = () => {
    return sections.reduce((sum, section) => sum + section.questionCount, 0);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic':
        return 'bg-success/10 text-success';
      case 'Intermediate':
        return 'bg-warning/10 text-warning';
      case 'Advanced':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 text-foreground">{title}</h1>
          <p className="text-lg text-muted-foreground">{description}</p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <Shield className="h-4 w-4 mr-2" />
              {frameworkName}
            </span>
          </div>
        </div>

        {/* Assessment Mode Selection */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2 text-foreground text-center">Choose Your Assessment Mode</h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Select how you'd like to receive your results and recommendations
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Individual Mode */}
              <button
                onClick={() => setSelectedMode('individual')}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedMode === 'individual'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg ${
                    selectedMode === 'individual' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-1">Individual Assessment</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get a personalized role recommendation based on your privacy gaps
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>✓ Your optimal compliance journey</li>
                      <li>✓ Role-specific tools and resources</li>
                      <li>✓ Personalized action plan</li>
                    </ul>
                  </div>
                  {selectedMode === 'individual' && (
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {/* Organizational Mode */}
              <button
                onClick={() => setSelectedMode('organizational')}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedMode === 'organizational'
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg ${
                    selectedMode === 'organizational' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-1">Organizational Assessment</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Build your privacy team with role assignments and resource planning
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>✓ Complete team structure recommendations</li>
                      <li>✓ Functional task assignments</li>
                      <li>✓ Resource estimates and hiring priorities</li>
                    </ul>
                  </div>
                  {selectedMode === 'organizational' && (
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="text-lg font-medium mb-1">Estimated Time</h3>
                <p>{getTotalTime()}</p>
              </div>
              <div className="p-4">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="text-lg font-medium mb-1">Questions</h3>
                <p>{getTotalQuestions()} questions</p>
              </div>
              <div className="p-4">
                <BarChart2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="text-lg font-medium mb-1">Assessment Type</h3>
                <p>Self-Assessment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-4 text-foreground">Assessment Sections</h2>
        <div className="space-y-4 mb-8">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-medium">{section.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(section.complexity)}`}>
                        {section.complexity}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{section.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {section.estimatedTime}
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {section.questionCount} questions
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-2">Before You Begin</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>You can save your progress and return later to complete the assessment.</li>
                <li>Have relevant documentation and information readily available to answer questions accurately.</li>
                <li>For the most accurate results, involve relevant stakeholders in completing the assessment.</li>
                <li>Upon completion, you'll receive a detailed report with findings and recommended actions.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => selectedMode && onStart(selectedMode)} 
            disabled={!selectedMode}
            className="px-8"
          >
            {selectedMode ? (
              <>
                Start {selectedMode === 'individual' ? 'Individual' : 'Organizational'} Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Select Assessment Mode Above'
            )}
          </Button>
          {!selectedMode && (
            <p className="text-sm text-muted-foreground mt-2">
              Please select an assessment mode to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentStartScreen;