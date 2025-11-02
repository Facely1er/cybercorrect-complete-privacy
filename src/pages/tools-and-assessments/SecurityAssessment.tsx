import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, CheckCircle, Circle, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AssessmentStartScreen, { SectionInfo } from '../../components/assessment/AssessmentStartScreen';

const SecurityAssessment = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showStartScreen, setShowStartScreen] = useState(true);

  const sections = [
    {
      title: "Access Control",
      description: "Access control measures for information systems",
      estimatedTime: "5min",
      complexity: "Intermediate" as const,
      questionCount: 5,
      questions: [
        {
          id: "AC-1",
          question: "Do you limit system access to authorized users and processes?",
          control: "ISO 27001 A.9.1.1",
          guidance: "Limit system access to authorized users, processes, and devices"
        },
        {
          id: "AC-2", 
          question: "Do you limit access to types of transactions and functions that users are authorized to execute?",
          control: "ISO 27001 A.9.1.2",
          guidance: "Limit transactions to authorized users based on roles"
        },
        {
          id: "AC-3",
          question: "Do you control the flow of information in accordance with approved authorizations?",
          control: "ISO 27001 A.9.2.1",
          guidance: "Control information flow within systems and between systems"
        },
        {
          id: "AC-4",
          question: "Do you separate duties of individuals to reduce the risk of malicious activity?",
          control: "ISO 27001 A.9.2.3",
          guidance: "Implement separation of duties for critical functions"
        },
        {
          id: "AC-5",
          question: "Is remote access to systems monitored and controlled?",
          control: "ISO 27001 A.9.1.3",
          guidance: "Monitor and control remote access sessions"
        }
      ]
    },
    {
      title: "Security Awareness",
      description: "Security awareness and training for personnel", 
      estimatedTime: "3min",
      complexity: "Basic" as const,
      questionCount: 3,
      questions: [
        {
          id: "AT-1",
          question: "Do you ensure that managers and users are made aware of security risks?",
          control: "ISO 27001 A.7.2.2",
          guidance: "Conduct security awareness activities"
        },
        {
          id: "AT-2",
          question: "Do you ensure that personnel are adequately trained to carry out their duties?",
          control: "ISO 27001 A.7.2.1",
          guidance: "Provide role-based security training"
        },
        {
          id: "AT-3",
          question: "Do you provide security awareness training on recognizing threats?",
          control: "ISO 27001 A.7.2.3",
          guidance: "Train users to recognize security threats"
        }
      ]
    },
    {
      title: "Audit & Monitoring",
      description: "Audit and monitoring controls",
      estimatedTime: "4min", 
      complexity: "Intermediate" as const,
      questionCount: 4,
      questions: [
        {
          id: "AU-1",
          question: "Do you create and retain system audit logs for security events?",
          control: "ISO 27001 A.12.4.1",
          guidance: "Create and retain audit records for forensic analysis"
        },
        {
          id: "AU-2",
          question: "Do you ensure that user actions can be uniquely traced?",
          control: "ISO 27001 A.12.4.3",
          guidance: "Ensure user actions are attributable to specific individuals"
        },
        {
          id: "AU-3", 
          question: "Do you review audit logs for inappropriate or unusual activity?",
          control: "ISO 27001 A.12.4.2",
          guidance: "Review and analyze system audit logs"
        },
        {
          id: "AU-4",
          question: "Do you protect audit information from unauthorized modification?",
          control: "ISO 27001 A.12.4.4",
          guidance: "Protect audit information from unauthorized access"
        }
      ]
    }
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateSectionScore = (sectionIndex: number) => {
    const sectionQuestions = sections[sectionIndex].questions;
    let score = 0;
    let answered = 0;

    sectionQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer === 'yes') {
        score += 2;
        answered++;
      } else if (answer === 'partial') {
        score += 1;
        answered++;
      } else if (answer === 'no') {
        answered++;
      }
    });

    return {
      score,
      total: sectionQuestions.length * 2,
      completed: answered === sectionQuestions.length,
      percentage: Math.round((score / (sectionQuestions.length * 2)) * 100)
    };
  };

  const getOverallScore = () => {
    let totalScore = 0;
    let totalPossible = 0;

    sections.forEach((_, index) => {
      const sectionScore = calculateSectionScore(index);
      totalScore += sectionScore.score;
      totalPossible += sectionScore.total;
    });

    return Math.round((totalScore / totalPossible) * 100);
  };

  const renderAnswerButtons = (questionId: string) => {
    const currentAnswer = answers[questionId];
    
    return (
      <div className="flex gap-2 mt-2">
        <Button
          variant={currentAnswer === 'yes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleAnswer(questionId, 'yes')}
          className="flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4" />
          Yes
        </Button>
        <Button
          variant={currentAnswer === 'partial' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleAnswer(questionId, 'partial')}
          className="flex items-center gap-1"
        >
          <Circle className="w-4 h-4" />
          Partial
        </Button>
        <Button
          variant={currentAnswer === 'no' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleAnswer(questionId, 'no')}
          className="flex items-center gap-1"
        >
          <AlertTriangle className="w-4 h-4" />
          No
        </Button>
      </div>
    );
  };

  const hasCompletedMinimumSections = () => {
    let completedSections = 0;
    sections.forEach((_, index) => {
      if (calculateSectionScore(index).completed) {
        completedSections++;
      }
    });
    return completedSections >= Math.ceil(sections.length / 2);
  };

  const handleViewResults = () => {
    navigate('/security-results');
  };

  const sectionInfoList: SectionInfo[] = sections.map(section => ({
    title: section.title,
    description: section.description,
    estimatedTime: section.estimatedTime,
    complexity: section.complexity,
    questionCount: section.questions.length
  }));

  if (showStartScreen) {
    return (
      <AssessmentStartScreen
        title="Security Framework Assessment"
        description="Evaluate your security posture against industry frameworks and best practices"
        frameworkName="Enterprise Security Framework"
        sections={sectionInfoList}
        onStart={() => setShowStartScreen(false)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/assessment-hub" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Security Framework Assessment</h1>
        <p className="text-muted-foreground mb-6">Based on enterprise security frameworks and industry best practices</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sections.map((section, index) => {
          const score = calculateSectionScore(index);
          return (
            <Card key={index} className="p-4 border dark:border-muted hover:shadow-lg transition-all duration-300">
              <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Score: {score.percentage}%</p>
                  <p className="text-sm text-muted-foreground">
                    {score.completed ? 'Complete' : 'Incomplete'}
                  </p>
                </div>
                <Button
                  variant={currentSection === index ? 'default' : 'outline'}
                  onClick={() => setCurrentSection(index)}
                  size="sm"
                >
                  {currentSection === index ? 'Current' : 'View'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 border dark:border-muted shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{sections[currentSection].title}</h2>
            <p className="text-muted-foreground">{sections[currentSection].description}</p>
          </div>
          <div className="text-xl font-semibold text-foreground">
            Overall Score: {getOverallScore()}%
          </div>
        </div>

        <div className="space-y-6">
          {sections[currentSection].questions.map((question) => (
            <div key={question.id} className="border-b border-border pb-4 last:border-b-0">
              <div className="flex items-start gap-2 mb-2">
                <div className="bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded text-sm font-mono">
                  {question.id}
                </div>
                <p className="font-medium text-foreground flex-1">{question.question}</p>
              </div>
              
              <div className="bg-muted/50 dark:bg-muted/20 p-3 rounded mb-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{question.control}</p>
                    <p className="text-sm text-muted-foreground">{question.guidance}</p>
                  </div>
                </div>
              </div>
              
              {renderAnswerButtons(question.id)}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
          >
            Previous Section
          </Button>
          
          {currentSection < sections.length - 1 ? (
            <Button
              onClick={() => setCurrentSection(prev => prev + 1)}
            >
              Next Section
            </Button>
          ) : (
            <Button
              onClick={handleViewResults}
              disabled={!hasCompletedMinimumSections()}
              className="flex items-center gap-2"
            >
              View Results
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SecurityAssessment;