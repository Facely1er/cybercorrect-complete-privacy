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
import styles from './Demo.module.css';

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
                  <Button size="sm" onClick={startDemo} className="bg-primary hover:bg-primary/90">
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
              <div className={`w-full bg-muted h-2 rounded-full overflow-hidden ${styles.progressBarContainer}`} data-progress={Math.round((currentStep / 7) * 100)}>
                <div className={styles.progressBar} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      
      {/* Demo Content */}
      {demoState === 'intro' && (
        <Card className="mb-6 border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Logo size="large" showText={false} />
                  <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to CyberCorrect Privacy Platform
              </h2>
              <p className="text-lg mb-6 text-center text-muted-foreground">
                Experience our comprehensive platform for automated privacy compliance management
              </p>
              
              {/* Feature Highlights */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Eye, title: 'Privacy Assessment', desc: 'NIST-aligned evaluation in 15-20 minutes' },
                  { icon: Target, title: 'Gap Analysis', desc: 'Risk-weighted priority recommendations' },
                  { icon: Shield, title: 'DPIA Generator', desc: 'Automated GDPR Article 35 compliance' },
                  { icon: Users, title: 'Rights Management', desc: '30-day SLA tracking & orchestration' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start p-4 rounded-lg border border-border hover:border-primary/50 transition-all bg-gradient-to-br from-background to-muted/20">
                    <div className="mr-3 p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={startDemo} className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Start Auto-Play Tour
                </Button>
                <Button size="lg" variant="outline" onClick={startInteractiveDemo} className="border-2">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Interactively
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Assessment Preview */}
      {demoState === 'assessment' && (
        <Card className="mb-6 border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Privacy Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">NIST Privacy Framework Assessment</h3>
                <span className="text-sm text-muted-foreground">15-20 minutes</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive evaluation across 5 core privacy functions: Identify, Govern, Control, Communicate, and Protect
              </p>
            </div>
            
            {/* Sample Questions */}
            <div className="space-y-4 mb-6">
              <div className="p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-primary">Identify-P Section</span>
                    <p className="font-medium mt-1">Does your organization maintain an inventory of data processing activities?</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600 ml-2 flex-shrink-0" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="bg-green-50 border-green-200 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Yes, Comprehensive
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <span className="text-xs font-medium text-primary">Govern-P Section</span>
                    <p className="font-medium mt-1">Has your organization designated a Data Protection Officer or privacy lead?</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-primary ml-2 flex-shrink-0 animate-pulse" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="hover:bg-primary hover:text-white">
                    Yes, Designated
                  </Button>
                  <Button size="sm" variant="outline" className="hover:bg-primary hover:text-white">
                    Partially
                  </Button>
                  <Button size="sm" variant="outline" className="hover:bg-primary hover:text-white">
                    No
                  </Button>
                  <Button size="sm" variant="outline" className="hover:bg-primary hover:text-white">
                    Not Applicable
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg opacity-60">
                <span className="text-xs font-medium text-muted-foreground">Control-P Section</span>
                <p className="font-medium mt-1 text-muted-foreground">15 more questions...</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 inline mr-1 text-green-600" />
                Progress auto-saved
              </div>
              <Link to="/assessments/privacy-assessment">
                <Button>
                  Try Real Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Results Preview */}
      {demoState === 'results' && (
        <Card className="mb-6 border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Assessment Results & Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Overall Score */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-1 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{DEMO_ASSESSMENT_DATA.overallScore}%</div>
                  <div className="text-sm font-medium text-muted-foreground mb-3">Overall Compliance</div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Moderate Risk
                  </div>
                </CardContent>
              </Card>
              
              <div className="col-span-2 space-y-3">
                {DEMO_ASSESSMENT_DATA.sectionScores.map((section, idx) => {
                  return (
                    <div key={idx} className="p-3 border border-border rounded-lg hover:border-primary/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{section.title}</span>
                        <span className="text-sm font-semibold text-primary">{section.percentage}%</span>
                      </div>
                      <div className={`w-full bg-muted h-2 rounded-full overflow-hidden ${styles.sectionProgressContainer}`} data-progress={section.percentage}>
                        <div className={styles.sectionProgress} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Key Insights */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <TrendingUp className="h-5 w-5 text-green-600 mb-2" />
                <p className="font-semibold text-sm mb-1">Strengths</p>
                <p className="text-xs text-muted-foreground">Strong data identification and communication practices</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <AlertTriangle className="h-5 w-5 text-orange-600 mb-2" />
                <p className="font-semibold text-sm mb-1">Priority Areas</p>
                <p className="text-xs text-muted-foreground">Control and protection mechanisms need improvement</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Target className="h-5 w-5 text-blue-600 mb-2" />
                <p className="font-semibold text-sm mb-1">Maturity Level</p>
                <p className="text-xs text-muted-foreground">Developing - Basic framework in place</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => handleStepChange(3)}>
                View Gap Analysis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Gap Analysis Preview */}
      {demoState === 'gaps' && (
        <Card className="mb-6 border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Privacy Gap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Identified compliance gaps ranked by priority, with clear recommendations and timeframes for remediation
              </p>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-xs text-muted-foreground">Critical</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <div className="text-xs text-muted-foreground">High</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-xs text-muted-foreground">Medium</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <div className="text-xs text-muted-foreground">Low</div>
                </div>
              </div>
            </div>
            
            {/* Gap List */}
            <div className="space-y-3 mb-6">
              {DEMO_GAPS.map((gap) => {
                const gapBorderClass = gap.priority === 'critical' ? styles.gapBorderCritical : styles.gapBorderHigh;
                return (
                  <div key={gap.id} className={`p-4 border-l-4 rounded-lg border hover:shadow-md transition-all ${gapBorderClass}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getPriorityColor(gap.priority)}`}>
                          {gap.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">{gap.id}</span>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{gap.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{gap.regulation}</p>
                    </div>
                    <AlertTriangle className={`h-5 w-5 flex-shrink-0 ml-2 ${gap.priority === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-muted">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {gap.timeframe}
                    </span>
                    <span className="px-2 py-1 rounded bg-muted">
                      <Zap className="h-3 w-3 inline mr-1" />
                      {gap.effort} effort
                    </span>
                    <span className="px-2 py-1 rounded bg-muted">
                      {gap.category}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => handleStepChange(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Button>
              <Link to="/toolkit/privacy-gap-analyzer">
                <Button>
                  Open Gap Analyzer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recommended Tools Preview */}
      {demoState === 'tools' && (
        <Card className="mb-6 border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Recommended Tools & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-6">
              Based on your assessment and identified gaps, here are the recommended tools to close your compliance gaps
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  icon: FileText,
                  title: 'DPIA Generator',
                  description: 'Generate Data Protection Impact Assessments for GDPR Article 35 compliance',
                  priority: 'critical',
                  path: '/toolkit/dpia-generator',
                  gaps: ['GAP-001', 'GAP-003']
                },
                {
                  icon: Users,
                  title: 'Privacy Rights Manager',
                  description: 'Handle data subject requests with 30-day SLA tracking',
                  priority: 'critical',
                  path: '/toolkit/privacy-rights-manager',
                  gaps: ['GAP-002']
                },
                {
                  icon: Shield,
                  title: 'Consent Management',
                  description: 'Implement compliant consent mechanisms for GDPR Article 7',
                  priority: 'high',
                  path: '/toolkit/consent-management',
                  gaps: ['GAP-004']
                },
                {
                  icon: Database,
                  title: 'Data Flow Mapper',
                  description: 'Document and visualize personal data flows across systems',
                  priority: 'high',
                  path: '/toolkit/gdpr-mapper',
                  gaps: ['GAP-001', 'GAP-003']
                }
              ].map((tool) => (
                <Link key={tool.path} to={tool.path} className="block group">
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                          <tool.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{tool.title}</h4>
                            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(tool.priority)}`}>
                              {tool.priority}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{tool.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {tool.gaps.map(gap => (
                              <span key={gap} className="text-xs px-2 py-0.5 rounded bg-muted">
                                {gap}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => handleStepChange(5)}>
                Next: Rights Management
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Privacy Rights Management Preview */}
      {demoState === 'rights' && (
        <Card className="mb-6 border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Privacy Rights Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-6">
              Manage data subject requests (GDPR/CCPA) with automated SLA tracking and compliance workflows
            </p>
            
            {/* Request Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg border border-border bg-muted/30">
                <div className="text-3xl font-bold text-primary mb-1">3</div>
                <div className="text-xs text-muted-foreground">Active Requests</div>
              </div>
              <div className="text-center p-4 rounded-lg border border-border bg-muted/30">
                <div className="text-3xl font-bold text-green-600 mb-1">14</div>
                <div className="text-xs text-muted-foreground">Avg. Days to Close</div>
              </div>
              <div className="text-center p-4 rounded-lg border border-border bg-muted/30">
                <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
                <div className="text-xs text-muted-foreground">SLA Compliance</div>
              </div>
            </div>
            
            {/* Request List */}
            <div className="space-y-3 mb-6">
              {DEMO_REQUESTS.map(req => (
                <div key={req.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{req.requester}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {req.type}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{req.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(req.status)}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {req.deadline}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Automated SLA Tracking</p>
                  <p className="text-xs text-muted-foreground">
                    All requests automatically monitored for 30-day GDPR compliance window with escalation alerts
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={() => handleStepChange(4)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
              </Button>
              <Link to="/toolkit/privacy-rights-manager">
                <Button>
                  Open Rights Manager
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Roadmap Preview */}
      {demoState === 'roadmap' && (
        <Card className="mb-6 border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Privacy Compliance Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-6">
              Track implementation progress across phases with clear milestones and deliverables
            </p>
            
            {/* Timeline */}
            <div className="space-y-4 mb-6">
              {[
                {
                  id: 'phase-1',
                  phase: 'Phase 1: Foundation',
                  status: 'completed',
                  duration: 'Q1 2024',
                  progress: 100,
                  milestones: ['Data inventory complete', 'DPO designated', 'Policy framework established'],
                  borderColor: '#22c55e'
                },
                {
                  id: 'phase-2',
                  phase: 'Phase 2: Implementation',
                  status: 'in_progress',
                  duration: 'Q2 2024',
                  progress: 60,
                  milestones: ['DPIA process implemented', 'Rights management deployed', 'Training in progress'],
                  borderColor: '#3b82f6'
                },
                {
                  id: 'phase-3',
                  phase: 'Phase 3: Optimization',
                  status: 'pending',
                  duration: 'Q3 2024',
                  progress: 0,
                  milestones: ['Automation deployment', 'Advanced analytics', 'Continuous monitoring'],
                  borderColor: '#9ca3af'
                }
              ].map((phase, idx) => {
                const phaseBorderClass = phase.status === 'completed' ? styles.phaseBorderCompleted :
                                        phase.status === 'in_progress' ? styles.phaseBorderInProgress :
                                        styles.phaseBorderPending;
                const phaseProgressClass = phase.status === 'completed' ? styles.phaseProgressCompleted :
                                          phase.status === 'in_progress' ? styles.phaseProgressInProgress :
                                          styles.phaseProgressPending;
                return (
                  <div key={phase.id} className="relative pl-8 pb-8 last:pb-0">
                    {idx < 2 && (
                      <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-border" />
                    )}
                    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      phase.status === 'completed' ? 'bg-green-500 border-green-500' :
                      phase.status === 'in_progress' ? 'bg-blue-500 border-blue-500' :
                      'bg-muted border-muted-foreground'
                    }`}>
                      {phase.status === 'completed' && <CheckCircle className="h-4 w-4 text-white" />}
                      {phase.status === 'in_progress' && <Clock className="h-4 w-4 text-white" />}
                    </div>
                    <Card className={`border-l-4 ${phaseBorderClass}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{phase.phase}</h4>
                          <span className="text-xs text-muted-foreground">{phase.duration}</span>
                        </div>
                        <div className={`w-full bg-muted h-2 rounded-full overflow-hidden mb-3 ${styles.phaseProgressContainer}`} data-progress={phase.progress}>
                          <div className={phaseProgressClass} />
                        </div>
                        <div className="space-y-1">
                          {phase.milestones.map((milestone, mIdx) => (
                            <div key={mIdx} className="flex items-center gap-2 text-xs">
                              <CheckCircle className={`h-3 w-3 ${phase.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className="text-muted-foreground">{milestone}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end">
              <Link to="/project/roadmap">
                <Button>
                  Open Full Roadmap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Evidence Vault Preview */}
      {demoState === 'evidence' && (
        <Card className="mb-6 border-0 shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Evidence Vault & Compliance Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-6">
              Centralized repository for compliance evidence, audit trails, and regulatory documentation
            </p>
            
            {/* Evidence Categories */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {[
                { category: 'Policies & Procedures', count: 12, icon: FileText },
                { category: 'DPIAs & Risk Assessments', count: 5, icon: Shield },
                { category: 'Training Records', count: 24, icon: Users },
                { category: 'Audit Reports', count: 8, icon: CheckCircle }
              ].map((cat, idx) => (
                <Card key={idx} className="hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <cat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{cat.category}</div>
                        <div className="text-xs text-muted-foreground">{cat.count} documents</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Recent Activity */}
            <div className="p-4 rounded-lg border border-border bg-muted/20 mb-6">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Privacy Policy v2.1 uploaded - 2 days ago</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>DPIA-2024-Q1 completed - 5 days ago</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Training certificates added - 1 week ago</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Audit-Ready Documentation</p>
                  <p className="text-xs text-muted-foreground">
                    All evidence timestamped, versioned, and organized by regulatory framework for instant audit access
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={() => handleStepChange(6)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Roadmap
              </Button>
              <Link to="/project/evidence">
                <Button>
                  Open Evidence Vault
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Quick Access to Features */}
      <div className="mt-8">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Try Real Platform Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  to: '/assessments/privacy-assessment',
                  icon: Eye,
                  title: 'Privacy Assessment',
                  desc: 'Start 15-min evaluation',
                  color: 'from-blue-600 to-cyan-600'
                },
                {
                  to: '/toolkit/privacy-gap-analyzer',
                  icon: Target,
                  title: 'Gap Analyzer',
                  desc: 'Find compliance gaps',
                  color: 'from-purple-600 to-pink-600'
                },
                {
                  to: '/toolkit/dpia-generator',
                  icon: FileText,
                  title: 'DPIA Generator',
                  desc: 'Create GDPR DPIAs',
                  color: 'from-green-600 to-emerald-600'
                },
                {
                  to: '/toolkit/privacy-rights-manager',
                  icon: Users,
                  title: 'Rights Manager',
                  desc: 'Handle DSARs',
                  color: 'from-orange-600 to-amber-600'
                },
                {
                  to: '/toolkit/gdpr-mapper',
                  icon: Database,
                  title: 'Data Flow Mapper',
                  desc: 'Visualize data flows',
                  color: 'from-teal-600 to-cyan-600'
                },
                {
                  to: '/project/roadmap',
                  icon: Calendar,
                  title: 'Compliance Roadmap',
                  desc: 'Track implementation',
                  color: 'from-violet-600 to-purple-600'
                },
                {
                  to: '/project/evidence',
                  icon: FileCheck,
                  title: 'Evidence Vault',
                  desc: 'Store audit evidence',
                  color: 'from-amber-600 to-yellow-600'
                },
                {
                  to: '/toolkit',
                  icon: Zap,
                  title: 'All Tools',
                  desc: 'Browse 20+ tools',
                  color: 'from-pink-600 to-rose-600'
                }
              ].map((feature, idx) => (
                <Link key={idx} to={feature.to} className="block group">
                  <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="font-semibold text-sm mb-1">{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.desc}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Enhanced Call to Action */}
      <div className="mt-8">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <CardContent className="p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Ready to Get Started?
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transform Your Privacy Compliance
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                From assessment to implementation, CyberCorrect provides everything you need to achieve and maintain privacy compliance
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: CheckCircle, text: 'Free to start' },
                  { icon: Clock, text: 'Results in 20 minutes' },
                  { icon: Shield, text: 'NIST-aligned framework' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-center gap-2 p-3 rounded-lg bg-background/50 border border-border">
                    <item.icon className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/assessments/privacy-assessment')}
                  className="bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleGuideMe} 
                  className="border-2 hover:bg-background"
                >
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Get Guided Tour
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/toolkit')}
                  className="border-2 hover:bg-background"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Explore All Tools
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;

