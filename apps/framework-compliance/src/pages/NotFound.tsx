import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { InternalLink } from '../components/ui/InternalLinkingHelper';
import { AlertTriangle, ArrowLeft, Home, Search, Compass, Wrench, HelpCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to toolkit with search query or home page
      navigate(`/toolkit?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const suggestedRoutes = [
    { path: '/assessments/privacy-assessment', label: 'Privacy Assessment', description: 'Evaluate your privacy compliance' },
    { path: '/toolkit/gdpr-mapper', label: 'GDPR Data Mapper', description: 'Map personal data processing' },
    { path: '/toolkit/dpia-generator', label: 'DPIA Generator', description: 'Create data protection impact assessments' },
    { path: '/toolkit/privacy-gap-analyzer', label: 'Privacy Gap Analyzer', description: 'Identify compliance gaps' },
    { path: '/toolkit/privacy-rights-manager', label: 'Privacy Rights Manager', description: 'Manage data subject requests' },
    { path: '/pricing', label: 'Pricing', description: 'View membership plans' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warning/10 mb-6">
          <AlertTriangle className="w-12 h-12 text-warning" />
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">404 - Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-2 max-w-2xl mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          You tried to access: <code className="px-2 py-1 bg-muted rounded text-xs">{location.pathname}</code>
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search for tools, assessments, or features..."
            />
          </div>
        </form>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button onClick={() => navigate(-1)} size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} size="lg">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
        
        {/* Suggested Routes */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Popular Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedRoutes.map((route) => (
              <InternalLink
                key={route.path}
                href={route.path}
                className="block p-4 bg-card border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                  {route.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {route.description}
                </div>
              </InternalLink>
            ))}
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Compass className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-medium mb-2 text-foreground">Explore Tools</h3>
            <ul className="text-sm space-y-1">
              <li>
                <InternalLink href="/toolkit" variant="subtle">
                  Toolkit Hub
                </InternalLink>
              </li>
              <li>
                <InternalLink href="/assessments/privacy-assessment" variant="subtle">
                  Privacy Assessment
                </InternalLink>
              </li>
              <li>
                <InternalLink href="/features" variant="subtle">
                  Features
                </InternalLink>
              </li>
            </ul>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Wrench className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-medium mb-2 text-foreground">Quick Actions</h3>
            <ul className="text-sm space-y-1">
              <li>
                <InternalLink href="/toolkit/gdpr-mapper" variant="subtle">
                  Data Mapping
                </InternalLink>
              </li>
              <li>
                <InternalLink href="/toolkit/dpia-generator" variant="subtle">
                  DPIA Generator
                </InternalLink>
              </li>
              <li>
                <InternalLink href="/pricing" variant="subtle">
                  View Pricing
                </InternalLink>
              </li>
            </ul>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <HelpCircle className="h-6 w-6 text-primary mx-auto mb-2" />
            <h3 className="font-medium mb-2 text-foreground">Get Help</h3>
            <ul className="text-sm space-y-1">
              <li>
                <InternalLink href="/demo" variant="subtle">
                  View Demo
                </InternalLink>
              </li>
              <li>
                <InternalLink href="/features" variant="subtle">
                  Learn More
                </InternalLink>
              </li>
              <li>
                <InternalLink href="/pricing" variant="subtle">
                  Pricing Plans
                </InternalLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
