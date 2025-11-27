import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '../ui/Button';
import { X, Send, Notebook as Robot, Loader2, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChatbot } from './ChatbotProvider';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: ChatOption[];
  links?: ChatLink[];
}

interface ChatOption {
  id: string;
  text: string;
  nextStep: string;
}

interface ChatLink {
  text: string;
  url: string;
  external?: boolean;
}

interface ChatFlow {
  [key: string]: {
    message: string;
    options?: ChatOption[];
    links?: ChatLink[];
  };
}

const ChatGuideBot = () => {
  const { isOpen, openChatbot, closeChatbot } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [, setCurrentStep] = useState('welcome');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced chat flow definition with comprehensive platform context
  const chatFlow: ChatFlow = useMemo(() => ({
    welcome: {
      message: "👋 Hello! I'm your CyberCorrect Privacy Platform guide. I can help you navigate our comprehensive privacy compliance platform, understand regulations like GDPR and CCPA, use our assessment tools, and generate compliance documentation. What would you like to learn about?",
      options: [
        { id: 'privacy', text: 'Privacy Compliance & Frameworks', nextStep: 'privacy' },
        { id: 'data-protection', text: 'Data Protection & Rights', nextStep: 'data-protection' },
        { id: 'getting-started', text: 'Getting Started Guide', nextStep: 'getting-started' },
        { id: 'assessments', text: 'Privacy Assessments', nextStep: 'assessments' },
        { id: 'tools', text: 'Compliance Tools', nextStep: 'tools' },
        { id: 'regulations', text: 'Privacy Regulations', nextStep: 'regulations' }
      ]
    },
    privacy: {
      message: "Privacy compliance involves implementing comprehensive data protection controls aligned with global regulations. CyberCorrect Privacy Platform provides multi-framework assessments (GDPR, CCPA, LGPD, PIPEDA, NIST Privacy Framework), automated documentation generators (DPIA, privacy policies, data processing records), gap analysis with risk-based prioritization, and continuous compliance monitoring. Our platform uses weighted scoring algorithms to calculate compliance maturity levels and identify remediation priorities.",
      options: [
        { id: 'privacy-frameworks', text: 'Privacy Frameworks Explained', nextStep: 'privacy-frameworks' },
        { id: 'privacy-tools', text: 'Privacy Tools & Features', nextStep: 'privacy-tools' },
        { id: 'privacy-assessment', text: 'Privacy Assessment Details', nextStep: 'privacy-assessment' },
        { id: 'gap-analysis', text: 'Gap Analysis & Scoring', nextStep: 'gap-analysis' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'Privacy Gap Analyzer', url: '/toolkit/privacy-gap-analyzer' },
        { text: 'Privacy Framework Guide', url: '/documentation/privacy-framework-guide' }
      ]
    },
    'privacy-frameworks': {
      message: "CyberCorrect supports multiple privacy frameworks: **GDPR** (EU) - data subject rights, lawful basis, data protection by design; **CCPA/CPRA** (California) - consumer privacy rights, opt-out mechanisms, data transparency; **LGPD** (Brazil) - similar to GDPR with Brazilian-specific requirements; **PIPEDA** (Canada) - consent-based data processing; **NIST Privacy Framework** - enterprise privacy risk management with 5 core functions (Identify, Govern, Control, Communicate, Protect). Our platform maps controls across frameworks, identifies overlaps, and provides cross-framework gap analysis.",
      options: [
        { id: 'back-to-privacy', text: 'Back to Privacy', nextStep: 'privacy' },
        { id: 'privacy-tools', text: 'Privacy Tools', nextStep: 'privacy-tools' },
        { id: 'regulations', text: 'Learn About Regulations', nextStep: 'regulations' }
      ],
      links: [
        { text: 'Privacy Framework Guide', url: '/documentation/privacy-framework-guide' },
        { text: 'Privacy Gap Analyzer', url: '/toolkit/privacy-gap-analyzer' }
      ]
    },
    'gap-analysis': {
      message: "Our Privacy Gap Analyzer uses sophisticated algorithms to identify compliance gaps across multiple frameworks. It calculates domain-specific compliance scores using weighted control priorities, determines maturity levels (Level 1-5) based on implementation rates, and provides risk-based prioritization. The scoring system uses Yes=2, Partial=1, No=0 weights, with maturity thresholds: Level 1 (<40%), Level 2 (40-70%), Level 3 (70-85%), Level 4 (85-95%), Level 5 (>95%). Gap urgency is calculated using risk level, time weighting, and business impact.",
      options: [
        { id: 'back-to-privacy', text: 'Back to Privacy', nextStep: 'privacy' },
        { id: 'try-gap-analyzer', text: 'Try Gap Analyzer', nextStep: 'try-gap-analyzer' }
      ],
      links: [
        { text: 'Privacy Gap Analyzer', url: '/toolkit/privacy-gap-analyzer' }
      ]
    },
    'privacy-tools': {
      message: "CyberCorrect Privacy Platform provides comprehensive privacy compliance tools: **1) Privacy Assessment** - Multi-framework evaluation (GDPR, CCPA, LGPD, PIPEDA, NIST) with weighted scoring; **2) Privacy Gap Analyzer** - Cross-framework gap identification with risk-based prioritization; **3) DPIA Generator** - Automated Data Protection Impact Assessments with GDPR Article 35 risk threshold calculations; **4) Privacy Rights Manager** - GDPR/CCPA data subject rights workflow with 30-day compliance tracking; **5) Privacy Policy Generator** - Multi-regulation policy templates; **6) GDPR Mapper** - Article 30 compliant data processing records; **7) Consent Management** - Track employee consent and privacy preferences; **8) Vendor Risk Assessment** - Third-party privacy compliance evaluation; **9) Incident Response Manager** - Privacy breach tracking and compliance violation management.",
      options: [
        { id: 'back-to-privacy', text: 'Back to Privacy', nextStep: 'privacy' },
        { id: 'try-tools', text: 'Try Privacy Tools', nextStep: 'try-tools' },
        { id: 'tools', text: 'All Compliance Tools', nextStep: 'tools' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'DPIA Generator', url: '/toolkit/dpia-generator' },
        { text: 'Privacy Gap Analyzer', url: '/toolkit/privacy-gap-analyzer' },
        { text: 'Privacy Rights Manager', url: '/toolkit/privacy-rights-manager' }
      ]
    },
    'privacy-assessment': {
      message: "CyberCorrect's Privacy Assessment evaluates compliance across multiple frameworks (GDPR, CCPA, LGPD, PIPEDA, NIST Privacy Framework). The assessment uses weighted scoring algorithms across 5 core privacy functions (Identify, Govern, Control, Communicate, Protect), calculates domain-specific maturity levels, and provides risk-based gap prioritization. Assessments take 30-45 minutes and require minimum 50% section completion. Results include compliance scores, maturity levels (1-5), prioritized remediation recommendations, and cross-framework gap analysis.",
      options: [
        { id: 'back-to-privacy', text: 'Back to Privacy', nextStep: 'privacy' },
        { id: 'start-assessment', text: 'Start Assessment', nextStep: 'start-assessment' },
        { id: 'assessment-details', text: 'Assessment Details', nextStep: 'privacy-assessment-detail' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'Assessment Guide', url: '/documentation/assessment-guide' }
      ]
    },
    'data-protection': {
      message: "Data protection involves implementing comprehensive measures to safeguard personal data according to privacy regulations. CyberCorrect helps you: **1) Data Mapping** - GDPR Article 30 compliant data processing activity records with legal basis tracking; **2) Data Subject Rights** - GDPR/CCPA rights management (access, rectification, erasure, portability) with 30-day compliance windows and SLA monitoring; **3) DPIA Generation** - Automated Data Protection Impact Assessments with GDPR Article 35 risk threshold calculations and processing activity classification; **4) Data Flow Mapping** - Visual documentation of personal data flows; **5) Retention Policy Management** - Data retention policies aligned with legal requirements; **6) Privacy by Design Assessment** - Evaluation against 7 Privacy by Design principles.",
      options: [
        { id: 'data-mapping', text: 'Data Mapping & Processing Records', nextStep: 'data-mapping' },
        { id: 'data-subject-rights', text: 'Data Subject Rights Management', nextStep: 'data-subject-rights' },
        { id: 'data-docs', text: 'Data Protection Documentation', nextStep: 'data-docs' },
        { id: 'dpia', text: 'DPIA Generator', nextStep: 'dpia' }
      ],
      links: [
        { text: 'GDPR Mapper', url: '/toolkit/gdpr-mapper' },
        { text: 'Privacy Rights Manager', url: '/toolkit/privacy-rights-manager' },
        { text: 'DPIA Generator', url: '/toolkit/dpia-generator' }
      ]
    },
    'data-mapping': {
      message: "Data mapping helps you understand how personal data flows through your organization. Our GDPR Mapper creates Article 30 compliant data processing activity records with legal basis tracking, data categories, processing purposes, retention periods, and third-party sharing documentation. This is essential for GDPR compliance and helps identify privacy risks, compliance gaps, and data processing dependencies.",
      options: [
        { id: 'back-to-data-protection', text: 'Back to Data Protection', nextStep: 'data-protection' },
        { id: 'start-data-mapping', text: 'Start Data Mapping', nextStep: 'start-data-mapping' }
      ],
      links: [
        { text: 'GDPR Mapper', url: '/toolkit/gdpr-mapper' },
        { text: 'Data Flow Mapper', url: '/toolkit/data-flow-mapper' }
      ]
    },
    'data-subject-rights': {
      message: "Data subject rights management helps you handle requests from individuals about their personal data. Our Privacy Rights Manager supports GDPR rights (access, rectification, erasure, portability, objection, restriction) and CCPA rights (access, deletion, opt-out of sale, non-discrimination). Features include automated 30-day compliance window tracking, request prioritization, identity verification workflows, SLA monitoring, and audit trail tracking for compliance documentation.",
      options: [
        { id: 'back-to-data-protection', text: 'Back to Data Protection', nextStep: 'data-protection' },
        { id: 'try-rights-manager', text: 'Try Rights Manager', nextStep: 'try-rights-manager' }
      ],
      links: [
        { text: 'Privacy Rights Manager', url: '/toolkit/privacy-rights-manager' }
      ]
    },
    'data-docs': {
      message: "CyberCorrect helps you generate and manage privacy-related documentation: **DPIA (Data Protection Impact Assessment)** - Automated GDPR Article 35 assessments with risk threshold calculations; **Privacy Policies** - Multi-regulation templates (GDPR, CCPA, LGPD) with customization; **Data Processing Records** - Article 30 compliant documentation; **Retention Policies** - Legal requirement-aligned data retention management; **Breach Notifications** - Incident response documentation; **Privacy Notices** - Regulation-specific privacy notices. All documents are exportable in PDF, Word, and HTML formats with version control.",
      options: [
        { id: 'back-to-data-protection', text: 'Back to Data Protection', nextStep: 'data-protection' },
        { id: 'dpia', text: 'DPIA Generator', nextStep: 'dpia' },
        { id: 'policy-generator', text: 'Policy Generator', nextStep: 'policy-generator' }
      ],
      links: [
        { text: 'DPIA Generator', url: '/toolkit/dpia-generator' },
        { text: 'Privacy Policy Generator', url: '/toolkit/privacy-policy-generator' },
        { text: 'Retention Policy Generator', url: '/toolkit/retention-policy-generator' }
      ]
    },
    'dpia': {
      message: "The DPIA (Data Protection Impact Assessment) Generator automates GDPR Article 35 assessments. It calculates risk thresholds based on data categories, processing activity classification, impact severity scoring, and determines when a DPIA is required. The tool guides you through structured assessment progression with domain validation, risk level determination, and GDPR requirement compliance status tracking. Results include risk assessment, mitigation recommendations, and compliance documentation.",
      options: [
        { id: 'back-to-data-protection', text: 'Back to Data Protection', nextStep: 'data-protection' },
        { id: 'try-dpia', text: 'Try DPIA Generator', nextStep: 'try-dpia' }
      ],
      links: [
        { text: 'DPIA Generator', url: '/toolkit/dpia-generator' },
        { text: 'DPIA Manager', url: '/toolkit/dpia-manager' }
      ]
    },
    'policy-generator': {
      message: "The Privacy Policy Generator creates multi-regulation privacy policies using framework-specific templates. It generates organization-specific clauses based on your data processing activities, maps regulatory requirements (GDPR, CCPA, LGPD, PIPEDA), and provides customization options. Policies include required sections like data collection, processing purposes, legal basis, data subject rights, retention periods, and contact information.",
      options: [
        { id: 'back-to-data-protection', text: 'Back to Data Protection', nextStep: 'data-protection' },
        { id: 'try-policy', text: 'Try Policy Generator', nextStep: 'try-policy' }
      ],
      links: [
        { text: 'Privacy Policy Generator', url: '/toolkit/privacy-policy-generator' }
      ]
    },
    'getting-started': {
      message: "Welcome to CyberCorrect Privacy Platform! To get started: **1) Take the Privacy Assessment** (30-45 minutes) to evaluate your compliance across GDPR, CCPA, LGPD, PIPEDA, and NIST Privacy Framework; **2) Review Results** - Get compliance scores, maturity levels, and prioritized gap analysis; **3) Use Tools** - Generate DPIAs, privacy policies, data processing records, and manage data subject rights; **4) Create Privacy Project** - Set up team roles, track remediation progress, and manage evidence; **5) Explore Documentation** - Access implementation guides, templates, and compliance resources.",
      options: [
        { id: 'platform-tour', text: 'Platform Tour', nextStep: 'platform-tour' },
        { id: 'first-steps', text: 'First Steps', nextStep: 'first-steps' },
        { id: 'documentation', text: 'Documentation & Guides', nextStep: 'documentation' },
        { id: 'assessments', text: 'Start Assessment', nextStep: 'assessments' }
      ],
      links: [
        { text: 'Getting Started Guide', url: '/documentation/getting-started' },
        { text: 'Quick Start Guide', url: '/documentation/quick-start' },
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' }
      ]
    },
    'platform-tour': {
      message: "CyberCorrect offers several key modules: 1) Assessment tools for compliance evaluation, 2) Documentation generators for required paperwork, 3) Monitoring dashboards for continuous compliance, and 4) Resource libraries with guides and templates.",
      options: [
        { id: 'back-to-getting-started', text: 'Back to Getting Started', nextStep: 'getting-started' },
        { id: 'assessments', text: 'Assessment Tools', nextStep: 'assessments' }
      ],
      links: [
        { text: 'Platform Overview', url: '/documentation/platform-overview' },
        { text: 'Dashboard Guide', url: '/documentation/understanding-dashboard' }
      ]
    },
    'first-steps': {
      message: "For your first steps: 1) Take the Privacy Assessment to understand your baseline, 2) Review results and identify gaps, 3) Use the Privacy Gap Analyzer to plan fixes, and 4) Explore documentation templates.",
      options: [
        { id: 'back-to-getting-started', text: 'Back to Getting Started', nextStep: 'getting-started' },
        { id: 'start-quick-check', text: 'Start Quick Check', nextStep: 'start-quick-check' }
      ],
      links: [
        { text: 'Start Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'Privacy Gap Analyzer', url: '/toolkit/privacy-gap-analyzer' }
      ]
    },
    'documentation': {
      message: "CyberCorrect provides comprehensive documentation including user guides, framework explanations, implementation instructions, and compliance templates. What specifically would you like to learn about?",
      options: [
        { id: 'privacy-docs', text: 'Privacy Framework', nextStep: 'privacy-docs' },
        { id: 'assessment-docs', text: 'Assessment Guide', nextStep: 'assessment-docs' }
      ],
      links: [
        { text: 'Documentation Home', url: '/documentation' },
        { text: 'FAQs', url: '/documentation/faqs' }
      ]
    },
    'assessments': {
      message: "CyberCorrect provides comprehensive privacy assessment tools: **Privacy Assessment** - Multi-framework evaluation (GDPR, CCPA, LGPD, PIPEDA, NIST Privacy Framework) with weighted scoring, maturity level calculation, and risk-based gap prioritization. Assessments evaluate 5 core privacy functions (Identify, Govern, Control, Communicate, Protect), use Yes=2/Partial=1/No=0 scoring weights, require minimum 50% section completion, and provide actionable remediation recommendations with implementation timelines.",
      options: [
        { id: 'privacy-assessment-2', text: 'Privacy Assessment Details', nextStep: 'privacy-assessment' },
        { id: 'gap-analysis', text: 'Gap Analysis', nextStep: 'gap-analysis' },
        { id: 'start-assessment', text: 'Start Assessment', nextStep: 'start-assessment' }
      ],
      links: [
        { text: 'Start Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'Privacy Gap Analyzer', url: '/toolkit/privacy-gap-analyzer' },
        { text: 'Assessment Guide', url: '/documentation/assessment-guide' }
      ]
    },
    'tools': {
      message: "CyberCorrect Privacy Platform offers comprehensive compliance tools: **Privacy Tools** - Privacy Assessment, Gap Analyzer, DPIA Generator, Privacy Rights Manager, GDPR Mapper, Privacy Policy Generator, Consent Management, Vendor Risk Assessment, Incident Response Manager, Retention Policy Generator, Privacy by Design Assessment, Service Provider Manager; **Project Management** - Privacy Project Dashboard, RACI Matrix, Work Breakdown Structure, Evidence Vault, Privacy Roadmap; **Documentation** - Automated document generation with templates, version control, and export options (PDF, Word, HTML).",
      options: [
        { id: 'privacy-tools', text: 'Privacy Tools', nextStep: 'privacy-tools' },
        { id: 'project-management', text: 'Project Management', nextStep: 'project-management' },
        { id: 'back-to-welcome', text: 'Back to Main Menu', nextStep: 'welcome' }
      ],
      links: [
        { text: 'Toolkit Hub', url: '/toolkit' },
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' }
      ]
    },
    'regulations': {
      message: "CyberCorrect supports multiple privacy regulations: **GDPR** (EU) - Data subject rights, lawful basis, data protection by design, Article 30 records, DPIA requirements, 72-hour breach notification; **CCPA/CPRA** (California) - Consumer privacy rights, opt-out mechanisms, data transparency, non-discrimination, deletion rights; **LGPD** (Brazil) - Similar to GDPR with Brazilian-specific requirements, ANPD oversight; **PIPEDA** (Canada) - Consent-based processing, privacy impact assessments, breach notification; **NIST Privacy Framework** - Enterprise privacy risk management with 5 core functions. Our platform maps controls across these frameworks and provides cross-framework compliance analysis.",
      options: [
        { id: 'privacy-frameworks', text: 'Privacy Frameworks', nextStep: 'privacy-frameworks' },
        { id: 'privacy', text: 'Privacy Compliance', nextStep: 'privacy' },
        { id: 'back-to-welcome', text: 'Back to Main Menu', nextStep: 'welcome' }
      ],
      links: [
        { text: 'Privacy Framework Guide', url: '/documentation/privacy-framework-guide' },
        { text: 'GDPR Implementation Guide', url: '/documentation/gdpr-implementation-guide' }
      ]
    },
    'project-management': {
      message: "CyberCorrect's Privacy Project Management suite helps you organize compliance work: **Privacy Project Dashboard** - Track projects with compliance metrics and progress visualization; **RACI Matrix** - Role-based responsibility assignment (Responsible, Accountable, Consulted, Informed) for collaborative privacy implementation; **Work Breakdown Structure (WBS)** - Hierarchical task management with dependency tracking; **Evidence Vault** - Centralized compliance evidence management with version control and audit trails; **Privacy Roadmap** - Personalized implementation roadmap with timeline planning and milestones.",
      options: [
        { id: 'tools', text: 'Back to Tools', nextStep: 'tools' },
        { id: 'back-to-welcome', text: 'Back to Main Menu', nextStep: 'welcome' }
      ],
      links: [
        { text: 'Privacy Project Dashboard', url: '/project' },
        { text: 'Evidence Vault', url: '/project/evidence' }
      ]
    },
    'try-gap-analyzer': {
      message: "The Privacy Gap Analyzer identifies compliance gaps across multiple frameworks (GDPR, CCPA, LGPD, PIPEDA, NIST Privacy Framework). It uses weighted scoring algorithms to calculate domain-specific compliance scores, determines maturity levels based on implementation rates, and provides risk-based prioritization with urgency scoring. Results include prioritized remediation recommendations with implementation timelines.",
      links: [
        { text: 'Privacy Gap Analyzer', url: '/toolkit/privacy-gap-analyzer' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'try-dpia': {
      message: "The DPIA Generator automates GDPR Article 35 Data Protection Impact Assessments. It calculates risk thresholds, classifies processing activities, scores impact severity by data category, and determines when a DPIA is required. The tool provides structured assessment progression, risk level determination, and GDPR compliance status tracking.",
      links: [
        { text: 'DPIA Generator', url: '/toolkit/dpia-generator' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'try-policy': {
      message: "The Privacy Policy Generator creates multi-regulation privacy policies using framework-specific templates. It generates organization-specific clauses, maps regulatory requirements, and provides customization options for GDPR, CCPA, LGPD, and PIPEDA compliance.",
      links: [
        { text: 'Privacy Policy Generator', url: '/toolkit/privacy-policy-generator' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'other-assessments': {
      message: "Explore our Privacy Assessment with detailed recommendations and implementation guidance.",
      options: [
        { id: 'back-to-assessments', text: 'Back to Assessments', nextStep: 'assessments' },
        { id: 'privacy', text: 'Privacy Assessment', nextStep: 'privacy-assessment-detail' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'Assessment Guide', url: '/documentation/assessment-guide' }
      ]
    },
    'privacy-assessment-detail': {
      message: "The Privacy Assessment evaluates your compliance with the NIST Privacy Framework. It covers Identify, Govern, Control, Communicate, and Protect functions with detailed recommendations tailored to your responses.",
      options: [
        { id: 'back-to-other-assessments', text: 'Back to Assessments', nextStep: 'other-assessments' },
        { id: 'start-privacy-assessment', text: 'Start Privacy Assessment', nextStep: 'start-privacy-assessment' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'GDPR Mapper', url: '/toolkit/gdpr-mapper' }
      ]
    },
    'start-assessment': {
      message: "Great! Let's start your Privacy Assessment to evaluate your practices and identify gaps to fix.",
      links: [
        { text: 'Begin Privacy Assessment', url: '/assessments/privacy-assessment' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'try-tools': {
      message: "Our privacy tools work together to simplify your journey: run the assessment, analyze gaps, and generate documentation.",
      links: [
        { text: 'Privacy Gap Analyzer', url: '/toolkit/privacy-gap-analyzer' },
        { text: 'Privacy Policy Generator', url: '/toolkit/privacy-policy-generator' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'start-privacy-assessment': {
      message: "The Privacy Assessment will evaluate your privacy practices against the NIST Privacy Framework. It covers data governance, protection measures, and individual privacy rights.",
      links: [
        { text: 'Start Privacy Assessment', url: '/privacy-assessment' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'privacy-docs': {
      message: "Learn about the NIST Privacy Framework and how to implement privacy controls with our guides.",
      links: [
        { text: 'Privacy Framework Guide', url: '/documentation/privacy-framework-guide' },
        { text: 'Understanding RMF', url: '/documentation/understanding-rmf' }
      ],
      options: [
        { id: 'back-to-documentation', text: 'Back to Documentation', nextStep: 'documentation' }
      ]
    },
    'assessment-docs': {
      message: "Read how our assessments work and how to interpret results to plan remediation.",
      links: [
        { text: 'Assessment Guide', url: '/documentation/assessment-guide' },
        { text: 'Platform Overview', url: '/documentation/platform-overview' }
      ],
      options: [
        { id: 'back-to-documentation', text: 'Back to Documentation', nextStep: 'documentation' }
      ]
    }
  }), []);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeStep = chatFlow['welcome'];
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: welcomeStep.message,
        sender: 'bot',
        timestamp: new Date(),
        options: welcomeStep.options,
        links: welcomeStep.links
      };
      
      setMessages([welcomeMessage]);
    }
  }, [messages.length, chatFlow]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user' as const,
      timestamp: new Date()};

    setMessages([...messages, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Process user message and generate response
    setTimeout(() => {
      // For free text input, try to determine intent and direct to appropriate step
      processUserMessage(inputText);
      setIsTyping(false);
    }, 1000);
  };

  const processUserMessage = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Enhanced intent mapping with comprehensive keyword recognition
    // Privacy compliance and frameworks
    if (lowerText.includes('gdpr') || lowerText.includes('general data protection regulation')) {
      addBotResponse('regulations');
    }
    else if (lowerText.includes('ccpa') || lowerText.includes('cpra') || lowerText.includes('california privacy')) {
      addBotResponse('regulations');
    }
    else if (lowerText.includes('lgpd') || lowerText.includes('brazil') || lowerText.includes('pipeda') || lowerText.includes('canada')) {
      addBotResponse('regulations');
    }
    else if (lowerText.includes('nist privacy') || lowerText.includes('privacy framework')) {
      addBotResponse('privacy-frameworks');
    }
    // Privacy tools and features
    else if (lowerText.includes('dpia') || lowerText.includes('data protection impact') || lowerText.includes('impact assessment')) {
      addBotResponse('dpia');
    }
    else if (lowerText.includes('privacy policy') || lowerText.includes('policy generator')) {
      addBotResponse('policy-generator');
    }
    else if (lowerText.includes('gap') || lowerText.includes('gap analysis') || lowerText.includes('compliance gap')) {
      addBotResponse('gap-analysis');
    }
    else if (lowerText.includes('data subject rights') || lowerText.includes('privacy rights') || lowerText.includes('data rights')) {
      addBotResponse('data-subject-rights');
    }
    else if (lowerText.includes('data mapping') || lowerText.includes('data flow') || lowerText.includes('article 30') || lowerText.includes('processing record')) {
      addBotResponse('data-mapping');
    }
    // Assessments
    else if (lowerText.includes('assess') || lowerText.includes('evaluate') || lowerText.includes('assessment') || lowerText.includes('compliance score')) {
      addBotResponse('assessments');
    }
    else if (lowerText.includes('privacy assessment') || lowerText.includes('take assessment')) {
      addBotResponse('privacy-assessment');
    }
    // Getting started
    else if (lowerText.includes('start') || lowerText.includes('begin') || lowerText.includes('new') || lowerText.includes('getting started') || lowerText.includes('how do i')) {
      addBotResponse('getting-started');
    }
    // Tools
    else if (lowerText.includes('tool') || lowerText.includes('feature') || lowerText.includes('capability')) {
      addBotResponse('tools');
    }
    // Project management
    else if (lowerText.includes('project') || lowerText.includes('roadmap') || lowerText.includes('raci') || lowerText.includes('evidence vault')) {
      addBotResponse('project-management');
    }
    // Privacy compliance general
    else if (lowerText.includes('privacy') || lowerText.includes('compliance') || lowerText.includes('data protection')) {
      addBotResponse('privacy');
    }
    // Help and navigation
    else if (lowerText.includes('help') || lowerText.includes('guide') || lowerText.includes('confused') || lowerText.includes('what can') || lowerText.includes('how can')) {
      addBotResponse('welcome');
    }
    else {
      // Enhanced fallback response with helpful suggestions
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        text: "I'm not sure I understand. I can help you with privacy compliance, assessments, tools, regulations (GDPR, CCPA, LGPD, PIPEDA), data protection, DPIA generation, and more. Could you try rephrasing or select one of these topics?",
        sender: 'bot',
        timestamp: new Date(),
        options: chatFlow['welcome'].options
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  const handleSelectOption = (nextStep: string) => {
    const option = chatFlow[nextStep];
    
    if (option) {
      setCurrentStep(nextStep);
      addBotResponse(nextStep);
    }
  };

  const addBotResponse = (step: string) => {
    const flowStep = chatFlow[step];
    
    if (flowStep) {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: flowStep.message,
        sender: 'bot',
        timestamp: new Date(),
        options: flowStep.options,
        links: flowStep.links
      };
      
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col" data-chat-bot>
      {/* Chat Button */}
      {!isOpen && (
        <Button 
          className="rounded-full shadow-lg bg-success hover:bg-success/90"
          size="icon"
          onClick={openChatbot}
          data-chat-bot-toggle
        >
          <Robot className="h-5 w-5" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-background border border-border rounded-lg shadow-lg flex flex-col h-[500px] max-h-[80vh] overflow-hidden"
          data-chat-bot-window
        >
          {/* Chat Header */}
          <div className="p-4 bg-success text-white flex items-center justify-between">
            <div className="flex items-center">
              <Robot className="h-5 w-5 mr-2" />
              <div>
                <h3 className="font-medium">CyberCorrect Guide</h3>
                <p className="text-xs opacity-80">Interactive Compliance Assistant</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:text-white/80 hover:bg-success/80"
              onClick={closeChatbot}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center mb-1">
                        <div className="bg-success/20 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                          <Robot className="h-3 w-3 text-success" />
                        </div>
                        <span className="text-xs font-medium">CyberCorrect Guide</span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    
                    {/* Render option buttons */}
                    {message.options && message.options.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.options.map(option => (
                          <button
                            key={option.id}
                            className="w-full text-left px-3 py-2 text-sm bg-background hover:bg-muted/50 rounded-md flex items-center transition-colors"
                            onClick={() => handleSelectOption(option.nextStep)}
                          >
                            <ChevronRight className="h-3 w-3 mr-1 text-success" />
                            {option.text}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Render links */}
                    {message.links && message.links.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.links.map((link, index) => (
                          link.external ? (
                            <a 
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-left px-3 py-2 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md flex items-center transition-colors"
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              {link.text}
                            </a>
                          ) : (
                            <Link
                              key={index}
                              to={link.url}
                              className="block text-left px-3 py-2 text-sm bg-success/10 text-success hover:bg-success/20 rounded-md flex items-center transition-colors"
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              {link.text}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                    
                    <div 
                      className={`text-xs mt-1 ${
                        message.sender === 'user' 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Bot is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-3 border-t border-border">
            <div className="flex items-center">
              <textarea
                className="flex-1 border border-border rounded-lg p-2 text-sm min-h-12 max-h-32 resize-none focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                placeholder="Type your question or select an option above..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
              <Button 
                size="icon" 
                className="ml-2 h-9 w-9"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGuideBot;