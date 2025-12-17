import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Logo from '../components/ui/Logo';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Play,
  Pause,
  Eye,
  FileCheck,
  Database,
  Shield,
  ClipboardCheck,
  HelpCircle,
  AlertTriangle,
  BarChart2,
  Target,
  Users,
  Clock,
  Zap,
  TrendingUp,
  FileText,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { toast } from '../components/ui/Toaster';
import { useChatbot } from '../components/chat/ChatbotProvider';

// Demo data
const DEMO_ASSESSMENT_DATA = {
  overallScore: 68,
  sectionScores: [
    { title: 'Identify-P', percentage: 75, completed: true },
    { title: 'Govern-P', percentage: 62, completed: true },
    { title: 'Control-P', percentage: 58, completed: true },
    { title: 'Communicate-P', percentage: 71, completed: true },
    { title: 'Protect-P', percentage: 64, completed: true }
  ]
};

const DEMO_GAPS = [
  {
    id: 'GAP-001',
    title: 'Data Processing Records Incomplete',
    priority: 'critical',
    regulation: 'GDPR Article 30',
    effort: 'Moderate',
    timeframe: 'Immediate',
    category: 'Documentation'
  },
  {
    id: 'GAP-002',
    title: 'Data Subject Rights Process Missing',
    priority: 'critical',
    regulation: 'GDPR Articles 15-22',
    effort: 'Significant',
    timeframe: 'Immediate',
    category: 'Rights Management'
  },
  {
    id: 'GAP-003',
    title: 'Privacy by Design Not Implemented',
    priority: 'high',
    regulation: 'GDPR Article 25',
    effort: 'Significant',
    timeframe: 'Short-term',
    category: 'Governance'
  },
  {
    id: 'GAP-004',
    title: 'Consent Management Inadequate',
    priority: 'high',
    regulation: 'GDPR Article 7',
    effort: 'Moderate',
    timeframe: 'Short-term',
    category: 'Consent'
  }
];

const DEMO_REQUESTS = [
  { id: 'REQ-001', type: 'Access', requester: 'John Smith', status: 'in_progress', deadline: '14 days', priority: 'high' },
  { id: 'REQ-002', type: 'Deletion', requester: 'Jane Doe', status: 'pending', deadline: '28 days', priority: 'medium' },
  { id: 'REQ-003', type: 'Rectification', requester: 'Bob Johnson', status: 'completed', deadline: 'Completed', priority: 'low' }
];

