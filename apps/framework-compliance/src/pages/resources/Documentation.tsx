import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { InternalLink, ContextualCTA } from '../../components/ui/InternalLinkingHelper';
import { 
  Search, 
  ArrowRight, 
  Eye,
  Database,
  ClipboardCheck,
  FileCheck,
  ArrowLeft
} from 'lucide-react';

const Documentation = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      icon: Eye,
      title: "Privacy Compliance",
      description: "GDPR, CCPA, and global privacy compliance documentation",
      articles: [
        { title: "GDPR Compliance Guide", path: "/documentation/gdpr-implementation-guide" },
        { title: "Privacy Assessment Guide", path: "/assessments/privacy-assessment" },
        { title: "Privacy by Design Implementation", path: "/guides/privacy-by-design" },
        { title: "Data Subject Rights Guide", path: "/guides/data-subject-rights" }
      ]
    },
    {
      icon: Database,
      title: "Platform & Frameworks",
      description: "Core platform docs and framework overviews",
      articles: [
        { title: "Platform Overview", path: "/documentation/platform-overview" },
        { title: "Incident Response Guide", path: "/documentation/incident-response-guide" }
      ]
    },
    {
      icon: ClipboardCheck,
      title: "Assessment Guidance",
      description: "How to use assessment tools and interpret results",
      articles: [
        { title: "Assessment Guide", path: "/documentation/assessment-guide" },
        { title: "Reading Assessment Results", path: "/documentation/assessment-guide" },
        { title: "Creating Action Plans", path: "/toolkit/privacy-gap-analyzer" },
        { title: "Quick Start Guide", path: "/documentation/quick-start" }
      ]
    },
    {
      icon: FileCheck,
      title: "Documentation Templates",
      description: "Templates for policies, procedures, and compliance documents",
      articles: [
        { title: "Control Implementation Guide", path: "/documentation/control-implementation-guide" },
        { title: "Breach Response Guide", path: "/documentation/breach-response-guide" },
        { title: "Policy Generator", path: "/toolkit/privacy-policy-generator" },
        { title: "Incident Response Guide", path: "/documentation/incident-response-guide" }
      ]
    }
  ];

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/resources-landing" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Essential guides for compliance implementation and maintenance
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              id="documentation-search"
              name="search"
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow dark:border-muted">
              <CardContent className="p-6">
                <category.icon className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-foreground">{category.title}</h2>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <Link 
                        to={article.path} 
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Navigate to first article in the category
                    if (category.articles.length > 0) {
                      navigate(category.articles[0].path);
                    }
                  }}
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Need more help?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            If you can't find what you're looking for, our support team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InternalLink href="/support" variant="button" className="px-8 py-3" showIcon>
              Contact Support
            </InternalLink>
            <InternalLink href="/assessment-hub" variant="button" className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-8 py-3" showIcon>
              Start Assessment
            </InternalLink>
          </div>
        </div>
        
        {/* Add contextual CTA */}
        <ContextualCTA currentPath="/documentation" />
      </div>
    </div>
  );
};

export default Documentation;