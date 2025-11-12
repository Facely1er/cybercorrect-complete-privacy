import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, CheckCircle, Circle, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AssessmentStartScreen, { SectionInfo } from '../../components/assessment/AssessmentStartScreen';
import { RelatedContent } from '../../components/ui/InternalLinkingHelper';

const PrivacyAssessment = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showStartScreen, setShowStartScreen] = useState(true);

  const sections = [
    {
      title: "Identify",
      description: "Develop understanding to manage privacy risk",
      estimatedTime: "6min",
      complexity: "Intermediate" as const,
      questionCount: 6,
      questions: [
        {
          id: "ID-P1",
          question: "Have you inventoried data processing activities and systems?",
          control: "NIST Privacy ID.IM-P1",
          guidance: "Inventory and map data processing activities and systems containing personal data"
        },
        {
          id: "ID-P2",
          question: "Have you identified the categories of personal data being processed?",
          control: "NIST Privacy ID.IM-P2",
          guidance: "Document types of data, categories of individuals, and processing purposes"
        },
        {
          id: "ID-P3",
          question: "Have you identified and documented data flows and processing activities?",
          control: "NIST Privacy ID.IM-P3",
          guidance: "Create data flow diagrams or maps showing how personal data moves through systems"
        },
        {
          id: "ID-P4",
          question: "Have you identified the environment your data processing systems operate in?",
          control: "NIST Privacy ID.IM-P4",
          guidance: "Document the technical, regulatory, and business environment"
        },
        {
          id: "ID-P5",
          question: "Have you conducted privacy risk assessments for processing activities?",
          control: "NIST Privacy ID.RA-P",
          guidance: "Assess privacy risks for individuals associated with data processing"
        },
        {
          id: "ID-P6",
          question: "Can you identify where privacy requirements apply to your organization?",
          control: "NIST Privacy ID.DE-P",
          guidance: "Determine applicable regulations and requirements for privacy"
        }
      ]
    },
    {
      title: "Govern",
      description: "Develop and implement privacy governance structure",
      estimatedTime: "6min",
      complexity: "Advanced" as const,
      questionCount: 6,
      questions: [
        {
          id: "GV-P1",
          question: "Do you have documented privacy policies and procedures?",
          control: "NIST Privacy GV.PO-P",
          guidance: "Establish and maintain privacy policies and procedures"
        },
        {
          id: "GV-P2",
          question: "Are privacy roles and responsibilities clearly defined?",
          control: "NIST Privacy GV.RR-P",
          guidance: "Establish privacy roles and responsibilities for the workforce"
        },
        {
          id: "GV-P3",
          question: "Is there a process for managing privacy risks?",
          control: "NIST Privacy GV.RM-P",
          guidance: "Develop and implement privacy risk management processes"
        },
        {
          id: "GV-P4",
          question: "Do you have a strategy for managing personal data throughout its lifecycle?",
          control: "NIST Privacy GV.PO-P3",
          guidance: "Develop a strategy for managing personal data throughout its lifecycle"
        },
        {
          id: "GV-P5",
          question: "Do you integrate privacy requirements into procurement processes?",
          control: "NIST Privacy GV.PO-P4",
          guidance: "Include privacy requirements in procurement activities and contracts"
        },
        {
          id: "GV-P6",
          question: "Is privacy awareness and training provided to employees?",
          control: "NIST Privacy GV.AT-P",
          guidance: "Conduct privacy awareness and training activities for all staff"
        }
      ]
    },
    {
      title: "Control",
      description: "Develop and implement data processing controls",
      estimatedTime: "6min",
      complexity: "Intermediate" as const,
      questionCount: 6,
      questions: [
        {
          id: "CT-P1",
          question: "Do you implement data minimization practices?",
          control: "NIST Privacy CT.DM-P",
          guidance: "Process the minimum necessary personal data to achieve purpose"
        },
        {
          id: "CT-P2",
          question: "Do you implement access controls for systems with personal data?",
          control: "NIST Privacy CT.AC-P",
          guidance: "Implement access management for personal data"
        },
        {
          id: "CT-P3",
          question: "Are measures in place to maintain data quality and integrity?",
          control: "NIST Privacy CT.DQ-P",
          guidance: "Maintain accuracy, completeness, and relevance of personal data"
        },
        {
          id: "CT-P4",
          question: "Do you have procedures for data management throughout the data lifecycle?",
          control: "NIST Privacy CT.DP-P",
          guidance: "Manage personal data throughout its lifecycle"
        },
        {
          id: "CT-P5",
          question: "Are disassociated processing methods used when appropriate?",
          control: "NIST Privacy CT.DP-P8",
          guidance: "Use de-identification, anonymization, or pseudonymization when appropriate"
        },
        {
          id: "CT-P6",
          question: "Do you track and document data disclosures and sharing?",
          control: "NIST Privacy CT.DM-P7",
          guidance: "Track and document personal data disclosures to third parties"
        }
      ]
    },
    {
      title: "Communicate",
      description: "Develop and implement communication processes",
      estimatedTime: "6min",
      complexity: "Intermediate" as const,
      questionCount: 6,
      questions: [
        {
          id: "CM-P1",
          question: "Do you provide privacy notices to individuals?",
          control: "NIST Privacy CM.PO-P",
          guidance: "Provide clear, accessible privacy notices to individuals"
        },
        {
          id: "CM-P2",
          question: "Do you explain the purposes for processing personal data?",
          control: "NIST Privacy CM.PO-P2",
          guidance: "Clearly communicate purposes for processing personal data"
        },
        {
          id: "CM-P3",
          question: "Do you have a process for individuals to request access to their data?",
          control: "NIST Privacy CM.AW-P1",
          guidance: "Enable individual access to their personal data"
        },
        {
          id: "CM-P4",
          question: "Can individuals correct inaccuracies in their personal data?",
          control: "NIST Privacy CM.AW-P2",
          guidance: "Allow individuals to correct inaccurate personal data"
        },
        {
          id: "CM-P5",
          question: "Can individuals request deletion of their personal data?",
          control: "NIST Privacy CM.AW-P3",
          guidance: "Enable individuals to request deletion of personal data"
        },
        {
          id: "CM-P6",
          question: "Is there a process for handling privacy complaints or questions?",
          control: "NIST Privacy CM.AW-P8",
          guidance: "Provide a mechanism to handle privacy-related inquiries and complaints"
        }
      ]
    },
    {
      title: "Protect",
      description: "Develop and implement data protection measures",
      estimatedTime: "6min",
      complexity: "Advanced" as const,
      questionCount: 6,
      questions: [
        {
          id: "PR-P1",
          question: "Are security measures implemented to protect personal data?",
          control: "NIST Privacy PR.DS-P",
          guidance: "Implement security measures to protect personal data in systems"
        },
        {
          id: "PR-P2",
          question: "Is data encrypted in transit and at rest where appropriate?",
          control: "NIST Privacy PR.DS-P1",
          guidance: "Encrypt personal data in transit and at rest"
        },
        {
          id: "PR-P3",
          question: "Do you maintain secure data backups?",
          control: "NIST Privacy PR.DS-P4",
          guidance: "Implement secure data backups with appropriate protections"
        },
        {
          id: "PR-P4",
          question: "Are privacy-by-design principles incorporated into system development?",
          control: "NIST Privacy PR.AT-P1",
          guidance: "Incorporate privacy-by-design principles in system development"
        },
        {
          id: "PR-P5",
          question: "Is there a process for handling personal data breaches?",
          control: "NIST Privacy PR.AC-P4",
          guidance: "Establish procedures to respond to personal data breaches"
        },
        {
          id: "PR-P6",
          question: "Are privacy risk assessments conducted for new systems and processes?",
          control: "NIST Privacy PR.PO-P2",
          guidance: "Conduct privacy impact assessments for new systems and processes"
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

  // Determine if we have enough answers to show results
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
    // Calculate section scores for results
    const sectionScores = sections.map((section, index) => {
      const score = calculateSectionScore(index);
      return {
        title: section.title,
        percentage: score.percentage,
        completed: score.completed
      };
    });

    const results = {
      overallScore: getOverallScore(),
      sectionScores,
      assessmentType: 'privacy',
      frameworkName: 'NIST Privacy Framework',
      completedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      answers // Include answers for potential future use
    };

    navigate('/privacy-results', { state: { assessmentResults: results } });
  };

  // Create a list of section info for the start screen
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
        title="Privacy Framework Assessment"
        description="Evaluate your privacy program against the NIST Privacy Framework"
        frameworkName="NIST Privacy Framework"
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
        <h1 className="text-3xl font-bold mb-2 text-foreground">Privacy Framework Assessment</h1>
        <p className="text-muted-foreground mb-6">Based on the NIST Privacy Framework's five core functions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {sections.map((section, index) => {
          const score = calculateSectionScore(index);
          return (
            <Card key={index} className="p-4 border dark:border-muted">
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

      <Card className="p-6 border dark:border-muted">
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
                <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-2 py-1 rounded text-sm font-mono">
                  {question.id}
                </div>
                <p className="font-medium text-foreground flex-1">{question.question}</p>
              </div>
              
              <div className="bg-muted/50 dark:bg-muted/20 p-3 rounded mb-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary dark:text-primary mt-1" />
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
      
      {/* Add related content suggestions */}
      <RelatedContent currentPath="/assessments/privacy-assessment" />
    </div>
  );
};

export default PrivacyAssessment;