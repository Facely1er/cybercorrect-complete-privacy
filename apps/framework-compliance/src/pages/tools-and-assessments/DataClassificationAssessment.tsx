import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, CheckCircle, Circle, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AssessmentStartScreen, { SectionInfo } from '../../components/assessment/AssessmentStartScreen';

const DataClassificationAssessment = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showStartScreen, setShowStartScreen] = useState(true);

  const sections = [
    {
      title: "Data Access Control",
      description: "Access control measures for personal data systems",
      estimatedTime: "5min",
      complexity: "Intermediate" as const,
      questionCount: 5,
      questions: [
        {
          id: "AC-1",
          question: "Do you limit system access to authorized users and processes?",
          control: "GDPR Art. 32",
          guidance: "Limit system access to authorized users, processes, and devices"
        },
        {
          id: "AC-2",
          question: "Do you limit access to types of transactions and functions that users are authorized to execute?",
          control: "NIST 800-171 3.1.2",
          guidance: "Limit transactions to authorized users based on roles"
        },
        {
          id: "AC-3",
          question: "Do you control the flow of CUI in accordance with approved authorizations?",
          control: "NIST 800-171 3.1.3",
          guidance: "Control information flow within systems and between systems"
        },
        {
          id: "AC-4",
          question: "Do you separate duties of individuals to reduce the risk of malicious activity?",
          control: "NIST 800-171 3.1.4",
          guidance: "Implement separation of duties for critical functions"
        },
        {
          id: "AC-5",
          question: "Is remote access to CUI systems monitored and controlled?",
          control: "NIST 800-171 3.1.12",
          guidance: "Monitor and control remote access sessions"
        }
      ]
    },
    {
      title: "Awareness & Training",
      description: "Security awareness and training for personnel",
      estimatedTime: "3min",
      complexity: "Basic" as const,
      questionCount: 3,
      questions: [
        {
          id: "AT-1",
          question: "Do you ensure that managers and users of CUI systems are made aware of security risks?",
          control: "NIST 800-171 3.2.1",
          guidance: "Conduct security awareness activities"
        },
        {
          id: "AT-2",
          question: "Do you ensure that personnel are adequately trained to carry out their duties and responsibilities?",
          control: "NIST 800-171 3.2.2",
          guidance: "Provide role-based security training"
        },
        {
          id: "AT-3",
          question: "Do you provide security awareness training on recognizing and reporting potential indicators of insider threat?",
          control: "NIST 800-171 3.2.3",
          guidance: "Train users to recognize insider threats"
        }
      ]
    },
    {
      title: "Audit & Accountability",
      description: "Audit and accountability controls",
      estimatedTime: "4min",
      complexity: "Intermediate" as const,
      questionCount: 4,
      questions: [
        {
          id: "AU-1",
          question: "Do you create and retain system audit logs and records to the extent needed for incident investigations?",
          control: "NIST 800-171 3.3.1",
          guidance: "Create and retain audit records for forensic analysis"
        },
        {
          id: "AU-2",
          question: "Do you ensure that the actions of individual system users can be uniquely traced?",
          control: "NIST 800-171 3.3.2",
          guidance: "Ensure user actions are attributable to specific individuals"
        },
        {
          id: "AU-3",
          question: "Do you review audit logs for inappropriate or unusual activity?",
          control: "NIST 800-171 3.3.5",
          guidance: "Review and analyze system audit logs"
        },
        {
          id: "AU-4",
          question: "Do you protect audit information and audit logging tools from unauthorized modification and deletion?",
          control: "NIST 800-171 3.3.8",
          guidance: "Protect audit information from unauthorized access"
        }
      ]
    },
    {
      title: "Configuration Management",
      description: "System configuration and maintenance",
      estimatedTime: "5min",
      complexity: "Advanced" as const,
      questionCount: 5,
      questions: [
        {
          id: "CM-1",
          question: "Do you establish and maintain baseline configurations of CUI systems?",
          control: "NIST 800-171 3.4.1",
          guidance: "Establish and maintain baseline configurations"
        },
        {
          id: "CM-2",
          question: "Do you maintain a current inventory of CUI system components?",
          control: "NIST 800-171 3.4.2",
          guidance: "Maintain a system component inventory"
        },
        {
          id: "CM-3",
          question: "Do you control and monitor user-installed software?",
          control: "NIST 800-171 3.4.9",
          guidance: "Control and monitor user-installed software"
        },
        {
          id: "CM-4",
          question: "Do you employ the principle of least functionality by configuring systems to provide only essential capabilities?",
          control: "NIST 800-171 3.4.6",
          guidance: "Employ least functionality principle"
        },
        {
          id: "CM-5",
          question: "Do you restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services?",
          control: "NIST 800-171 3.4.7",
          guidance: "Restrict unnecessary software, ports, and services"
        }
      ]
    },
    {
      title: "Identification & Authentication",
      description: "User identification and authentication controls",
      estimatedTime: "5min",
      complexity: "Intermediate" as const,
      questionCount: 5,
      questions: [
        {
          id: "IA-1",
          question: "Do you identify system users, processes, and devices?",
          control: "NIST 800-171 3.5.1",
          guidance: "Identify users, processes, and devices"
        },
        {
          id: "IA-2",
          question: "Do you authenticate users, processes, or devices before allowing access to systems?",
          control: "NIST 800-171 3.5.2",
          guidance: "Authenticate (or verify) identities before system access"
        },
        {
          id: "IA-3",
          question: "Do you use multifactor authentication for privileged accounts?",
          control: "NIST 800-171 3.5.3",
          guidance: "Require MFA for privileged accounts"
        },
        {
          id: "IA-4",
          question: "Do you use multifactor authentication for non-privileged accounts?",
          control: "NIST 800-171 3.5.4",
          guidance: "Employ MFA for non-privileged accounts"
        },
        {
          id: "IA-5",
          question: "Do you manage passwords securely and prohibit password reuse?",
          control: "NIST 800-171 3.5.8",
          guidance: "Implement password strength and management requirements"
        }
      ]
    },
    {
      title: "Incident Response",
      description: "Security incident handling and response",
      estimatedTime: "3min",
      complexity: "Intermediate" as const,
      questionCount: 3,
      questions: [
        {
          id: "IR-1",
          question: "Do you establish an operational incident-handling capability?",
          control: "NIST 800-171 3.6.1",
          guidance: "Establish incident response capability"
        },
        {
          id: "IR-2",
          question: "Do you track, document, and report incidents to appropriate personnel?",
          control: "NIST 800-171 3.6.2",
          guidance: "Track and document security incidents"
        },
        {
          id: "IR-3",
          question: "Do you test the organizational incident response capability?",
          control: "NIST 800-171 3.6.3",
          guidance: "Test incident response capabilities"
        }
      ]
    },
    {
      title: "Maintenance",
      description: "System maintenance procedures",
      estimatedTime: "3min",
      complexity: "Basic" as const,
      questionCount: 3,
      questions: [
        {
          id: "MA-1",
          question: "Do you perform maintenance on CUI systems?",
          control: "NIST 800-171 3.7.1",
          guidance: "Perform and log system maintenance"
        },
        {
          id: "MA-2",
          question: "Do you provide effective controls on tools, techniques, and mechanisms used for system maintenance?",
          control: "NIST 800-171 3.7.2",
          guidance: "Control maintenance tools"
        },
        {
          id: "MA-3",
          question: "Do you ensure equipment removed for off-site maintenance is sanitized of CUI?",
          control: "NIST 800-171 3.7.3",
          guidance: "Sanitize equipment removed for maintenance"
        }
      ]
    },
    {
      title: "Media Protection",
      description: "Protection of CUI media",
      estimatedTime: "5min",
      complexity: "Intermediate" as const,
      questionCount: 5,
      questions: [
        {
          id: "MP-1",
          question: "Do you protect and control system media containing CUI?",
          control: "NIST 800-171 3.8.1",
          guidance: "Protect media containing CUI"
        },
        {
          id: "MP-2",
          question: "Do you limit access to CUI on system media to authorized users?",
          control: "NIST 800-171 3.8.2",
          guidance: "Limit media access to authorized users"
        },
        {
          id: "MP-3",
          question: "Do you sanitize or destroy system media containing CUI before disposal or reuse?",
          control: "NIST 800-171 3.8.3",
          guidance: "Sanitize media before disposal or reuse"
        },
        {
          id: "MP-4",
          question: "Do you control the use of removable media on system components?",
          control: "NIST 800-171 3.8.7",
          guidance: "Control removable media use"
        },
        {
          id: "MP-5",
          question: "Do you protect the confidentiality of backup CUI at storage locations?",
          control: "NIST 800-171 3.8.9",
          guidance: "Protect confidentiality of backups"
        }
      ]
    },
    {
      title: "Personnel Security",
      description: "Personnel security measures",
      estimatedTime: "2min",
      complexity: "Basic" as const,
      questionCount: 2,
      questions: [
        {
          id: "PS-1",
          question: "Do you screen individuals prior to authorizing access to CUI systems?",
          control: "NIST 800-171 3.9.1",
          guidance: "Screen personnel before granting access"
        },
        {
          id: "PS-2",
          question: "Do you ensure that CUI and systems are protected during personnel actions?",
          control: "NIST 800-171 3.9.2",
          guidance: "Protect information during personnel actions"
        }
      ]
    },
    {
      title: "Physical Protection",
      description: "Physical access controls for CUI",
      estimatedTime: "5min",
      complexity: "Intermediate" as const,
      questionCount: 5,
      questions: [
        {
          id: "PE-1",
          question: "Do you limit physical access to CUI systems, equipment, and operating environments?",
          control: "NIST 800-171 3.10.1",
          guidance: "Limit physical access to systems and facilities"
        },
        {
          id: "PE-2",
          question: "Do you protect and monitor physical facility and system access?",
          control: "NIST 800-171 3.10.2",
          guidance: "Monitor physical access to facilities"
        },
        {
          id: "PE-3",
          question: "Do you escort visitors and monitor visitor activity?",
          control: "NIST 800-171 3.10.3",
          guidance: "Escort and monitor visitors"
        },
        {
          id: "PE-4",
          question: "Do you maintain audit logs of physical access?",
          control: "NIST 800-171 3.10.4",
          guidance: "Log physical access events"
        },
        {
          id: "PE-5",
          question: "Do you control and manage physical access devices?",
          control: "NIST 800-171 3.10.5",
          guidance: "Control access devices like keys and cards"
        }
      ]
    },
    {
      title: "Risk Assessment",
      description: "Risk assessment practices",
      estimatedTime: "3min",
      complexity: "Intermediate" as const,
      questionCount: 3,
      questions: [
        {
          id: "RA-1",
          question: "Do you periodically assess the risk to operations and assets from the operation of CUI systems?",
          control: "NIST 800-171 3.11.1",
          guidance: "Periodically assess risk to CUI operations"
        },
        {
          id: "RA-2",
          question: "Do you scan for vulnerabilities in CUI systems and applications?",
          control: "NIST 800-171 3.11.2",
          guidance: "Conduct vulnerability scanning"
        },
        {
          id: "RA-3",
          question: "Do you remediate vulnerabilities in accordance with risk assessments?",
          control: "NIST 800-171 3.11.3",
          guidance: "Remediate vulnerabilities according to risk"
        }
      ]
    },
    {
      title: "Security Assessment",
      description: "Security assessment practices",
      estimatedTime: "4min",
      complexity: "Advanced" as const,
      questionCount: 4,
      questions: [
        {
          id: "SA-1",
          question: "Do you periodically assess security controls to determine effectiveness?",
          control: "NIST 800-171 3.12.1",
          guidance: "Periodically assess security controls"
        },
        {
          id: "SA-2",
          question: "Do you develop and implement plans of action to correct deficiencies?",
          control: "NIST 800-171 3.12.2",
          guidance: "Develop remediation plans for deficiencies"
        },
        {
          id: "SA-3",
          question: "Do you monitor security controls on an ongoing basis?",
          control: "NIST 800-171 3.12.3",
          guidance: "Monitor security controls continuously"
        },
        {
          id: "SA-4",
          question: "Do you develop, document, and periodically update system security plans?",
          control: "NIST 800-171 3.12.4",
          guidance: "Maintain system security plans"
        }
      ]
    },
    {
      title: "System & Communications Protection",
      description: "System and communications security",
      estimatedTime: "5min",
      complexity: "Advanced" as const,
      questionCount: 5,
      questions: [
        {
          id: "SC-1",
          question: "Do you monitor, control, and protect communications at system boundaries?",
          control: "NIST 800-171 3.13.1",
          guidance: "Monitor and control communications at boundaries"
        },
        {
          id: "SC-2",
          question: "Do you employ architectural designs, software development techniques, and systems engineering principles to promote effective security?",
          control: "NIST 800-171 3.13.2",
          guidance: "Employ secure architecture and engineering principles"
        },
        {
          id: "SC-3",
          question: "Do you separate user functionality from system management functionality?",
          control: "NIST 800-171 3.13.3",
          guidance: "Separate user and management functions"
        },
        {
          id: "SC-4",
          question: "Do you implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission?",
          control: "NIST 800-171 3.13.8",
          guidance: "Implement cryptographic protection for transmitted CUI"
        },
        {
          id: "SC-5",
          question: "Do you protect the authenticity of communications sessions?",
          control: "NIST 800-171 3.13.15",
          guidance: "Protect session authenticity"
        }
      ]
    },
    {
      title: "System & Information Integrity",
      description: "System and information integrity practices",
      estimatedTime: "5min",
      complexity: "Intermediate" as const,
      questionCount: 5,
      questions: [
        {
          id: "SI-1",
          question: "Do you identify, report, and correct information and system flaws in a timely manner?",
          control: "NIST 800-171 3.14.1",
          guidance: "Promptly identify and fix flaws"
        },
        {
          id: "SI-2",
          question: "Do you provide protection from malicious code at designated locations?",
          control: "NIST 800-171 3.14.2",
          guidance: "Implement malicious code protection"
        },
        {
          id: "SI-3",
          question: "Do you monitor systems to detect security alerts and advisories?",
          control: "NIST 800-171 3.14.3",
          guidance: "Monitor security alerts and advisories"
        },
        {
          id: "SI-4",
          question: "Do you update malicious code protection mechanisms when new releases are available?",
          control: "NIST 800-171 3.14.4",
          guidance: "Update malicious code protection"
        },
        {
          id: "SI-5",
          question: "Do you monitor systems for unauthorized personnel, connections, devices, and software?",
          control: "NIST 800-171 3.14.6",
          guidance: "Monitor for unauthorized activities"
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
    return completedSections >= Math.ceil(sections.length / 3); // At least 1/3 of sections
  };

  const handleViewResults = () => {
    // In a real application, you would save the assessment results
    // before navigating to the results page
    navigate('/privacy-results');
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
        title="CUI Compliance Assessment"
        description="Evaluate your CUI handling practices against NIST SP 800-171 requirements"
        frameworkName="NIST SP 800-171"
        sections={sectionInfoList}
        onStart={() => setShowStartScreen(false)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/assessment" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-foreground">CUI Compliance Assessment</h1>
        <p className="text-muted-foreground mb-6">Based on NIST SP 800-171 requirements for Controlled Unclassified Information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
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
    </div>
  );
};

export default DataClassificationAssessment;