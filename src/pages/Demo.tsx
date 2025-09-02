import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
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
  BarChart2
} from 'lucide-react';
import { toast } from '../components/ui/Toaster';
import { useChatbot } from '../components/chat/ChatbotProvider';

// Import demo components

const Demo = () => {
  const { openChatbot } = useChatbot();
  const [demoState, setDemoState] = useState('intro'); // intro, dashboard, assessment, framework, recommendations, sensitive
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFeatures] = useState(false);
  const autoPlayRef = useRef(null);
  
  // Demo step control with auto-play
  useEffect(() => {
    let timer = null;
    
    if (playing) {
      timer = setTimeout(() => {
        if (currentStep < 5) {
          setCurrentStep(prevStep => prevStep + 1);
        } else {
          setPlaying(false);
        }
      }, 3000);
      
      autoPlayRef.current = timer;
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [playing, currentStep]);
  
  // Control demo content based on current step
  useEffect(() => {
    if (currentStep === 0) {
      setDemoState('intro');
    } else if (currentStep >= 1 && currentStep <= 4) {
      setDemoState('mapper');
    } else if (currentStep === 5) {
      setDemoState('assessment');
    }
  }, [currentStep]);
  
  const startDemo = () => {
    setPlaying(true);
    setCurrentStep(1);
  };
  
  const stopDemo = () => {
    setPlaying(false);
  };
  
  const handleStepChange = (step) => {
    setPlaying(false);
    setCurrentStep(step);
  };
  
  const handleGuideMe = () => {
    openChatbot();
    toast.success('Interactive Guide Activated', 'Our guide bot will help you get started');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Interactive Demo</h1>
            <p className="text-muted-foreground">Explore CyberCorrect's powerful features for CUI protection and compliance management</p>
          </div>
          <div className="flex gap-2">
            <Link to="/about">
              <Button size="lg">
                Schedule a Live Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Demo Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {playing ? (
                <Button variant="outline" size="sm" onClick={stopDemo}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Demo
                </Button>
              ) : (
                <Button size="sm" onClick={startDemo}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Demo
                </Button>
              )}
              
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((step) => (
                  <Button 
                    key={step}
                    variant={currentStep === step ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleStepChange(step)}
                  >
                    {step === 0 ? 'Intro' : step}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {demoState === 'intro' && 'Introduction'}
              {demoState === 'mapper' && 'CUI Data Flow Mapper'}
              {demoState === 'assessment' && 'CMMC Assessment'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Feature List */}
      {showFeatures && (
        <Card className="mb-6 border-primary shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Key Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 hover:shadow-md transition-all duration-300">
                <Database className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-200">Data Flow Mapper</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Visualize and document data flows across your systems</p>
                </div>
              </div>
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 hover:shadow-md transition-all duration-300">
                <Shield className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">Security Assessment</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Evaluate compliance with security frameworks</p>
                </div>
              </div>
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 hover:shadow-md transition-all duration-300">
                <FileCheck className="h-6 w-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-purple-800 dark:text-purple-200">Document Generator</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Auto-generate compliance documentation</p>
                </div>
              </div>
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 hover:shadow-md transition-all duration-300">
                <BarChart2 className="h-6 w-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-800 dark:text-orange-200">Analytics Dashboard</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">Real-time compliance metrics and insights</p>
                </div>
              </div>
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 hover:shadow-md transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-teal-800 dark:text-teal-200">Evidence Management</p>
                  <p className="text-sm text-teal-700 dark:text-teal-300">Centralized compliance evidence vault</p>
                </div>
              </div>
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 hover:shadow-md transition-all duration-300">
                <Eye className="h-6 w-6 text-pink-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-pink-800 dark:text-pink-200">Privacy Controls</p>
                  <p className="text-sm text-pink-700 dark:text-pink-300">Advanced privacy protection controls</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Demo Content */}
      {demoState === 'intro' && (
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="max-w-2xl mx-auto">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Welcome to CyberCorrect</h2>
              <p className="text-lg mb-6">
                Experience our powerful, integrated platform for CMMC 2.0 compliance and CUI protection
              </p>
              <p className="mb-8">
                This interactive demo will walk you through key features of our platform. Watch as we demonstrate how CyberCorrect can help you visualize CUI data flows, assess CMMC 2.0 compliance, and generate required documentation.
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
                        <span className="font-medium">Users</span>
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
                    <div className="bg-primary h-full" style={{width: '75%'}}></div>
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
          <h3 className="text-lg font-medium">Try CyberCorrect Features</h3>
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
        <p className="mb-6 text-lg text-muted-foreground">Experience the full power of PrivacyCorrect with a personalized demo or comprehensive assessment.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Schedule a Live Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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