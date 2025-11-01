import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight,
  ArrowLeft,
  Play,
  Clock,
  FileText,
  Video,
  Search,
  BookOpen,
  Shield,
  Lock
} from 'lucide-react';

const Tutorials = () => {
  const navigate = useNavigate();

  const tutorialCategories = [
    {
      title: "Getting Started",
      tutorials: [
        {
          title: "CyberCorrect Platform Overview",
          duration: "15 min",
          level: "Beginner",
          description: "Learn about the core features and capabilities of the CyberCorrect platform",
          videoId: "overview-123"
        },
        {
          title: "Setting Up Your Account",
          duration: "10 min",
          level: "Beginner",
          description: "Step-by-step guide to setting up your organization's CyberCorrect account",
          videoId: "account-setup-123"
        },
        {
          title: "Navigating the Dashboard",
          duration: "8 min",
          level: "Beginner",
          description: "Tour of the CyberCorrect dashboard and key metrics",
          videoId: "dashboard-123"
        }
      ]
    },
    {
      title: "Compliance Assessment",
      tutorials: [
        {
          title: "Running Your First Assessment",
          duration: "20 min",
          level: "Beginner",
          description: "Learn how to conduct your first compliance assessment",
          videoId: "assessment-123"
        },
        {
          title: "Understanding Assessment Results",
          duration: "15 min",
          level: "Intermediate",
          description: "How to interpret and act on assessment findings",
          videoId: "results-123"
        },
        {
          title: "Custom Assessment Templates",
          duration: "25 min",
          level: "Advanced",
          description: "Creating and managing custom assessment templates",
          videoId: "custom-templates-123"
        }
      ]
    },
    {
      title: "Documentation & Reporting",
      tutorials: [
        {
          title: "Generating System Security Plans",
          duration: "30 min",
          level: "Intermediate",
          description: "Creating comprehensive SSPs with our automated tools",
          videoId: "ssp-123"
        },
        {
          title: "POA&M Management",
          duration: "25 min",
          level: "Intermediate",
          description: "Creating and tracking Plans of Action & Milestones",
          videoId: "poam-123"
        },
        {
          title: "Custom Report Creation",
          duration: "20 min",
          level: "Advanced",
          description: "Building custom compliance reports for stakeholders",
          videoId: "reports-123"
        }
      ]
    },
    {
      title: "CUI Management",
      tutorials: [
        {
          title: "CUI Data Flow Mapping",
          duration: "35 min",
          level: "Intermediate",
          description: "Documenting CUI flows with the Data Flow Mapper",
          videoId: "cui-mapping-123"
        },
        {
          title: "CUI Handling Procedures",
          duration: "20 min",
          level: "Beginner",
          description: "Implementing proper CUI handling practices",
          videoId: "cui-handling-123"
        },
        {
          title: "CUI Storage Requirements",
          duration: "15 min",
          level: "Intermediate",
          description: "Meeting storage requirements for CUI systems",
          videoId: "cui-storage-123"
        }
      ]
    }
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Beginner':
        return <span className="px-2 py-1 text-xs rounded-full bg-success/10 text-success">Beginner</span>;
      case 'Intermediate':
        return <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">Intermediate</span>;
      case 'Advanced':
        return <span className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">Advanced</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Getting Started':
        return BookOpen;
      case 'Compliance Assessment':
        return Shield;
      case 'Documentation & Reporting':
        return FileText;
      case 'CUI Management':
        return Database;
      default:
        return BookOpen;
    }
  };

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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Video Tutorials</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how to use CyberCorrect effectively with our step-by-step video guides
          </p>
        </div>

        <div className="mb-8">
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search tutorials..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <button className="p-3 border border-primary rounded-lg bg-primary/5 text-center hover:bg-primary/10 transition-colors">
              <BookOpen className="h-5 w-5 mx-auto mb-2 text-primary" />
              <span className="text-sm">Getting Started</span>
            </button>
            <button className="p-3 border border-border rounded-lg text-center hover:bg-muted/10 transition-colors">
              <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <span className="text-sm">Assessments</span>
            </button>
            <button className="p-3 border border-border rounded-lg text-center hover:bg-muted/10 transition-colors">
              <FileText className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <span className="text-sm">Documentation</span>
            </button>
            <button className="p-3 border border-border rounded-lg text-center hover:bg-muted/10 transition-colors">
              <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <span className="text-sm">Security</span>
            </button>
          </div>
        </div>

        <div className="space-y-16">
          {tutorialCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center mb-6">
                {React.createElement(getCategoryIcon(category.title), { className: "h-6 w-6 text-primary mr-2" })}
                <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tutorials.map((tutorial, tutorialIndex) => (
                  <Card key={tutorialIndex} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative w-full aspect-video bg-muted/50 dark:bg-muted/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <Video className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                                <Play className="h-5 w-5 ml-0.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{tutorial.duration}</span>
                          </div>
                          {getLevelBadge(tutorial.level)}
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{tutorial.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>
                        
                        <Button variant="outline" className="w-full">
                          <Play className="mr-2 h-4 w-4" />
                          Watch Tutorial
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {categoryIndex < tutorialCategories.length - 1 && <hr className="mt-8 border-border" />}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-muted/30 dark:bg-muted/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our tutorial library is constantly growing. If you need help with a specific topic that's not covered here, 
            please let us know and we'll create a tutorial for you.
          </p>
          <Button>
            Request a Tutorial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tutorials;