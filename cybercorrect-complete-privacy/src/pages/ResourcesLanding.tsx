import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  HelpCircle, 
  ArrowRight, 
  Eye, 
  Database,
  Users,
  Search
} from 'lucide-react';

const ResourcesLanding = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Essential resource categories aligned with compliance paths
  const resourceCategories = [
    {
      id: 'privacy-resources',
      title: 'Privacy Compliance',
      category: 'Privacy',
      description: 'GDPR, CCPA, and global privacy compliance resources',
      icon: Eye,
      path: '/documentation',
      items: [
        { title: 'GDPR Compliance Guide', path: '/documentation/gdpr-implementation-guide' },
        { title: 'Privacy Assessment', path: '/assessments/privacy-assessment' },
        { title: 'Privacy Framework Guide', path: '/documentation/privacy-framework-guide' }
      ]
    },
    {
      id: 'platform-docs',
      title: 'Platform & Frameworks',
      category: 'Documentation',
      description: 'Core platform docs and framework overviews',
      icon: Database,
      path: '/documentation',
      items: [
        { title: 'Platform Overview', path: '/documentation/platform-overview' },
        { title: 'Incident Response Guide', path: '/documentation/incident-response-guide' },
        { title: 'Tutorials', path: '/documentation/tutorials' }
      ]
    },
    {
      id: 'support',
      title: 'Support & Help',
      category: 'Support',
      description: 'Get help from our compliance experts',
      icon: HelpCircle,
      path: '/support',
      items: [
        { title: 'FAQs', path: '/documentation/faqs' },
        { title: 'Live Chat Support', path: '/support/chat' },
        { title: 'Contact Us', path: '/support' }
      ]
    }
  ];

  // Featured resources
  const featuredResources = [
    {
      id: 'privacy-assessment',
      title: 'Privacy Assessment',
      description: 'Start your privacy compliance journey',
      type: 'Assessment',
      icon: Eye,
      path: '/assessments/privacy-assessment',
      featured: true,
      category: 'Privacy'
    },
    {
      id: 'privacy-evaluation',
      title: 'Privacy Evaluation', 
      description: 'Evaluate your privacy protection practices',
      type: 'Assessment',
      icon: Database,
      path: '/assessments/privacy-assessment',
      featured: true,
      category: 'Privacy'
    }
  ];

  return (
    <div>
      {/* Compact Page Header */}
      <section className="py-8 border-b border-border bg-surface dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Resources Center</h1>
            <p className="text-muted-foreground mt-2">Essential documentation, guides, and support resources for your compliance journey</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              id="resource-search"
              name="search"
              placeholder="Search documentation and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-support-gray dark:border-dark-support rounded-lg bg-surface dark:bg-dark-surface text-foreground dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <h2 className="section-title">Start Here</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredResources.map((resource) => (
              <Card key={resource.id} className="relative overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-0 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3">
                      <resource.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{resource.title}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm">{resource.description}</p>
                  
                  <Link to={resource.path}>
                    <Button variant="default" className="w-full enhanced-button">
                      Start {resource.type}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resource Categories */}
        <div className="mb-12">
          <h2 className="section-title">Essential Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourceCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-3">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm">{category.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {category.items.map((item, index) => (
                      <li key={index}>
                        <Link to={item.path} className="text-primary hover:text-primary/80 text-sm flex items-center">
                          <ArrowRight className="h-3 w-3 mr-2" />
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={category.path}>
                    <Button variant="outline" className="w-full hover:-translate-y-1 hover:bg-primary hover:text-white transition-all duration-300 py-3 font-semibold">
                      View All {category.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="p-12 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-dark-primary dark:to-dark-primary rounded-xl shadow-xl text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/4 flex justify-center">
              <Users className="h-16 w-16 text-white" />
            </div>
            <div className="md:w-3/4">
              <h3 className="text-2xl font-bold mb-4 text-white">Need Help Getting Started?</h3>
              <p className="text-white/90 mb-4">
                Our compliance experts are available to provide personalized guidance for your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/assessment-hub">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 enhanced-button px-6 py-3">
                    Start Assessment
                  </Button>
                </Link>
                <Link to="/support">
                  <Button variant="outline" className="text-white border-white hover:bg-white/10 px-6 py-3">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesLanding;