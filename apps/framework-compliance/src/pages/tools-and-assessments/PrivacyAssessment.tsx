import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, CheckCircle, Circle, Info, ArrowLeft, ArrowRight, Save, Users } from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AssessmentStartScreen, { SectionInfo, AssessmentMode } from '../../components/assessment/AssessmentStartScreen';
import { RelatedContent } from '../../components/ui/InternalLinkingHelper';
import { AssessmentFlowProgress } from '../../components/assessment/AssessmentFlowProgress';
import { CollaborativeProgress } from '../../components/assessment/CollaborativeProgress';
import { QuestionCollaboration } from '../../components/assessment/QuestionCollaboration';
import { secureStorage } from '../../utils/storage/secureStorage';
import { CollaborationManager } from '../../utils/collaboration';
import { toast } from '../../components/ui/Toaster';

const PrivacyAssessment = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();
  const [searchParams] = useSearchParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>('individual');
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [collabSessionId, setCollabSessionId] = useState<string | null>(null);

  const STORAGE_KEY = 'privacy_assessment_progress';
  
  // Get current user from collaboration session
  const currentUser = CollaborationManager.getCurrentUser();

  // Load saved progress on component mount
  useEffect(() => {
    // Check for collaboration session ID from URL
    const urlSessionId = sessionId || searchParams.get('session');
    
    if (urlSessionId) {
      // Load collaborative session
      const session = CollaborationManager.getSession(urlSessionId);
      if (session) {
        setCollaborationMode(true);
        setCollabSessionId(urlSessionId);
        setAssessmentMode('organizational'); // Collaborative sessions are always organizational
        setShowStartScreen(false);
        
        // Load answers from session
        const sessionAnswers: Record<string, string> = {};
        Object.entries(session.answers).forEach(([qId, data]) => {
          if (data.value) {
            sessionAnswers[qId] = data.value;
          }
        });
        setAnswers(sessionAnswers);
        setCurrentSection(session.currentSection || 0);
        
        toast.success('Joined collaborative session', `Welcome to ${session.name}`, 3000);
        return;
      }
    }
    
    // Load regular saved progress
    const savedData = secureStorage.getItem<{
      answers: Record<string, string>;
      currentSection: number;
      lastSaved: string;
      showStartScreen: boolean;
      assessmentMode?: AssessmentMode;
    }>(STORAGE_KEY);

    if (savedData) {
      setAnswers(savedData.answers || {});
      setCurrentSection(savedData.currentSection || 0);
      setShowStartScreen(savedData.showStartScreen !== undefined ? savedData.showStartScreen : true);
      setLastSaved(savedData.lastSaved ? new Date(savedData.lastSaved) : null);
      setAssessmentMode(savedData.assessmentMode || 'individual');
      
      // Only show restoration message if they have actual progress (not just started)
      const hasProgress = Object.keys(savedData.answers || {}).length > 0;
      if (hasProgress) {
        toast.success('Your progress has been restored', 'Continue where you left off');
      }
    }
  }, [sessionId, searchParams]);

  // Autosave progress whenever answers or section changes
  useEffect(() => {
    // Don't save on initial render or if no answers yet
    if (Object.keys(answers).length === 0) return;

    const saveProgress = () => {
      setIsSaving(true);
      
      if (collaborationMode && collabSessionId) {
        // Save to collaborative session
        CollaborationManager.updateCurrentSection(collabSessionId, currentSection);
        setLastSaved(new Date());
      } else {
        // Save to local storage
        const progressData = {
          answers,
          currentSection,
          showStartScreen,
          assessmentMode,
          lastSaved: new Date().toISOString()
        };

        const success = secureStorage.setItem(STORAGE_KEY, progressData);
        
        if (success) {
          setLastSaved(new Date());
        }
      }
      
      setIsSaving(false);
    };

    // Debounce autosave by 1 second
    const timeoutId = setTimeout(saveProgress, 1000);

    return () => clearTimeout(timeoutId);
  }, [answers, currentSection, showStartScreen, collaborationMode, collabSessionId]);

  const sections = [
    {
      title: "Govern",
      description: "Develop and implement privacy governance structure aligned with CSF 2.0",
      estimatedTime: "15min",
      complexity: "Advanced" as const,
      questionCount: 15,
      questions: [
        {
          id: "GV-OC-P1",
          question: "Have you established the organizational context for privacy risk management, including mission, objectives, and stakeholders?",
          control: "NIST Privacy GV.OC-P1 (aligned with CSF 2.0 GV.OC)",
          guidance: "Understand the organizational context, including mission, objectives, stakeholders, and activities to inform privacy risk management decisions"
        },
        {
          id: "GV-OC-P2",
          question: "Do you understand how privacy risk management aligns with your organization's mission, objectives, and stakeholder expectations?",
          control: "NIST Privacy GV.OC-P2",
          guidance: "Ensure privacy risk management activities align with organizational mission, objectives, and stakeholder expectations"
        },
        {
          id: "GV-RM-P1",
          question: "Do you have a documented privacy risk management strategy that coordinates with cybersecurity risk management?",
          control: "NIST Privacy GV.RM-P1 (aligned with CSF 2.0 GV.RM)",
          guidance: "Establish and maintain privacy risk management strategy that coordinates with organizational cybersecurity risk management"
        },
        {
          id: "GV-RM-P2",
          question: "Have you defined your organization's privacy risk tolerance and appetite?",
          control: "NIST Privacy GV.RM-P2",
          guidance: "Define and communicate organizational privacy risk tolerance and appetite to inform risk management decisions"
        },
        {
          id: "GV-RM-P3",
          question: "Do you have processes for managing privacy risks that coordinate with cybersecurity risk management?",
          control: "NIST Privacy GV.RM-P3 (aligned with CSF 2.0 GV.RM)",
          guidance: "Develop and implement privacy risk management processes that coordinate with cybersecurity risk management processes"
        },
        {
          id: "GV-RR-P1",
          question: "Are privacy roles and responsibilities clearly defined and integrated with cybersecurity governance?",
          control: "NIST Privacy GV.RR-P1 (aligned with CSF 2.0 GV.RR)",
          guidance: "Establish privacy roles and responsibilities for the workforce, aligned with cybersecurity governance structure"
        },
        {
          id: "GV-RR-P2",
          question: "Do you have designated privacy officers or data protection officers with appropriate authority?",
          control: "NIST Privacy GV.RR-P2",
          guidance: "Designate privacy officers or data protection officers with appropriate authority and resources to fulfill privacy responsibilities"
        },
        {
          id: "GV-PO-P1",
          question: "Do you have documented privacy policies and procedures that align with your risk management strategy?",
          control: "NIST Privacy GV.PO-P1 (aligned with CSF 2.0 GV.RM)",
          guidance: "Establish and maintain privacy policies and procedures integrated with organizational risk management strategy"
        },
        {
          id: "GV-PO-P2",
          question: "Do you have a process for reviewing and updating privacy policies and procedures?",
          control: "NIST Privacy GV.PO-P2",
          guidance: "Establish processes for regular review and update of privacy policies and procedures to ensure they remain current and effective"
        },
        {
          id: "GV-PO-P3",
          question: "Do you have a strategy for managing personal data throughout its lifecycle?",
          control: "NIST Privacy GV.PO-P3",
          guidance: "Develop a strategy for managing personal data throughout its lifecycle, from collection through disposal"
        },
        {
          id: "GV-PO-P4",
          question: "Do you integrate privacy requirements into procurement processes and supply chain risk management?",
          control: "NIST Privacy GV.PO-P4 (aligned with CSF 2.0 GV.SC)",
          guidance: "Include privacy requirements in procurement activities, contracts, and supply chain risk management"
        },
        {
          id: "GV-SC-P1",
          question: "Do you identify and assess privacy risks associated with your supply chain?",
          control: "NIST Privacy GV.SC-P1 (aligned with CSF 2.0 GV.SC)",
          guidance: "Identify and assess privacy risks associated with suppliers and service providers in the supply chain"
        },
        {
          id: "GV-SC-P2",
          question: "Do you have contracts and agreements with suppliers that include privacy requirements?",
          control: "NIST Privacy GV.SC-P2",
          guidance: "Establish contracts and agreements with suppliers that include privacy requirements and expectations"
        },
        {
          id: "GV-AT-P1",
          question: "Is privacy awareness and training provided to employees, integrated with cybersecurity awareness?",
          control: "NIST Privacy GV.AT-P1 (aligned with CSF 2.0 GV.AT)",
          guidance: "Conduct privacy awareness and training activities for all staff, coordinated with cybersecurity awareness programs"
        },
        {
          id: "GV-AT-P2",
          question: "Do you provide role-specific privacy training for personnel with privacy responsibilities?",
          control: "NIST Privacy GV.AT-P2",
          guidance: "Provide role-specific privacy training for personnel with privacy responsibilities, including data protection officers and privacy officers"
        }
      ]
    },
    {
      title: "Identify",
      description: "Develop understanding to manage privacy risk",
      estimatedTime: "15min",
      complexity: "Intermediate" as const,
      questionCount: 15,
      questions: [
        {
          id: "ID-IM-P1",
          question: "Have you inventoried data processing activities and systems, including AI systems?",
          control: "NIST Privacy ID.IM-P1 (aligned with CSF 2.0 ID.AM)",
          guidance: "Inventory and map data processing activities and systems containing personal data, including AI systems and automated decision-making processes"
        },
        {
          id: "ID-IM-P2",
          question: "Have you identified the categories of personal data being processed, including data used in AI training?",
          control: "NIST Privacy ID.IM-P2",
          guidance: "Document types of data, categories of individuals, processing purposes, and data used in AI model training and inference"
        },
        {
          id: "ID-IM-P3",
          question: "Have you identified and documented data flows and processing activities, including AI data pipelines?",
          control: "NIST Privacy ID.IM-P3",
          guidance: "Create data flow diagrams or maps showing how personal data moves through systems, including AI training and inference pipelines"
        },
        {
          id: "ID-IM-P4",
          question: "Have you identified the environment your data processing systems operate in, including cloud and AI infrastructure?",
          control: "NIST Privacy ID.IM-P4 (aligned with CSF 2.0 ID.AM-2)",
          guidance: "Document the technical, regulatory, and business environment, including cloud services and AI infrastructure"
        },
        {
          id: "ID-BE-P1",
          question: "Do you understand how your organization's mission, objectives, and activities relate to privacy risk?",
          control: "NIST Privacy ID.BE-P1 (aligned with CSF 2.0 ID.BE)",
          guidance: "Understand the organizational mission, objectives, and activities to inform privacy risk management decisions"
        },
        {
          id: "ID-BE-P2",
          question: "Have you identified stakeholders and their privacy expectations and requirements?",
          control: "NIST Privacy ID.BE-P2",
          guidance: "Identify stakeholders, including individuals whose data is processed, and understand their privacy expectations and requirements"
        },
        {
          id: "ID-BE-P3",
          question: "Do you understand the privacy implications of your organization's business model and data processing activities?",
          control: "NIST Privacy ID.BE-P3",
          guidance: "Understand how organizational business model and data processing activities create privacy risks for individuals"
        },
        {
          id: "ID-RA-P1",
          question: "Have you conducted privacy risk assessments for processing activities, including AI systems?",
          control: "NIST Privacy ID.RA-P1 (aligned with CSF 2.0 ID.RA)",
          guidance: "Assess privacy risks for individuals associated with data processing, including risks from AI systems and automated decision-making"
        },
        {
          id: "ID-RA-P2",
          question: "Do you have processes for identifying and assessing privacy risks on an ongoing basis?",
          control: "NIST Privacy ID.RA-P2",
          guidance: "Establish processes for ongoing identification and assessment of privacy risks, including risks from new technologies and processing activities"
        },
        {
          id: "ID-RA-P3",
          question: "Do you prioritize privacy risks based on their potential impact on individuals?",
          control: "NIST Privacy ID.RA-P3",
          guidance: "Prioritize privacy risks based on their potential impact on individuals, including severity and likelihood of harm"
        },
        {
          id: "ID-DE-P1",
          question: "Can you identify where privacy requirements apply to your organization, including AI-specific regulations?",
          control: "NIST Privacy ID.DE-P1",
          guidance: "Determine applicable regulations and requirements for privacy, including AI governance requirements and algorithmic transparency obligations"
        },
        {
          id: "ID-DE-P2",
          question: "Do you understand the legal basis for processing personal data in different jurisdictions?",
          control: "NIST Privacy ID.DE-P2",
          guidance: "Understand and document the legal basis for processing personal data in different jurisdictions where you operate"
        },
        {
          id: "ID-DE-P3",
          question: "Do you monitor changes in privacy laws and regulations that may affect your organization?",
          control: "NIST Privacy ID.DE-P3",
          guidance: "Establish processes to monitor and understand changes in privacy laws and regulations that may affect your organization"
        },
        {
          id: "ID-SC-P1",
          question: "Have you identified third-party service providers and their roles in processing personal data, including AI service providers?",
          control: "NIST Privacy ID.SC-P1 (aligned with CSF 2.0 ID.SC)",
          guidance: "Identify and document third-party service providers, including AI service providers, cloud providers, and data processors, and their roles in data processing"
        },
        {
          id: "ID-SC-P2",
          question: "Do you assess privacy risks associated with third-party service providers and supply chain partners?",
          control: "NIST Privacy ID.SC-P2",
          guidance: "Assess privacy risks associated with third-party service providers and supply chain partners, including their data processing practices"
        }
      ]
    },
    {
      title: "Control",
      description: "Develop and implement data processing controls",
      estimatedTime: "15min",
      complexity: "Intermediate" as const,
      questionCount: 16,
      questions: [
        {
          id: "CT-DM-P1",
          question: "Do you implement data minimization practices to collect only necessary personal data?",
          control: "NIST Privacy CT.DM-P1",
          guidance: "Process the minimum necessary personal data to achieve the stated purpose"
        },
        {
          id: "CT-DM-P2",
          question: "Do you limit the collection of personal data to what is directly relevant and necessary?",
          control: "NIST Privacy CT.DM-P2",
          guidance: "Limit collection of personal data to what is directly relevant and necessary for the stated purpose"
        },
        {
          id: "CT-DM-P3",
          question: "Do you limit the retention of personal data to what is necessary for the stated purpose?",
          control: "NIST Privacy CT.DM-P3",
          guidance: "Limit retention of personal data to what is necessary for the stated purpose and in accordance with legal requirements"
        },
        {
          id: "CT-DM-P4",
          question: "Do you limit the use of personal data to the stated purpose?",
          control: "NIST Privacy CT.DM-P4",
          guidance: "Limit use of personal data to the stated purpose for which it was collected"
        },
        {
          id: "CT-DM-P5",
          question: "Do you limit sharing of personal data with third parties?",
          control: "NIST Privacy CT.DM-P5",
          guidance: "Limit sharing of personal data with third parties to what is necessary and in accordance with stated purposes"
        },
        {
          id: "CT-DM-P6",
          question: "Do you have processes to review and validate data minimization practices?",
          control: "NIST Privacy CT.DM-P6",
          guidance: "Establish processes to regularly review and validate that data minimization practices are being followed"
        },
        {
          id: "CT-DM-P7",
          question: "Do you track and document data disclosures and sharing with third parties?",
          control: "NIST Privacy CT.DM-P7",
          guidance: "Track and document personal data disclosures to third parties, including purpose and legal basis"
        },
        {
          id: "CT-AC-P1",
          question: "Do you implement access controls for systems with personal data?",
          control: "NIST Privacy CT.AC-P1",
          guidance: "Implement access management for personal data, including role-based access controls"
        },
        {
          id: "CT-AC-P2",
          question: "Do you enforce least privilege principles for access to personal data?",
          control: "NIST Privacy CT.AC-P2",
          guidance: "Enforce least privilege principles, granting access to personal data only to those who need it for their job functions"
        },
        {
          id: "CT-AC-P3",
          question: "Do you regularly review and update access permissions for personal data?",
          control: "NIST Privacy CT.AC-P3",
          guidance: "Regularly review and update access permissions for personal data to ensure they remain appropriate"
        },
        {
          id: "CT-DQ-P1",
          question: "Are measures in place to maintain data quality and integrity?",
          control: "NIST Privacy CT.DQ-P1",
          guidance: "Maintain accuracy, completeness, and relevance of personal data"
        },
        {
          id: "CT-DQ-P2",
          question: "Do you have processes to correct inaccurate personal data?",
          control: "NIST Privacy CT.DQ-P2",
          guidance: "Establish processes to identify and correct inaccurate personal data"
        },
        {
          id: "CT-DP-P1",
          question: "Do you have procedures for data management throughout the data lifecycle?",
          control: "NIST Privacy CT.DP-P1",
          guidance: "Manage personal data throughout its lifecycle, from collection through disposal"
        },
        {
          id: "CT-DP-P2",
          question: "Do you have retention schedules and procedures for disposing of personal data?",
          control: "NIST Privacy CT.DP-P2",
          guidance: "Establish retention schedules and secure procedures for disposing of personal data when no longer needed"
        },
        {
          id: "CT-DP-P3",
          question: "Are disassociated processing methods (de-identification, anonymization) used when appropriate?",
          control: "NIST Privacy CT.DP-P3",
          guidance: "Use de-identification, anonymization, or pseudonymization when appropriate to reduce privacy risks"
        },
        {
          id: "CT-DS-P1",
          question: "Do you implement security controls to protect personal data from unauthorized access, use, or disclosure?",
          control: "NIST Privacy CT.DS-P1",
          guidance: "Implement security controls to protect personal data from unauthorized access, use, or disclosure"
        }
      ]
    },
    {
      title: "Communicate",
      description: "Develop and implement communication processes",
      estimatedTime: "12min",
      complexity: "Intermediate" as const,
      questionCount: 13,
      questions: [
        {
          id: "CM-PO-P1",
          question: "Do you provide privacy notices to individuals?",
          control: "NIST Privacy CM.PO-P1",
          guidance: "Provide clear, accessible privacy notices to individuals whose personal data you process"
        },
        {
          id: "CM-PO-P2",
          question: "Do you explain the purposes for processing personal data in your privacy notices?",
          control: "NIST Privacy CM.PO-P2",
          guidance: "Clearly communicate purposes for processing personal data in privacy notices"
        },
        {
          id: "CM-PO-P3",
          question: "Do you explain the legal basis for processing personal data?",
          control: "NIST Privacy CM.PO-P3",
          guidance: "Explain the legal basis for processing personal data, including consent, contract, legal obligation, vital interests, public task, or legitimate interests"
        },
        {
          id: "CM-PO-P4",
          question: "Do you inform individuals about their privacy rights and how to exercise them?",
          control: "NIST Privacy CM.PO-P4",
          guidance: "Inform individuals about their privacy rights, including access, rectification, erasure, and how to exercise these rights"
        },
        {
          id: "CM-PO-P5",
          question: "Do you provide information about data retention periods and data sharing practices?",
          control: "NIST Privacy CM.PO-P5",
          guidance: "Provide information about how long personal data will be retained and with whom it may be shared"
        },
        {
          id: "CM-AW-P1",
          question: "Do you have a process for individuals to request access to their data?",
          control: "NIST Privacy CM.AW-P1",
          guidance: "Enable individual access to their personal data, including providing copies of their data upon request"
        },
        {
          id: "CM-AW-P2",
          question: "Can individuals correct inaccuracies in their personal data?",
          control: "NIST Privacy CM.AW-P2",
          guidance: "Allow individuals to correct inaccurate personal data and provide mechanisms to do so"
        },
        {
          id: "CM-AW-P3",
          question: "Can individuals request deletion of their personal data?",
          control: "NIST Privacy CM.AW-P3",
          guidance: "Enable individuals to request deletion of personal data, subject to legal and operational requirements"
        },
        {
          id: "CM-AW-P4",
          question: "Do you have processes for handling data portability requests?",
          control: "NIST Privacy CM.AW-P4",
          guidance: "Enable individuals to receive their personal data in a structured, commonly used format and transmit it to another controller"
        },
        {
          id: "CM-AW-P5",
          question: "Do you have processes for handling objections to processing?",
          control: "NIST Privacy CM.AW-P5",
          guidance: "Enable individuals to object to processing of their personal data, including for direct marketing purposes"
        },
        {
          id: "CM-AW-P6",
          question: "Is there a process for handling privacy complaints or questions?",
          control: "NIST Privacy CM.AW-P6",
          guidance: "Provide a mechanism to handle privacy-related inquiries and complaints, including contact information for privacy inquiries"
        },
        {
          id: "CM-IN-P1",
          question: "Do you communicate privacy policies and procedures internally to employees?",
          control: "NIST Privacy CM.IN-P1",
          guidance: "Communicate privacy policies and procedures internally to ensure employees understand their privacy responsibilities"
        },
        {
          id: "CM-IN-P2",
          question: "Do you provide training and awareness about privacy requirements to employees?",
          control: "NIST Privacy CM.IN-P2",
          guidance: "Provide training and awareness about privacy requirements, including how to handle personal data appropriately"
        }
      ]
    },
    {
      title: "Protect",
      description: "Develop and implement data protection measures aligned with CSF 2.0 safeguards",
      estimatedTime: "18min",
      complexity: "Advanced" as const,
      questionCount: 18,
      questions: [
        {
          id: "PR-AC-P1",
          question: "Do you implement access controls for personal data that align with identity and access management practices?",
          control: "NIST Privacy PR.AC-P1 (aligned with CSF 2.0 PR.AC)",
          guidance: "Implement access controls for personal data that coordinate with identity and access management, including role-based access and least privilege"
        },
        {
          id: "PR-AC-P2",
          question: "Do you manage identities and credentials for accessing personal data?",
          control: "NIST Privacy PR.AC-P2",
          guidance: "Manage identities and credentials for accessing personal data, including authentication and authorization mechanisms"
        },
        {
          id: "PR-AC-P3",
          question: "Do you monitor and log access to personal data?",
          control: "NIST Privacy PR.AC-P3",
          guidance: "Monitor and log access to personal data to detect unauthorized access and maintain audit trails"
        },
        {
          id: "PR-AT-P1",
          question: "Are privacy-by-design principles incorporated into system development and AI system design?",
          control: "NIST Privacy PR.AT-P1",
          guidance: "Incorporate privacy-by-design principles in system development, including AI systems and automated decision-making"
        },
        {
          id: "PR-AT-P2",
          question: "Do you provide privacy training to personnel who handle personal data?",
          control: "NIST Privacy PR.AT-P2",
          guidance: "Provide privacy training to personnel who handle personal data, including how to protect personal data and respond to privacy incidents"
        },
        {
          id: "PR-DS-P1",
          question: "Are security measures implemented to protect personal data, coordinated with cybersecurity protections?",
          control: "NIST Privacy PR.DS-P1 (aligned with CSF 2.0 PR.DS)",
          guidance: "Implement security measures to protect personal data in systems, coordinated with cybersecurity data security controls"
        },
        {
          id: "PR-DS-P2",
          question: "Is data encrypted in transit and at rest where appropriate, using current cryptographic standards?",
          control: "NIST Privacy PR.DS-P2 (aligned with CSF 2.0 PR.DS-1)",
          guidance: "Encrypt personal data in transit and at rest using current cryptographic standards and key management practices"
        },
        {
          id: "PR-DS-P3",
          question: "Do you have processes for secure data disposal and destruction?",
          control: "NIST Privacy PR.DS-P3",
          guidance: "Establish processes for secure data disposal and destruction when personal data is no longer needed"
        },
        {
          id: "PR-DS-P4",
          question: "Do you maintain secure data backups with appropriate privacy protections?",
          control: "NIST Privacy PR.DS-P4 (aligned with CSF 2.0 PR.DS-4)",
          guidance: "Implement secure data backups with appropriate protections for personal data, including access controls and encryption"
        },
        {
          id: "PR-IP-P1",
          question: "Do you have information protection processes and procedures for personal data?",
          control: "NIST Privacy PR.IP-P1 (aligned with CSF 2.0 PR.IP)",
          guidance: "Establish information protection processes and procedures for personal data, including classification and handling requirements"
        },
        {
          id: "PR-IP-P2",
          question: "Do you have processes for managing personal data throughout its lifecycle?",
          control: "NIST Privacy PR.IP-P2",
          guidance: "Establish processes for managing personal data throughout its lifecycle, from collection through disposal"
        },
        {
          id: "PR-IP-P3",
          question: "Do you have processes for responding to privacy incidents and data breaches?",
          control: "NIST Privacy PR.IP-P3 (aligned with CSF 2.0 RS.RP)",
          guidance: "Establish procedures to respond to personal data breaches, coordinated with cybersecurity incident response procedures"
        },
        {
          id: "PR-IP-P4",
          question: "Do you test and update privacy protection processes regularly?",
          control: "NIST Privacy PR.IP-P4",
          guidance: "Test and update privacy protection processes regularly to ensure they remain effective"
        },
        {
          id: "PR-MA-P1",
          question: "Do you maintain systems and processes that handle personal data?",
          control: "NIST Privacy PR.MA-P1 (aligned with CSF 2.0 PR.MA)",
          guidance: "Maintain systems and processes that handle personal data, including regular updates and patches"
        },
        {
          id: "PR-MA-P2",
          question: "Do you have processes for managing maintenance activities that may affect personal data?",
          control: "NIST Privacy PR.MA-P2",
          guidance: "Establish processes for managing maintenance activities that may affect personal data, including remote maintenance"
        },
        {
          id: "PR-PT-P1",
          question: "Do you use protective technology to safeguard personal data?",
          control: "NIST Privacy PR.PT-P1 (aligned with CSF 2.0 PR.PT)",
          guidance: "Use protective technology to safeguard personal data, including firewalls, intrusion detection, and data loss prevention"
        },
        {
          id: "PR-PT-P2",
          question: "Do you monitor systems that process personal data for security and privacy events?",
          control: "NIST Privacy PR.PT-P2",
          guidance: "Monitor systems that process personal data for security and privacy events, including unauthorized access attempts"
        },
        {
          id: "PR-PO-P1",
          question: "Are privacy risk assessments conducted for new systems, processes, and AI implementations?",
          control: "NIST Privacy PR.PO-P1",
          guidance: "Conduct privacy impact assessments for new systems, processes, and AI implementations, including algorithmic impact assessments"
        },
        {
          id: "PR-PO-P2",
          question: "Do you have processes for managing privacy risks in ongoing operations?",
          control: "NIST Privacy PR.PO-P2",
          guidance: "Establish processes for managing privacy risks in ongoing operations, including regular risk reviews and updates"
        }
      ]
    }
  ];

  // Format the last saved time in a user-friendly way
  const formatLastSaved = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // If in collaboration mode, save to collaborative session
    if (collaborationMode && collabSessionId && currentUser) {
      CollaborationManager.submitAnswer(
        collabSessionId,
        questionId,
        answer,
        currentUser.id
      );
    }
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
      frameworkName: 'NIST Privacy Framework v1.1 (draft)',
      completedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      answers // Include answers for potential future use
    };

    // Clear saved progress since assessment is complete
    secureStorage.removeItem(STORAGE_KEY);

    // Route to appropriate results page based on assessment mode
    if (assessmentMode === 'organizational') {
      navigate('/privacy-results/organizational', { 
        state: { 
          assessmentResults: results,
          assessmentMode: 'organizational'
        } 
      });
    } else {
      // Individual mode - existing flow
      navigate('/privacy-results', { 
        state: { 
          assessmentResults: results,
          assessmentMode: 'individual'
        } 
      });
    }
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
        description="Evaluate your privacy program against the NIST Privacy Framework v1.1 (draft) aligned with NIST CSF 2.0"
        frameworkName="NIST Privacy Framework v1.1"
        sections={sectionInfoList}
        onStart={(mode) => {
          setAssessmentMode(mode);
          setShowStartScreen(false);
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AssessmentFlowProgress currentStep="assessment" />
      <div className="mb-6">
        <Link to="/assessment" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Privacy Framework Assessment
              {collaborationMode && (
                <span className="ml-3 text-sm font-normal text-primary inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Collaborative
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mb-6">Based on the NIST Privacy Framework v1.1 (draft) aligned with NIST CSF 2.0 - five core functions</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isSaving ? (
              <>
                <Save className="h-4 w-4 animate-pulse text-primary" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Saved {formatLastSaved(lastSaved)}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
      
      {/* Collaborative Progress */}
      {collaborationMode && collabSessionId && (
        <CollaborativeProgress sessionId={collabSessionId} />
      )}
      
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
              
              {/* Collaboration Features */}
              {collaborationMode && collabSessionId && currentUser && (
                <QuestionCollaboration
                  sessionId={collabSessionId}
                  questionId={question.id}
                  currentUserId={currentUser.id}
                  currentUserName={currentUser.name}
                />
              )}
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