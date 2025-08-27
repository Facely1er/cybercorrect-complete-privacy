import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertTriangle, ArrowLeft, Home, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-muted p-6 mb-8">
        <AlertTriangle className="w-16 h-16 text-warning" />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-foreground">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
      </p>
      
      <div className="max-w-md w-full mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-md border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search for resources, guides, or documentation..."
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        <div className="text-center">
          <h3 className="font-medium mb-2">Popular Resources</h3>
          <ul className="text-sm space-y-2">
            <li><a href="/documentation" className="text-primary hover:underline">Documentation</a></li>
            <li><a href="/guides" className="text-primary hover:underline">Guides</a></li>
            <li><a href="/support" className="text-primary hover:underline">Support Center</a></li>
          </ul>
        </div>
        <div className="text-center">
          <h3 className="font-medium mb-2">Quick Tools</h3>
          <ul className="text-sm space-y-2">
            <li><a href="/cmmc-quick-check" className="text-primary hover:underline">CMMC Quick Check</a></li>
            <li><a href="/cui-assessment" className="text-primary hover:underline">CUI Assessment</a></li>
            <li><a href="/poam-generator" className="text-primary hover:underline">POA&M Generator</a></li>
          </ul>
        </div>
        <div className="text-center">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <ul className="text-sm space-y-2">
            <li><a href="/support" className="text-primary hover:underline">Contact Support</a></li>
            <li><a href="/documentation/faqs" className="text-primary hover:underline">FAQs</a></li>
            <li><a href="/about" className="text-primary hover:underline">About CyberCorrect</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;