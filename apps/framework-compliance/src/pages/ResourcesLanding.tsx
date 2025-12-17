import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  BookOpen,
  Users,
  Shield,
  AlertTriangle,
  Scale
} from 'lucide-react';

const ResourcesLanding = () => {
  // Documentation and guides - the core purpose of this page
  const documentationCategories = [
    {
      id: 'guides',
      title: 'Implementation Guides',
      description: 'Step-by-step guides for privacy compliance implementation',
      icon: BookOpen,
      path: '/guides',
      items: [
        { title: 'GDPR Implementation Guide', path: '/documentation/gdpr-implementation-guide' },
        { title: 'Privacy Framework Guide', path: '/documentation/privacy-framework-guide' },
        { title: 'Data Subject Rights Guide', path: '/guides/data-subject-rights' }
      ]
    },
    {
      id: 'docs',
      title: 'Documentation',
      description: 'Platform documentation and reference materials',
      icon: FileText,
      path: '/documentation',
      items: [
        { title: 'Platform Overview', path: '/documentation/platform-overview' },
        { title: 'FAQs', path: '/documentation/faqs' },
        { title: 'Assessment Guide', path: '/documentation/assessment-guide' }
      ]
    },
    {
      id: 'incident',
      title: 'Incident & Breach',
      description: 'Response procedures and notification requirements',
      icon: AlertTriangle,
      path: '/guides/incident-breach',
      items: [
        { title: 'Incident Response Guide', path: '/guides/incident-breach' },
        { title: 'Breach Notification Requirements', path: '/guides/incident-breach#notification' }
      ]
    }
  ];

  // Quick access cards for key resources
  const quickAccessResources = [
    {
      id: 'gdpr',
      title: 'GDPR Compliance',
      description: 'Complete guide to EU data protection compliance',
      icon: Shield,
      path: '/documentation/gdpr-implementation-guide'
    },
    {
      id: 'dsr',
      title: 'Data Subject Rights',
      description: 'Managing privacy rights requests',
      icon: Users,
      path: '/guides/data-subject-rights'
    },
    {
      id: 'legal',
      title: 'Legal Basis Guide',
      description: 'Understanding lawful processing grounds',
      icon: Scale,
      path: '/documentation/privacy-framework-guide'
    }
  ];

  return (
    <div>
      {/* Compact Page Header */}
      <section className="py-8 border-b border-border bg-surface dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Resources</h1>
            <p className="text-muted-foreground mt-2">Documentation, guides, and support for your privacy compliance journey</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Access Cards */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickAccessResources.map((resource) => (
              <Link key={resource.id} to={resource.path}>
                <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-0 shadow-md h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <resource.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Documentation Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documentationCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-3">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm">{category.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {category.items.map((item, index) => (
                      <li key={index}>
                        <Link to={item.path} className="text-primary hover:text-primary/80 text-sm flex items-center">
                          <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={category.path}>
                    <Button variant="outline" size="sm" className="w-full">
                      View All
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <Card className="border-0 shadow-lg bg-muted/30 dark:bg-muted/10">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2 text-foreground">Need Help?</h3>
                <p className="text-muted-foreground mb-4">
                  Our support team is available to help with your compliance questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link to="/support">
                    <Button variant="default">
                      Contact Support
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/documentation/faqs">
                    <Button variant="outline">
                      View FAQs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesLanding;