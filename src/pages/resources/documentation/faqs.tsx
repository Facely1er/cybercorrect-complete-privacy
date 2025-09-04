import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Search,
  Users,
  Clock
} from 'lucide-react';

const Faqs = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(0);
  const [searchQuery, setSearchQuery] = React.useState('');

  const faqCategories = [
    {
      id: 'general',
      name: 'General',
      icon: HelpCircle
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      icon: Shield
    },
    {
      id: 'data',
      name: 'Data Handling',
      icon: Database
    },
    {
      id: 'access',
      name: 'Account & Access',
      icon: Key
    },
    {
      id: 'documents',
      name: 'Documentation',
      icon: FileText
    }
  ];

  const [activeCategory, setActiveCategory] = React.useState('general');

  const faqs = [
    {
      question: "What is CyberCorrect?",
      answer: "CyberCorrect is a comprehensive compliance management platform designed to help organizations achieve and maintain compliance with various cybersecurity frameworks including CMMC 2.0, NIST 800-171, and other regulatory requirements. Our platform simplifies the compliance journey with assessment tools, documentation generators, and continuous monitoring capabilities.",
      category: 'general'
    },
    {
      question: "How does CyberCorrect help with CMMC 2.0 compliance?",
      answer: "CyberCorrect provides tools for CMMC 2.0 self-assessment, gap analysis, documentation generation (including System Security Plans and POA&Ms), and continuous monitoring. Our platform maps requirements across multiple frameworks, helping you understand exactly what's needed for compliance and how to achieve it efficiently.",
      category: 'general'
    },
    {
      question: "What are the steps to get started with CyberCorrect?",
      answer: "Getting started is easy: 1) Sign up for a free trial or subscription, 2) Complete a quick initial assessment to identify your compliance needs, 3) Import or create your compliance documentation, 4) Use our tools to identify and address gaps, 5) Generate required documentation, and 6) Implement continuous monitoring.",
      category: 'general'
    },
    {
      question: "Is CyberCorrect suitable for small businesses?",
      answer: "Yes, CyberCorrect is designed to scale with your business size. Our platform offers tiered plans to accommodate small businesses with limited resources, while still providing the essential tools needed for compliance with frameworks like CMMC 2.0 Level 1 or basic NIST 800-171 requirements.",
      category: 'general'
    },
    {
      question: "How secure is my data in CyberCorrect?",
      answer: "CyberCorrect implements robust security measures including data encryption at rest and in transit, multi-factor authentication, role-based access controls, regular security testing, and compliance with SOC 2 standards. We follow security best practices to ensure your sensitive compliance data remains protected.",
      category: 'security'
    },
    {
      question: "Can CyberCorrect help with multiple compliance frameworks?",
      answer: "Yes, CyberCorrect supports multiple compliance frameworks including CMMC 2.0, NIST 800-171, NIST CSF, ISO 27001, HIPAA, and others. Our platform provides control mapping capabilities to help you efficiently manage compliance across overlapping requirements.",
      category: 'security'
    },
    {
      question: "How does the CUI Mapper tool work?",
      answer: "The CUI Mapper tool allows you to visually document how Controlled Unclassified Information (CUI) flows through your systems and processes. You can create interactive diagrams showing data flows, identify protection requirements, and generate documentation that helps satisfy NIST 800-171 and CMMC 2.0 requirements for CUI handling.",
      category: 'data'
    },
    {
      question: "What documentation can CyberCorrect generate?",
      answer: "CyberCorrect can help generate several key compliance documents including System Security Plans (SSPs), Plans of Action & Milestones (POA&Ms), security policies and procedures, risk assessment reports, CUI flow diagrams, and evidence records for audits and assessments.",
      category: 'documents'
    },
    {
      question: "How often should I reassess my compliance?",
      answer: "We recommend reassessing your compliance quarterly or when significant changes occur in your environment. CyberCorrect's continuous monitoring tools help you maintain awareness of your compliance status between formal reassessments, alerting you to potential issues before they impact your compliance status.",
      category: 'security'
    },
    {
      question: "How do I manage user access in CyberCorrect?",
      answer: "CyberCorrect offers comprehensive user management capabilities. Administrators can create user accounts, assign role-based permissions, enforce multi-factor authentication, set password policies, and monitor user activity. User access can be tailored to specific modules or data based on job responsibilities.",
      category: 'access'
    },
    {
      question: "Is training available for CyberCorrect users?",
      answer: "Yes, CyberCorrect provides multiple training options including on-demand video tutorials, documentation, regular webinars, and personalized training sessions for enterprise customers. Our Support Center also contains a comprehensive knowledge base to help you maximize platform value.",
      category: 'general'
    },
    {
      question: "Can I use CyberCorrect for evidence collection?",
      answer: "Yes, CyberCorrect includes an evidence management system that allows you to collect, organize, and store evidence of compliance implementation. You can attach files, screenshots, documents, and other artifacts to specific controls, making it easier to demonstrate compliance during assessments or audits.",
      category: 'documents'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) && 
    (searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Button 
          variant="outline" 
          className="mb-8"
          onClick={() => navigate('/documentation')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documentation
        </Button>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about CyberCorrect and compliance management
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Button 
            variant={activeCategory === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setActiveCategory('all')}
            className="min-w-24"
          >
            All
          </Button>
          {faqCategories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="min-w-24"
            >
              <category.icon className="mr-2 h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <CardContent className="px-4 pt-0 pb-4">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                We couldn't find any FAQs matching your search. Try different keywords or browse categories.
              </p>
            </div>
          )}
        </div>

        {/* Still have questions section */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is ready to help you with any questions you might have about CyberCorrect.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => navigate('/support')}>
              <Users className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" onClick={() => navigate('/documentation')}>
              <FileText className="mr-2 h-4 w-4" />
              Browse Documentation
            </Button>
            <Button variant="outline" onClick={() => navigate('/demo')}>
              <Clock className="mr-2 h-4 w-4" />
              Request a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;