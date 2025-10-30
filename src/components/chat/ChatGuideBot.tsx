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
        { id: 'privacy', text: 'Privacy Compliance', nextStep: 'privacy' },
        { id: 'data-protection', text: 'Data Protection', nextStep: 'data-protection' },
        { id: 'getting-started', text: 'Getting Started', nextStep: 'getting-started' },
        { id: 'assessments', text: 'Assessment Tools', nextStep: 'assessments' }
      ]
    },
    privacy: {
      message: "Privacy compliance involves implementing comprehensive data protection controls and best practices. CyberCorrect Privacy Platform provides assessment tools, documentation generators, and continuous monitoring for privacy compliance.",
      options: [
        { id: 'privacy-frameworks', text: 'Privacy Frameworks', nextStep: 'privacy-frameworks' },
        { id: 'privacy-tools', text: 'Privacy Tools', nextStep: 'privacy-tools' },
        { id: 'privacy-assessment', text: 'Privacy Assessment', nextStep: 'privacy-assessment' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'Privacy Framework Guide', url: '/documentation/privacy-framework-guide' }
      ]
    },
    'privacy-frameworks': {
      message: "Privacy frameworks provide structured approaches to implementing data protection controls. Common frameworks include GDPR, CCPA, NIST Privacy Framework, and ISO 27701, each with specific controls and requirements for different privacy needs.",
      options: [
        { id: 'back-to-privacy', text: 'Back to Privacy', nextStep: 'privacy' },
        { id: 'privacy-tools', text: 'Privacy Tools', nextStep: 'privacy-tools' }
      ]
    },
    'privacy-tools': {
      message: "CyberCorrect Privacy Platform provides comprehensive tools for privacy compliance: 1) Privacy assessment for initial evaluation, 2) Documentation generators for policies and procedures, 3) Gap analysis for remediation planning, and 4) Continuous monitoring dashboards.",
      options: [
        { id: 'back-to-privacy', text: 'Back to Privacy', nextStep: 'privacy' },
        { id: 'try-tools', text: 'Try Privacy Tools', nextStep: 'try-tools' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' },
        { text: 'DPIA Generator', url: '/toolkit/dpia-generator' }
      ]
    },
    'privacy-assessment': {
      message: "CyberCorrect Privacy Platform's privacy assessment tools help you evaluate your compliance with privacy frameworks and data protection requirements. Our assessments provide comprehensive evaluations with actionable recommendations.",
      options: [
        { id: 'back-to-privacy', text: 'Back to Privacy', nextStep: 'privacy' },
        { id: 'start-assessment', text: 'Start Assessment', nextStep: 'start-assessment' }
      ],
      links: [
        { text: 'Privacy Assessment', url: '/assessments/privacy-assessment' }
      ]
    },
    'data-protection': {
      message: "Data protection involves implementing comprehensive measures to safeguard personal data according to privacy regulations. CyberCorrect helps you identify, map, and protect personal data in compliance with GDPR, CCPA, and other privacy laws.",
      options: [
        { id: 'data-mapping', text: 'Data Mapping', nextStep: 'data-mapping' },
        { id: 'data-subject-rights', text: 'Data Subject Rights', nextStep: 'data-subject-rights' },
        { id: 'data-docs', text: 'Data Protection Documentation', nextStep: 'data-docs' }
      ],
      links: [
        { text: 'GDPR Mapper', url: '/toolkit/gdpr-mapper' },
        { text: 'Privacy Rights Manager', url: '/toolkit/privacy-rights-manager' }
      ]
    },
    'data-mapping': {
      message: "Data mapping helps you understand how personal data flows through your organization. This is essential for GDPR compliance and helps identify privacy risks and compliance gaps.",
      options: [
        { id: 'back-to-data-protection', text: 'Back to Data Protection', nextStep: 'data-protection' },
        { id: 'start-data-mapping', text: 'Start Data Mapping', nextStep: 'start-data-mapping' }
      ],
      links: [
        { text: 'GDPR Mapper', url: '/toolkit/gdpr-mapper' }
      ]
    },
    'data-subject-rights': {
      message: "Data subject rights management helps you handle requests from individuals about their personal data. This includes access, rectification, erasure, and portability requests under GDPR.",
      options: [
        { id: 'back-to-data-protection', text: 'Back to Data Protection', nextStep: 'data-protection' },
        { id: 'try-rights-manager', text: 'Try Rights Manager', nextStep: 'try-rights-manager' }
      ],
      links: [
        { text: 'Privacy Rights Manager', url: '/toolkit/privacy-rights-manager' }
      ]
    },
    'data-docs': {
      message: "CyberCorrect helps you generate and manage privacy-related documentation, including Privacy Impact Assessments (PIA), Data Processing Records, and privacy policies required for compliance with GDPR, CCPA, and other privacy regulations.",
      options: [
        { id: 'back-to-data-protection', text: 'Back to Data Protection', nextStep: 'data-protection' },
        { id: 'learn-more-docs', text: 'Learn More About Docs', nextStep: 'learn-more-docs' }
      ],
      links: [
        { text: 'DPIA Generator', url: '/toolkit/dpia-generator' },
        { text: 'Privacy Policy Generator', url: '/toolkit/privacy-policy-generator' }
      ]
    },
    'getting-started': {
      message: "Welcome to CyberCorrect Privacy Platform! To get started: 1) Take the Privacy Assessment, 2) Review results and recommendations, 3) Use our tools to close gaps, and 4) Explore documentation.",
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
      message: "CyberCorrect provides privacy-focused assessment tools: a Privacy Assessment with tailored recommendations and planning tools to close gaps.",
      options: [
        { id: 'privacy-assessment-2', text: 'Privacy Assessment', nextStep: 'privacy-assessment' }
      ],
      links: [
        { text: 'Start Privacy Assessment', url: '/assessments/privacy-assessment' }
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
    
    // Simple intent mapping based on keywords
    if (lowerText.includes('security') || lowerText.includes('certification')) {
      addBotResponse('privacy');
    } 
    else if (lowerText.includes('cui') || lowerText.includes('controlled')) {
      addBotResponse('privacy');
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