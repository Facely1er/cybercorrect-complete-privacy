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

  // Chat flow definition
  const chatFlow: ChatFlow = useMemo(() => ({
    welcome: {
      message: "👋 Hello! I'm your CyberCorrect guide. I can help you navigate our platform and understand compliance requirements. What would you like to learn about?",
      options: [
        { id: 'cmmc', text: 'CMMC 2.0 Compliance', nextStep: 'cmmc' },
        { id: 'cui', text: 'CUI Protection', nextStep: 'cui' },
        { id: 'getting-started', text: 'Getting Started', nextStep: 'getting-started' },
        { id: 'assessments', text: 'Assessment Tools', nextStep: 'assessments' }
      ]
    },
    cmmc: {
      message: "Security framework compliance involves implementing comprehensive security controls and best practices. PrivacyCorrect provides assessment tools, documentation generators, and continuous monitoring for enterprise security compliance.",
      options: [
        { id: 'security-frameworks', text: 'Security Frameworks', nextStep: 'security-frameworks' },
        { id: 'security-tools', text: 'Security Tools', nextStep: 'security-tools' },
        { id: 'security-assessment', text: 'Security Assessment', nextStep: 'security-assessment' }
      ],
      links: [
        { text: 'Security Assessment', url: '/assessments/security-assessment' },
        { text: 'Security Framework Guide', url: '/documentation/security-framework-guide' }
      ]
    },
    'security-frameworks': {
      message: "Security frameworks provide structured approaches to implementing security controls. Common frameworks include ISO 27001, NIST CSF, and SOC 2, each with specific controls and requirements for different organizational needs.",
      options: [
        { id: 'back-to-security', text: 'Back to Security', nextStep: 'cmmc' },
        { id: 'security-tools', text: 'Security Tools', nextStep: 'security-tools' }
      ]
    },
    'security-tools': {
      message: "PrivacyCorrect provides comprehensive tools for security compliance: 1) Security assessment for initial evaluation, 2) Documentation generators for policies and procedures, 3) Gap analysis for remediation planning, and 4) Continuous monitoring dashboards.",
      options: [
        { id: 'back-to-security', text: 'Back to Security', nextStep: 'cmmc' },
        { id: 'try-tools', text: 'Try Security Tools', nextStep: 'try-tools' }
      ],
      links: [
        { text: 'Security Assessment', url: '/assessments/security-assessment' },
        { text: 'DPIA Generator', url: '/toolkit/dpia-generator' }
      ]
    },
    'security-assessment': {
      message: "PrivacyCorrect's security assessment tools help you evaluate your compliance with security frameworks and privacy requirements. Our assessments provide comprehensive evaluations with actionable recommendations.",
      options: [
        { id: 'back-to-security', text: 'Back to Security', nextStep: 'cmmc' },
        { id: 'start-assessment', text: 'Start Assessment', nextStep: 'start-assessment' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' }
      ]
    },
    cui: {
      message: "Controlled Unclassified Information (CUI) requires special handling according to law, regulation, or government-wide policy. CyberCorrect helps you identify, mark, and protect CUI in compliance with NIST SP 800-171.",
      options: [
        { id: 'cui-assessment', text: 'CUI Assessment', nextStep: 'cui-assessment' },
        { id: 'cui-mapping', text: 'CUI Data Mapping', nextStep: 'cui-mapping' },
        { id: 'cui-docs', text: 'CUI Documentation', nextStep: 'cui-docs' }
      ],
      links: [
        { text: 'CUI Assessment', url: '/cui-assessment' },
        { text: 'CUI Handling Guide', url: '/documentation/cui-handling-guide' }
      ]
    },
    'cui-assessment': {
      message: "The CUI Assessment evaluates your organization's compliance with NIST SP 800-171 requirements for protecting CUI. It covers all 14 control families with detailed recommendations.",
      options: [
        { id: 'back-to-cui', text: 'Back to CUI', nextStep: 'cui' },
        { id: 'start-cui-assessment', text: 'Start CUI Assessment', nextStep: 'start-cui-assessment' }
      ],
      links: [
        { text: 'CUI Assessment', url: '/cui-assessment' }
      ]
    },
    'cui-mapping': {
      message: "The CUI Data Flow Mapper helps you visualize and document how CUI flows through your systems and processes. This documentation is required for NIST SP 800-171 and CMMC compliance.",
      options: [
        { id: 'back-to-cui', text: 'Back to CUI', nextStep: 'cui' },
        { id: 'try-cui-mapper', text: 'Try CUI Mapper', nextStep: 'try-cui-mapper' }
      ],
      links: [
        { text: 'CUI Data Flow Mapper', url: '/cui-mapper' }
      ]
    },
    'cui-docs': {
      message: "CyberCorrect helps you generate and manage CUI-related documentation, including System Security Plans (SSP), POA&Ms, and handling procedures required for compliance with NIST SP 800-171.",
      options: [
        { id: 'back-to-cui', text: 'Back to CUI', nextStep: 'cui' },
        { id: 'learn-more-docs', text: 'Learn More About Docs', nextStep: 'learn-more-docs' }
      ],
      links: [
        { text: 'SSP Template Guide', url: '/documentation/ssp-template-guide' },
        { text: 'CUI Handling Guide', url: '/documentation/cui-handling-guide' }
      ]
    },
    'getting-started': {
      message: "Welcome to CyberCorrect! To get started: 1) Begin with a Quick Check assessment, 2) Generate your System Security Plan, 3) Create a POA&M for any gaps, and 4) Implement continuous monitoring.",
      options: [
        { id: 'platform-tour', text: 'Platform Tour', nextStep: 'platform-tour' },
        { id: 'first-steps', text: 'First Steps', nextStep: 'first-steps' },
        { id: 'documentation', text: 'Documentation', nextStep: 'documentation' }
      ],
      links: [
        { text: 'Getting Started Guide', url: '/documentation/getting-started' },
        { text: 'Quick Start Guide', url: '/documentation/quick-start' }
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
      message: "For your first steps with CyberCorrect, I recommend: 1) Take the CMMC Quick Check to understand your baseline compliance, 2) Review the results and identify gaps, 3) Generate an initial POA&M, and 4) Explore documentation templates.",
      options: [
        { id: 'back-to-getting-started', text: 'Back to Getting Started', nextStep: 'getting-started' },
        { id: 'start-quick-check', text: 'Start Quick Check', nextStep: 'start-quick-check' }
      ],
      links: [
        { text: 'CMMC Quick Check', url: '/cmmc-quick-check' },
        { text: 'POA&M Generator', url: '/poam-generator' }
      ]
    },
    'documentation': {
      message: "CyberCorrect provides comprehensive documentation including user guides, framework explanations, implementation instructions, and compliance templates. What specifically would you like to learn about?",
      options: [
        { id: 'nist-docs', text: 'NIST Frameworks', nextStep: 'nist-docs' },
        { id: 'cmmc-docs', text: 'CMMC 2.0 Guides', nextStep: 'cmmc-docs' },
        { id: 'cui-docs-2', text: 'CUI Documentation', nextStep: 'cui-docs' }
      ],
      links: [
        { text: 'Documentation Home', url: '/documentation' },
        { text: 'FAQs', url: '/documentation/faqs' }
      ]
    },
    'assessments': {
      message: "CyberCorrect offers several assessment tools: 1) CMMC Quick Check for rapid compliance evaluation, 2) CUI Assessment for NIST SP 800-171 compliance, 3) Privacy Assessment for privacy requirements, and 4) Supply Chain Assessment for vendor risks.",
      options: [
        { id: 'cmmc-assessment-2', text: 'CMMC Assessment', nextStep: 'cmmc-assessment' },
        { id: 'cui-assessment-2', text: 'CUI Assessment', nextStep: 'cui-assessment' },
        { id: 'other-assessments', text: 'Other Assessments', nextStep: 'other-assessments' }
      ],
      links: [
        { text: 'CMMC Quick Check', url: '/cmmc-quick-check' },
        { text: 'CUI Assessment', url: '/cui-assessment' }
      ]
    },
    'other-assessments': {
      message: "In addition to CMMC and CUI assessments, CyberCorrect provides specialized assessments for Privacy Framework compliance, Supply Chain Risk Management, and Ransomware Readiness. Each assessment includes detailed recommendations.",
      options: [
        { id: 'back-to-assessments', text: 'Back to Assessments', nextStep: 'assessments' },
        { id: 'privacy', text: 'Privacy Assessment', nextStep: 'privacy' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/privacy-assessment' },
        { text: 'Assessment Guide', url: '/documentation/assessment-guide' }
      ]
    },
    'privacy': {
      message: "The Privacy Assessment evaluates your compliance with the NIST Privacy Framework. It covers Identify, Govern, Control, Communicate, and Protect functions with detailed recommendations tailored to your responses.",
      options: [
        { id: 'back-to-other-assessments', text: 'Back to Assessments', nextStep: 'other-assessments' },
        { id: 'start-privacy-assessment', text: 'Start Privacy Assessment', nextStep: 'start-privacy-assessment' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/privacy-assessment' },
        { text: 'GDPR Mapper', url: '/gdpr-mapper' }
      ]
    },
    'start-assessment': {
      message: "Great! Let's start your CMMC assessment. This will help evaluate your compliance with CMMC 2.0 requirements and identify any gaps that need addressing.",
      links: [
        { text: 'Begin CMMC Quick Check', url: '/cmmc-quick-check' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'start-cui-assessment': {
      message: "Let's begin your CUI Assessment. This comprehensive evaluation will check your compliance with NIST SP 800-171 requirements for protecting Controlled Unclassified Information.",
      links: [
        { text: 'Begin CUI Assessment', url: '/cui-assessment' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'try-cui-mapper': {
      message: "The CUI Data Flow Mapper is a powerful tool for visualizing how CUI moves through your systems. It helps you document data flows as required by NIST SP 800-171 and CMMC.",
      links: [
        { text: 'Open CUI Mapper', url: '/cui-mapper' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'try-tools': {
      message: "Our CMMC compliance tools work together to simplify your compliance journey. Start with the Quick Check for an initial assessment, then use our documentation generators and monitoring tools.",
      links: [
        { text: 'CMMC Quick Check', url: '/cmmc-quick-check' },
        { text: 'POA&M Generator', url: '/poam-generator' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
      ]
    },
    'start-quick-check': {
      message: "The CMMC Quick Check will help you quickly evaluate your CMMC 2.0 readiness with a series of straightforward questions. It takes about 5 minutes to complete.",
      links: [
        { text: 'Start CMMC Quick Check', url: '/cmmc-quick-check' }
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
    'nist-docs': {
      message: "CyberCorrect provides detailed documentation on NIST frameworks including SP 800-171 for CUI protection, the Cybersecurity Framework (CSF), and the Risk Management Framework (RMF).",
      links: [
        { text: 'NIST 800-171 Guide', url: '/documentation/nist800171-guide' },
        { text: 'Understanding RMF', url: '/documentation/understanding-rmf' }
      ],
      options: [
        { id: 'back-to-documentation', text: 'Back to Documentation', nextStep: 'documentation' }
      ]
    },
    'cmmc-docs': {
      message: "Our CMMC 2.0 documentation includes implementation guides, assessment preparation resources, and detailed explanations of requirements for each CMMC level.",
      links: [
        { text: 'CMMC 2.0 Guide', url: '/documentation/cmmc20-guide' },
        { text: 'CUI & CMMC Guide', url: '/guides/cui-cmmc' }
      ],
      options: [
        { id: 'back-to-documentation', text: 'Back to Documentation', nextStep: 'documentation' }
      ]
    },
    'learn-more-docs': {
      message: "CyberCorrect provides templates and guides for all required NIST SP 800-171 documentation, including System Security Plans, POA&Ms, and incident response procedures.",
      links: [
        { text: 'SSP Template Guide', url: '/documentation/ssp-template-guide' },
        { text: 'Documentation Home', url: '/documentation' }
      ],
      options: [
        { id: 'main-menu', text: 'Back to Main Menu', nextStep: 'welcome' }
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
    
    // Simple intent mapping based on keywords
    if (lowerText.includes('cmmc') || lowerText.includes('certification')) {
      addBotResponse('cmmc');
    } 
    else if (lowerText.includes('cui') || lowerText.includes('controlled')) {
      addBotResponse('cui');
    }
    else if (lowerText.includes('start') || lowerText.includes('begin') || lowerText.includes('new')) {
      addBotResponse('getting-started');
    }
    else if (lowerText.includes('assess') || lowerText.includes('evaluate')) {
      addBotResponse('assessments');
    }
    else if (lowerText.includes('help') || lowerText.includes('guide') || lowerText.includes('confused')) {
      addBotResponse('welcome');
    }
    else {
      // Default fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        text: "I'm not sure I understand. Could you try rephrasing or select one of these topics?",
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