const Demo = () => {
  const { openChatbot } = useChatbot();
  const navigate = useNavigate();
  const [demoState, setDemoState] = useState('intro');
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [interactiveDemo, setInteractiveDemo] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Demo step control with auto-play
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (playing && !interactiveDemo) {
      timer = setTimeout(() => {
        if (currentStep < 7) {
          setCurrentStep(prevStep => prevStep + 1);
        } else {
          setPlaying(false);
          setCurrentStep(0);
        }
      }, 4000);
      
      autoPlayRef.current = timer;
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [playing, currentStep, interactiveDemo]);
  
  // Control demo content based on current step
  useEffect(() => {
    const states = ['intro', 'assessment', 'results', 'gaps', 'tools', 'rights', 'roadmap', 'evidence'];
    setDemoState(states[currentStep] || 'intro');
  }, [currentStep]);
  
  const startDemo = () => {
    setPlaying(true);
    setInteractiveDemo(false);
    setCurrentStep(1);
  };
  
  const startInteractiveDemo = () => {
    setPlaying(false);
    setInteractiveDemo(true);
    setCurrentStep(1);
  };
  
  const stopDemo = () => {
    setPlaying(false);
  };
  
  const handleStepChange = (step: number) => {
    setPlaying(false);
    setInteractiveDemo(true);
    setCurrentStep(step);
  };
  
  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleGuideMe = () => {
    openChatbot();
    toast.success('Interactive Guide Activated', 'Our guide bot will help you get started');
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Interactive Platform Demo</h1>
            <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs px-3 py-1 rounded-full font-medium">
              Enhanced Experience
            </span>
          </div>
          <p className="text-muted-foreground">Experience CyberCorrect's comprehensive privacy compliance automation platform with real feature previews</p>
        </div>
      </div>
      
      {/* Enhanced Demo Controls */}
      <Card className="mb-6 border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Control Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {playing ? (
                <Button variant="outline" size="sm" onClick={stopDemo} className="border-2">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Auto-Play
                </Button>
              ) : (
                <>
                  <Button size="sm" onClick={startDemo} className="bg-gradient-to-r from-primary to-secondary">
                    <Play className="h-4 w-4 mr-2" />
                    Auto-Play Tour
                  </Button>
                  <Button size="sm" variant="outline" onClick={startInteractiveDemo} className="border-2">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Interactive Explore
                  </Button>
                </>
              )}
              
              {interactiveDemo && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={nextStep}
                    disabled={currentStep === 7}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Step Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { step: 0, label: 'Intro', icon: Sparkles },
                { step: 1, label: 'Assessment', icon: Eye },
                { step: 2, label: 'Results', icon: BarChart2 },
                { step: 3, label: 'Gap Analysis', icon: Target },
                { step: 4, label: 'Tools', icon: Zap },
                { step: 5, label: 'Rights Mgmt', icon: Users },
                { step: 6, label: 'Roadmap', icon: Calendar },
                { step: 7, label: 'Evidence', icon: FileCheck }
              ].map(({ step, label, icon: Icon }) => (
                <Button 
                  key={step}
                  variant={currentStep === step ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => handleStepChange(step)}
                  className={`whitespace-nowrap ${currentStep === step ? 'shadow-md' : ''}`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Demo Progress</span>
                <span>{Math.round((currentStep / 7) * 100)}%</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                  style={{ width: `${(currentStep / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      
      {/* Demo Content */}
      {demoState === 'intro' && (
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-4">
                <Logo size="large" showText={false} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to CyberCorrect Privacy Platform</h2>
              <p className="text-lg mb-6">
                Experience our powerful, integrated platform for privacy compliance and personal data protection
              </p>
              <p className="mb-8">
                This interactive demo will walk you through key features of our platform. Watch as we demonstrate how CyberCorrect Privacy Platform can help you visualize personal data flows, assess privacy compliance (GDPR, CCPA), and generate required privacy documentation.
              </p>
              <Button size="lg" onClick={startDemo}>
                <Play className="mr-2 h-4 w-4" />
                Start the Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {demoState === 'mapper' && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Data Flow Mapper</h3>
            <div className="relative bg-muted/20 border border-muted rounded-lg h-80 mb-4 overflow-hidden">
              <div className="absolute inset-0 p-4">
                <div className="absolute top-4 left-4 z-10 bg-surface/90 dark:bg-dark-surface/90 rounded border border-support-gray dark:border-dark-support py-2 px-4">
                  <p className="font-medium text-sm">Data Flow Visualization</p>
                </div>
                
                {/* Demo visualization elements */}
                <div className="relative w-full h-full">
                  {/* Nodes are shown based on the current step */}
                  {currentStep >= 1 && (
                    <div className="absolute top-20 left-10 w-36 p-3 rounded-lg border-2 bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">Data Source</span>
                        <span className="bg-white rounded-full h-5 w-5 flex items-center justify-center text-xs">1</span>
                      </div>
                      <div className="text-[10px] mt-1">
                        <span className="bg-primary/10 px-1 py-0.5 rounded">Sensitive</span>
                      </div>
                    </div>
                  )}
                  
                  {currentStep >= 2 && (
                    <div className="absolute top-20 left-[200px] w-36 p-3 rounded-lg border-2 bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">Processing</span>
                        <span className="bg-white rounded-full h-5 w-5 flex items-center justify-center text-xs">2</span>
                      </div>
                      <div className="text-[10px] mt-1">
                        <span className="bg-primary/10 px-1 py-0.5 rounded">CRAD</span>
                      </div>
                    </div>
                  )}
                  
                  {currentStep >= 3 && (
                    <div className="absolute top-20 left-[390px] w-36 p-3 rounded-lg border-2 bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-200 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">Storage</span>
                        <span className="bg-white rounded-full h-5 w-5 flex items-center justify-center text-xs">3</span>
                      </div>
                      <div className="text-[10px] mt-1">
                        <span className="bg-primary/10 px-1 py-0.5 rounded">CRAD</span>
                        <span className="bg-primary/10 px-1 py-0.5 rounded ml-1">NNPI</span>
                      </div>
                    </div>
                  )}
                  
                  {currentStep >= 4 && (
                    <div className="absolute top-[150px] left-[200px] w-36 p-3 rounded-lg border-2 bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium"></span>
                        <span className="bg-white rounded-full h-5 w-5 flex items-center justify-center text-xs">4</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Connections based on the current step */}
                  <svg className="absolute inset-0 w-full h-full">
                    {currentStep >= 2 && (
                      <g>
                        <path 
                          d="M120 80 L200 80" 
                          stroke="#10b981" 
                          strokeWidth="2" 
                          fill="none"
                          markerEnd="url(#arrowhead)" 
                        />
                        <foreignObject x="140" y="55" width="40" height="20">
                          <div className="text-xs bg-white px-1 rounded border border-gray-200">TLS</div>
                        </foreignObject>
                      </g>
                    )}
                    
                    {currentStep >= 3 && (
                      <g>
                        <path 
                          d="M310 80 L390 80" 
                          stroke="#10b981" 
                          strokeWidth="2" 
                          fill="none"
                          markerEnd="url(#arrowhead)"
                        />
                        <foreignObject x="330" y="55" width="40" height="20">
                          <div className="text-xs bg-white px-1 rounded border border-gray-200">TLS</div>
                        </foreignObject>
                      </g>
                    )}
                    
                    {currentStep >= 4 && (
                      <g>
                        <path 
                          d="M390 100 L270 150" 
                          stroke="#10b981" 
                          strokeWidth="2" 
                          fill="none"
                          markerEnd="url(#arrowhead)"
                        />
                        <foreignObject x="320" y="115" width="40" height="20">
                          <div className="text-xs bg-white px-1 rounded border border-gray-200">HTTPS</div>
                        </foreignObject>
                      </g>
                    )}
                    
                    <defs>
                      <marker 
                        id="arrowhead" 
                        markerWidth="10" 
                        markerHeight="7" 
                        refX="0" 
                        refY="3.5" 
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              The Data Flow Mapper allows you to visually document how sensitive data moves through your systems and processes. 
              This documentation is essential for privacy compliance and security framework implementation.
            </p>
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setCurrentStep(5)}>
                Continue to Security Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {demoState === 'assessment' && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Security Framework Assessment</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-1 text-blue-600">78%</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/10 border-muted">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-1">32</div>
                    <div className="text-sm text-muted-foreground">Controls Assessed</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/10 border-muted">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-1">25</div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/10 border-muted">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-1">7</div>
                    <div className="text-sm text-muted-foreground">Non-compliant</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border rounded-lg">
                <div className="bg-muted/30 p-3 border-b">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Access Control</div>
                    <div className="text-sm text-muted-foreground">75% Compliant</div>
                  </div>
                  <div className="w-full bg-muted h-2 mt-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-3/4"></div>
                  </div>
                </div>
                
                <div className="p-2">
                  <div className="p-3 border-b last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="mt-0.5 rounded-full p-1 bg-success/10 text-success">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <div className="font-medium">Limit information system access</div>
                            <div className="text-xs bg-primary/10 text-primary ml-2 px-2 py-0.5 rounded-full">AC.1.001</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Limit system access to authorized users, processes, or devices</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="mt-0.5 rounded-full p-1 bg-success/10 text-success">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <div className="font-medium">Limit information system access to authorized transactions</div>
                            <div className="text-xs bg-primary/10 text-primary ml-2 px-2 py-0.5 rounded-full">AC.1.002</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Limit system access to the types of transactions that authorized users are permitted to execute</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="mt-0.5 rounded-full p-1 bg-destructive/10 text-destructive">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <div className="font-medium">Control CUI flow</div>
                            <div className="text-xs bg-primary/10 text-primary ml-2 px-2 py-0.5 rounded-full">AC.1.003</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Control the flow of CUI in accordance with approved authorizations</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="mt-0.5 rounded-full p-1 bg-success/10 text-success">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <div className="font-medium">Separation of duties</div>
                            <div className="text-xs bg-primary/10 text-primary ml-2 px-2 py-0.5 rounded-full">AC.1.004</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Separate the duties of individuals to reduce the risk of malevolent activity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Button>
                  View Detailed Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <div className="p-4 border-t">
            <p className="text-muted-foreground text-sm">
              The Security Framework Assessment evaluates your compliance against industry standards, providing detailed results and recommendations for improvement.
            </p>
          </div>
        </Card>
      )}
      
      {/* Demo Navigation */}
      <div className="mt-8">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium">Try CyberCorrect Privacy Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/toolkit/gdpr-mapper" className="block">
              <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-md">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Data Flow Mapper</div>
                      <div className="text-xs text-muted-foreground">Document sensitive data flows</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/assessments/privacy-assessment" className="block">
              <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-green-600 to-teal-600 p-2 rounded-lg shadow-md">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Privacy Assessment</div>
                      <div className="text-xs text-muted-foreground">Evaluate privacy compliance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/toolkit/dpia-generator" className="block">
              <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg shadow-md">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">DPIA Generator</div>
                      <div className="text-xs text-muted-foreground">Generate privacy assessments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="mt-8 p-6 bg-primary/5 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ready to streamline your compliance journey?</h3>
        <p className="mb-6 text-lg text-muted-foreground">Experience the full power of CyberCorrect Privacy Platform with a personalized demo or comprehensive assessment.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" onClick={handleGuideMe} className="border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <HelpCircle className="mr-2 h-4 w-4" />
            Guide Me Through It
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Demo;