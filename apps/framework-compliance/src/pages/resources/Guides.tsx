import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  ArrowLeft,
  Eye,
  Database,
  FileCheck,
  Users,
  Shield,
  FileText,
  AlertTriangle
} from 'lucide-react';

const Guides = () => {
  const guides = [
    // Privacy Compliance Guides
    {
      title: 'Privacy Framework Guide',
      description: 'Comprehensive guide to implementing NIST Privacy Framework and global privacy regulations.',
      icon: Eye,
      category: 'Privacy Compliance',
      link: '/documentation/privacy-framework-guide'
    },
    {
      title: 'Data Protection Guide',
      description: 'Best practices for protecting personal data and ensuring data security.',
      icon: Shield,
      category: 'Privacy Compliance',
      link: '/guides/data-protection'
    },
    {
      title: 'Privacy by Design',
      description: 'Implement privacy by design principles in your systems and processes.',
      icon: Database,
      category: 'Privacy Compliance',
      link: '/guides/privacy-by-design'
    },
    {
      title: 'Data Subject Rights',
      description: 'Handle data subject access requests and privacy rights management.',
      icon: Users,
      category: 'Privacy Compliance',
      link: '/guides/data-subject-rights'
    },
    // Security Management Guides
    {
      title: 'Incident Response Planning',
      description: 'Create effective incident response procedures for security and privacy events.',
      icon: FileCheck,
      category: 'Security Management',
      link: '/documentation/incident-response-guide'
    },
    {
      title: 'Breach Notification Guide',
      description: 'Step-by-step guidance for handling and reporting data breaches.',
      icon: AlertTriangle,
      category: 'Security Management',
      link: '/guides/breach-notification'
    },
    {
      title: 'Privacy Impact Assessment',
      description: 'Conduct thorough privacy impact assessments for new projects.',
      icon: FileText,
      category: 'Security Management',
      link: '/guides/privacy-impact-assessment'
    }
  ];

  // Group guides by category
  const groupedGuides = guides.reduce((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = [];
    }
    acc[guide.category].push(guide);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
        <Link to="/resources" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Implementation Guides</h1>
          <p className="text-muted-foreground mb-6">Step-by-step guides for implementing compliance requirements</p>
        </div>
        
        <div className="space-y-12">
          {Object.entries(groupedGuides).map(([category, categoryGuides]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-6 text-foreground">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryGuides.map((guide) => (
                  <Card key={guide.title} className="hover:shadow-lg transition-shadow border dark:border-muted">
                    <CardContent className="p-6">
                      <div className="p-3 rounded-lg bg-primary/10 inline-flex mb-4">
                        <guide.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{guide.title}</h3>
                      <p className="text-muted-foreground mb-6">{guide.description}</p>
                      <Link to={guide.link}>
                        <Button variant="outline" className="w-full">
                          Read Guide
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Getting Started */}
        <div className="mt-12 p-6 bg-muted/30 dark:bg-muted/10 rounded-lg">
          <div className="text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-foreground">Start Your Journey</h3>
            <p className="text-muted-foreground mb-4">
              Begin with an assessment to understand which guides you need
            </p>
            <Link to="/assessment-hub">
              <Button size="lg">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    
  );
};

export default Guides;