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
  Clock,
  Shield,
  Database,
  Key
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
    },
    {
      id: 'pricing',
      name: 'Pricing & Plans',
      icon: Users
    }
  ];

  const [activeCategory, setActiveCategory] = React.useState('general');

  const faqs = [
    {
      question: "What is CyberCorrect Privacy Platform?",
      answer: "CyberCorrect Privacy Platform is a comprehensive privacy compliance platform designed to help organizations achieve and maintain compliance with global privacy regulations including GDPR, CCPA, LGPD, PIPEDA, and the NIST Privacy Framework. Our platform simplifies the privacy compliance journey with assessment tools, DPIA generators, policy creation, and continuous monitoring capabilities.",
      category: 'general'
    },
    {
      question: "How does CyberCorrect Privacy Platform help with GDPR compliance?",
      answer: "CyberCorrect Privacy Platform provides tools for GDPR assessment, gap analysis, Data Protection Impact Assessments (DPIAs), automated data subject rights management, privacy policy generation, and data mapping. Our platform helps you understand GDPR requirements and implement them efficiently with guided workflows and audit-ready documentation.",
      category: 'general'
    },
    {
      question: "What are the steps to get started with CyberCorrect Privacy Platform?",
      answer: "Getting started is easy: 1) Sign up for your account, 2) Complete the privacy assessment to identify your current privacy posture, 3) Review your personalized privacy roadmap, 4) Use our tools to implement privacy controls and documentation, 5) Generate required privacy policies and notices, and 6) Implement continuous privacy monitoring.",
      category: 'general'
    },
    {
      question: "Is CyberCorrect Privacy Platform suitable for small businesses?",
      answer: "Yes, CyberCorrect Privacy Platform is designed to scale with your business size. Our platform offers tiered plans to accommodate small businesses with limited resources, while still providing the essential tools needed for privacy compliance with regulations like GDPR, CCPA, and other privacy laws applicable to your operations.",
      category: 'general'
    },
    {
      question: "How secure is my data in CyberCorrect Privacy Platform?",
      answer: "CyberCorrect Privacy Platform implements robust security measures including data encryption at rest and in transit, multi-factor authentication, role-based access controls, regular security testing, and compliance with SOC 2 standards. We follow security best practices and privacy-by-design principles to ensure your sensitive privacy data remains protected.",
      category: 'security'
    },
    {
      question: "Can CyberCorrect Privacy Platform help with multiple privacy regulations?",
      answer: "Yes, CyberCorrect Privacy Platform supports multiple privacy regulations including GDPR (EU), CCPA/CPRA (California), LGPD (Brazil), PIPEDA (Canada), POPIA (South Africa), and the NIST Privacy Framework. Our platform provides control mapping capabilities to help you efficiently manage privacy compliance across overlapping requirements.",
      category: 'security'
    },
    {
      question: "How does the GDPR Mapper tool work?",
      answer: "The GDPR Mapper tool allows you to map your data processing activities to GDPR requirements and NIST Privacy Framework controls. You can document data flows, identify lawful bases for processing, assess privacy risks, and generate Records of Processing Activities (Article 30) that satisfy GDPR compliance requirements.",
      category: 'data'
    },
    {
      question: "What documentation can CyberCorrect Privacy Platform generate?",
      answer: "CyberCorrect Privacy Platform can help generate several key privacy documents including Privacy Policies, Privacy Notices, Data Protection Impact Assessments (DPIAs), Records of Processing Activities (ROPA), Data Subject Rights Request procedures, Breach Notification templates, and Data Processing Agreements (DPAs).",
      category: 'documents'
    },
    {
      question: "How often should I reassess my privacy compliance?",
      answer: "We recommend reassessing your privacy compliance annually or when significant changes occur in your data processing activities. CyberCorrect Privacy Platform's continuous monitoring tools help you maintain awareness of your privacy compliance status between formal assessments, alerting you to potential issues before they impact your compliance.",
      category: 'security'
    },
    {
      question: "How do I manage user access in CyberCorrect Privacy Platform?",
      answer: "CyberCorrect Privacy Platform offers comprehensive user management capabilities. Administrators can create user accounts, assign role-based permissions (Data Protection Officer, Privacy Officer, Legal Counsel, Data Steward), enforce multi-factor authentication, set password policies, and monitor user activity. User access can be tailored to specific modules based on privacy roles.",
      category: 'access'
    },
    {
      question: "Is training available for CyberCorrect Privacy Platform users?",
      answer: "Yes, CyberCorrect Privacy Platform provides multiple training options including comprehensive documentation, regular webinars on privacy topics, and personalized training sessions for enterprise customers. Our Support Center contains a comprehensive knowledge base to help you maximize platform value and understand privacy compliance.",
      category: 'general'
    },
    {
      question: "Can I use CyberCorrect Privacy Platform for privacy evidence collection?",
      answer: "Yes, CyberCorrect Privacy Platform includes an evidence vault system that allows you to collect, organize, and store evidence of privacy compliance implementation. You can attach files, screenshots, documents, and other artifacts to specific privacy controls, making it easier to demonstrate compliance during privacy audits or regulatory investigations.",
      category: 'documents'
    },
    {
      question: "How can I see the platform in action?",
      answer: "You can explore our interactive demo to see all features and capabilities. The demo gives you hands-on experience with our privacy assessment tools, data mapping, and compliance workflows.",
      category: 'pricing'
    },
    {
      question: "How does the annual discount work?",
      answer: "Annual plans are billed once per year and include a 20% discount compared to monthly billing. You can switch between billing periods at any time before your renewal date. All annual plans also include additional benefits like extended support hours and priority feature requests.",
      category: 'pricing'
    },
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade, downgrade or cancel your subscription at any time. Upgrades take effect immediately, while downgrades or cancellations take effect at the end of your current billing cycle.",
      category: 'pricing'
    },
    {
      question: "How long does compliance certification take?",
      answer: "The timeline varies depending on your organization's size and current privacy posture. With CyberCorrect Privacy Platform, most small-to-medium businesses can achieve GDPR readiness in 4-6 weeks, and comprehensive multi-regulation privacy compliance in 3-6 months. Our platform accelerates this process by automating privacy documentation and gap analysis.",
      category: 'pricing'
    },
    {
      question: "Do you provide implementation support?",
      answer: "Yes. Professional plans include quarterly review sessions, while Enterprise plans include dedicated compliance specialists to guide your implementation process with a structured 30-60-90 day plan. We also offer implementation workshops and technical configuration guidance for all customers.",
      category: 'pricing'
    },
    {
      question: "What if I need additional users?",
      answer: "You can add additional users to your plan at any time. User pricing is prorated based on your billing cycle, and volume discounts are available for organizations with more than 50 users.",
      category: 'pricing'
    },
    {
      question: "Can I export my data and documentation?",
      answer: "Yes, all documentation generated in CyberCorrect Privacy Platform can be exported in standard formats (PDF, Word, Excel) that are accepted by privacy auditors and regulators. Our templates are designed to meet GDPR, CCPA, and other privacy regulation requirements and have been reviewed by privacy professionals.",
      category: 'pricing'
    },
    {
      question: "Is my data secure with CyberCorrect Privacy Platform?",
      answer: "Absolutely. We maintain SOC 2 Type II compliance and implement comprehensive security controls including encryption in transit and at rest, multi-factor authentication, regular penetration testing, and role-based access control to ensure your security and compliance data remains protected.",
      category: 'pricing'
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
            Find answers to common questions about CyberCorrect Privacy Platform and privacy compliance management
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
            Our support team is ready to help you with any questions you might have about CyberCorrect Privacy Platform.
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