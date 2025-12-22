import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useChatbot } from '../components/chat/ChatbotProvider';
import { 
  ArrowRight, 
  FileText, 
  BookOpen,
  Shield,
  AlertTriangle,
  Eye,
  Database,
  ChevronDown,
  ChevronUp,
  Mail,
  Bot,
  HelpCircle,
  Search,
  Key
} from 'lucide-react';

const ResourcesLanding = () => {
  const { openChatbot } = useChatbot();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // All documentation and guides combined
  const resourceCategories = [
    {
      id: 'privacy',
      title: 'Privacy Compliance',
      icon: Eye,
      description: 'GDPR, CCPA, and privacy framework documentation',
      items: [
        { title: 'GDPR Implementation Guide', path: '/documentation/gdpr-implementation-guide' },
        { title: 'Privacy Framework Guide', path: '/documentation/privacy-framework-guide' }
      ]
    },
    {
      id: 'platform',
      title: 'Platform Documentation',
      icon: Database,
      description: 'Platform guides and assessment documentation',
      items: [
        { title: 'Platform Overview', path: '/documentation/platform-overview' },
        { title: 'Assessment Guide', path: '/documentation/assessment-guide' }
      ]
    },
    {
      id: 'incident',
      title: 'Incident & Breach',
      icon: AlertTriangle,
      description: 'Response procedures and notification requirements',
      items: [
        { title: 'Incident Response Guide', path: '/guides/incident-breach' },
        { title: 'Breach Notification', path: '/guides/incident-breach#notification' }
      ]
    },
    {
      id: 'templates',
      title: 'Templates & Tools',
      icon: FileText,
      description: 'Policies, procedures, and compliance templates',
      items: [
        { title: 'Policy Generator', path: '/toolkit/privacy-policy-generator' },
        { title: 'DPIA Template', path: '/toolkit/dpia-generator' }
      ]
    }
  ];

  // FAQ categories for filtering
  const faqCategories = [
    { id: 'all', name: 'All', icon: HelpCircle },
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data', icon: Database },
    { id: 'access', name: 'Access', icon: Key }
  ];

  // FAQs embedded directly
  const faqs = [
    {
      question: 'What is CyberCorrect Privacy Platform?',
      answer: 'CyberCorrect Privacy Platform is a comprehensive privacy compliance platform designed to help organizations achieve and maintain compliance with global privacy regulations including GDPR, CCPA, LGPD, PIPEDA, and the NIST Privacy Framework.',
      category: 'general'
    },
    {
      question: 'How do I start a privacy assessment?',
      answer: 'Navigate to the Assessment page from the main menu, then click "Start Privacy Assessment". The assessment takes 30-45 minutes and covers all NIST Privacy Framework domains.',
      category: 'general'
    },
    {
      question: 'What frameworks does CyberCorrect support?',
      answer: 'CyberCorrect supports NIST Privacy Framework, GDPR, CCPA/CPRA, LGPD, PIPEDA, and provides cross-framework mapping capabilities for comprehensive compliance management.',
      category: 'general'
    },
    {
      question: 'How secure is my data in CyberCorrect?',
      answer: 'CyberCorrect implements robust security measures including data encryption at rest and in transit, multi-factor authentication, role-based access controls, regular security testing, and compliance with SOC 2 standards.',
      category: 'security'
    },
    {
      question: 'How does the GDPR Mapper tool work?',
      answer: 'The GDPR Mapper tool allows you to map your data processing activities to GDPR requirements and NIST Privacy Framework controls. You can document data flows, identify lawful bases for processing, and generate Records of Processing Activities.',
      category: 'data'
    },
    {
      question: 'How do I manage user access?',
      answer: 'Administrators can create user accounts, assign role-based permissions (Data Protection Officer, Privacy Officer, Legal Counsel, Data Steward), enforce multi-factor authentication, set password policies, and monitor user activity.',
      category: 'access'
    },
    {
      question: 'How do I handle a data breach?',
      answer: 'Refer to our Incident & Breach Management guide for step-by-step response procedures, notification timelines (72 hours for GDPR), and regulatory reporting requirements across global regulations.',
      category: 'security'
    },
    {
      question: 'Can I export my compliance documentation?',
      answer: 'Yes, all documentation generated in CyberCorrect can be exported in standard formats (PDF, Word, Excel) that are accepted by privacy auditors and regulators.',
      category: 'data'
    }
  ];

  // Filter FAQs based on category and search
  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) && 
    (searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      {/* Page Header */}
      <section className="py-8 border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Docs & Guides</h1>
            <p className="text-base md:text-lg text-foreground/80 dark:text-foreground/70 mt-2">Documentation, guides, FAQs, and help for your privacy compliance journey</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Quick Access */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Popular Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'GDPR Guide', icon: Shield, path: '/documentation/gdpr-implementation-guide' },
              { title: 'Privacy Framework', icon: Eye, path: '/documentation/privacy-framework-guide' },
              { title: 'Incident Response', icon: AlertTriangle, path: '/guides/incident-breach' },
              { title: 'Platform Overview', icon: BookOpen, path: '/documentation/platform-overview' }
            ].map((item) => (
              <Link key={item.title} to={item.path}>
                <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground dark:text-foreground">{item.title}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Documentation & Guides */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Documentation & Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resourceCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                      <p className="text-sm text-foreground/80 dark:text-foreground/70">{category.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx}>
                        <Link to={item.path} className="text-sm text-primary hover:underline flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 dark:placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {faqCategories.map(cat => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div key={index}>
                    <button
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    >
                      <span className="font-medium text-foreground pr-4">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-4 text-foreground/80 dark:text-foreground/70 text-sm">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <HelpCircle className="h-10 w-10 mx-auto text-foreground/60 dark:text-foreground/50 mb-3" />
                  <p className="text-foreground/80 dark:text-foreground/70">No FAQs found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Help Options */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Bot className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Guide Bot</h3>
                <p className="text-sm text-foreground/80 dark:text-foreground/70 mb-4">Get instant answers 24/7</p>
                <Button variant="outline" className="w-full" onClick={() => openChatbot()}>
                  Launch Guide
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Email Support</h3>
                <p className="text-sm text-foreground/80 dark:text-foreground/70 mb-4">Response within 24 hours</p>
                <a href="mailto:support@cybercorrect.com" className="w-full">
                  <Button variant="outline" className="w-full">Send Email</Button>
                </a>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <HelpCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Contact Us</h3>
                <p className="text-sm text-foreground/80 dark:text-foreground/70 mb-4">Detailed inquiries & sales</p>
                <Link to="/contact" className="w-full">
                  <Button variant="outline" className="w-full">Contact Form</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResourcesLanding;

