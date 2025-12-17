import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent } from './Card';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  Settings, 
  Target,
  Users,
  Eye
} from 'lucide-react';

// Navigation suggestions based on current page context
export const ContextualNavigation: React.FC = () => {
  const location = useLocation();
  
  const getNavigationSuggestions = (pathname: string) => {
    // Assessment flow navigation
    if (pathname.includes('/assessments/')) {
      return {
        previous: { 
          text: "Back to Assessment", 
          href: "/assessment",
          icon: ArrowLeft
        },
        next: {
          text: "View Toolkit",
          href: "/toolkit", 
          icon: ArrowRight
        },
        related: [
          { text: "Project Manager", href: "/project", icon: Target },
          { text: "Resources", href: "/resources", icon: BookOpen }
        ]
      };
    }
    
    // Toolkit navigation
    if (pathname.includes('/toolkit/')) {
      return {
        previous: {
          text: "Back to Toolkit",
          href: "/toolkit",
          icon: ArrowLeft
        },
        next: {
          text: "Start Project",
          href: "/project",
          icon: ArrowRight  
        },
        related: [
          { text: "Privacy Assessment", href: "/assessments/privacy-assessment", icon: Eye },
          { text: "Resources", href: "/resources", icon: BookOpen }
        ]
      };
    }
    
    // Documentation navigation
    if (pathname.includes('/documentation/') || pathname.includes('/guides/')) {
      return {
        previous: {
          text: "Back to Resources", 
          href: "/resources",
          icon: ArrowLeft
        },
        next: {
          text: "Start Assessment",
          href: "/assessments/privacy-assessment",
          icon: ArrowRight
        },
        related: [
          { text: "Toolkit", href: "/toolkit", icon: Settings },
          { text: "Project Manager", href: "/project", icon: Users }
        ]
      };
    }

    // Project management navigation  
    if (pathname.includes('/project/')) {
      return {
        previous: {
          text: "Back to Project Overview",
          href: "/project", 
          icon: ArrowLeft
        },
        next: {
          text: "Explore Tools",
          href: "/toolkit",
          icon: ArrowRight
        },
        related: [
          { text: "Privacy Assessment", href: "/assessments/privacy-assessment", icon: Eye },
          { text: "Resources", href: "/resources", icon: FileText }
        ]
      };
    }

    return null;
  };

  const navigation = getNavigationSuggestions(location.pathname);
  
  if (!navigation) return null;

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Previous Action */}
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <Link
            to={navigation.previous.href}
            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <navigation.previous.icon className="h-5 w-5 mr-2" />
            <span className="font-medium">{navigation.previous.text}</span>
          </Link>
        </CardContent>
      </Card>

      {/* Related Links */}
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-foreground mb-2">Related</div>
          <div className="space-y-2">
            {navigation.related.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.text}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Action */}
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <Link
            to={navigation.next.href}
            className="flex items-center justify-end text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="font-medium">{navigation.next.text}</span>
            <navigation.next.icon className="h-5 w-5 ml-2" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

// Page-specific navigation component
interface PageNavigationProps {
  previousPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
  parentPage?: { title: string; href: string };
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  previousPage,
  nextPage,
  parentPage
}) => {
  return (
    <div className="border-t border-border pt-8 mt-12">
      <div className="flex justify-between items-center">
        {/* Previous Page */}
        <div className="flex-1">
          {previousPage && (
            <Link
              to={previousPage.href}
              className="group flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <div>
                <div className="text-sm">Previous</div>
                <div className="font-medium">{previousPage.title}</div>
              </div>
            </Link>
          )}
        </div>

        {/* Parent Page */}
        <div className="flex-1 text-center">
          {parentPage && (
            <Link
              to={parentPage.href}
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {parentPage.title}
            </Link>
          )}
        </div>

        {/* Next Page */}
        <div className="flex-1 text-right">
          {nextPage && (
            <Link
              to={nextPage.href}
              className="group flex items-center justify-end text-muted-foreground hover:text-primary transition-colors"
            >
              <div>
                <div className="text-sm">Next</div>
                <div className="font-medium">{nextPage.title}</div>
              </div>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};