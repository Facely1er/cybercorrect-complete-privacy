import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  FileText, 
  Eye, 
  Lock, 
  CheckCircle, 
  ArrowRight,
  Database,
  UserCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  Clock,
  Building,
  Info,
  Mail,
  HelpCircle,
  Edit,
  Trash2,
  Download,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { localStorageService } from '../services/localStorageService';
import { useBrand } from '../hooks/useBrand';
import { TextCarousel } from '../components/common/TextCarousel';

// TypeScript interfaces
interface DataRightsRequest {
  type: string;
  submittedAt: string;
  status: string;
}

interface PrivacyIncident {
  title: string;
  discoveryDate: string;
  status: string;
}

interface VendorAssessment {
  vendorName: string;
  lastAssessmentDate: string;
  complianceStatus: string;
}


export function HomePage() {
  const { brand } = useBrand();
  const navigate = useNavigate();
  const [dataRightsRequests, setDataRightsRequests] = useState<DataRightsRequest[]>([]);
  const [privacyIncidents, setPrivacyIncidents] = useState<PrivacyIncident[]>([]);
  const [vendorAssessments, setVendorAssessments] = useState<VendorAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function for navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Carousel messages for hero section
  const heroMessages = [
    brand.description,
    "Empower employees and job prospects to understand their workplace privacy rights under employment laws",
    "Streamline HR compliance management for employers and privacy officers",
    "Provide self-service tools for exercising employee data access, correction, and deletion rights",
    "Enable HR teams to fulfill workplace privacy duties with confidence",
    "Transform workplace privacy compliance from complex burden to transparent, manageable process"
  ];

  // Load data from localStorage for recent activity
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [dataRights, incidents, vendors] = await Promise.all([
          localStorageService.getDataRightsRequests(),
          localStorageService.getPrivacyIncidents(),
          localStorageService.getVendorAssessments()
        ]);
        
        setDataRightsRequests(dataRights || []);
        setPrivacyIncidents(incidents || []);
        setVendorAssessments(vendors || []);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty arrays as fallback
        setDataRightsRequests([]);
        setPrivacyIncidents([]);
        setVendorAssessments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const stakeholderCategories = [
    {
      id: 'employees-job-prospects',
      title: 'Employees & Job Prospects',
      description: 'Exercise your workplace privacy rights and manage employment data preferences',
      icon: <Users className="h-12 w-12 text-blue-600" />,
      responsibilities: [
        'Understanding and exercising workplace data privacy rights',
        'Managing consent preferences for employment data processing',
        'Accessing personal employment records and HR data',
        'Privacy settings for workplace monitoring and data collection'
      ],
      quickActions: [
        { title: 'Exercise My Rights', href: '/data-rights', priority: 'high' },
        { title: 'Access My Records', href: '/privacy/data-rights?type=access', priority: 'high' },
        { title: 'Privacy Settings', href: '/settings', priority: 'medium' },
        { title: 'View My Data', href: '/privacy/data-rights', priority: 'medium' }
      ],
      color: 'blue',
    },
    {
      id: 'hr-employees',
      title: 'HR & Employees',
      description: 'Fulfill workplace privacy duties and employee data handling duties',
      icon: <UserCheck className="h-12 w-12 text-green-600" />,
      responsibilities: [
        'Employee data protection in daily HR activities',
        'Workplace privacy incident reporting and response',
        'Compliance with employment privacy policies',
        'Employee consent management and verification'
      ],
      quickActions: [
        { title: 'My Privacy Duties', href: '/stakeholder-duties', priority: 'high' },
        { title: 'Report Incident', href: '/privacy/incidents', priority: 'high' },
        { title: 'Consent Management', href: '/privacy/consent', priority: 'medium' },
        { title: 'Privacy Guidelines', href: '/how-it-works', priority: 'medium' }
      ],
      color: 'green',
    },
    {
      id: 'employers-compliance',
      title: 'Employers & Compliance Officers',
      description: 'Organization-wide workplace privacy management and compliance oversight',
      icon: <Shield className="h-12 w-12 text-purple-600" />,
      responsibilities: [
        'Workplace privacy compliance management',
        'Employee data rights request processing and oversight',
        'Employment privacy policy development and implementation',
        'HR access control and audit oversight'
      ],
      quickActions: [
        { title: 'Privacy Management Dashboard', href: '/privacy/dashboard', priority: 'high' },
        { title: 'Stakeholder Access Control', href: '/privacy/stakeholders', priority: 'high' },
        { title: 'Compliance Obligations', href: '/privacy/obligations', priority: 'medium' },
        { title: 'Analytics & Reports', href: '/privacy/analytics', priority: 'medium' }
      ],
      color: 'purple',
    },
    {
      id: 'external-parties',
      title: 'External Parties',
      description: 'Limited access for authorized representatives and partners',
      icon: <Building className="h-12 w-12 text-amber-600" />,
      responsibilities: [
        'Exercise data rights on behalf of employees/job applicants',
        'Submit requests through proper verification channels',
        'Coordinate with workplace privacy officers',
        'Maintain confidentiality and authorized access only'
      ],
      quickActions: [
        { title: 'Submit Data Request', href: '/privacy/data-rights', priority: 'high' },
        { title: 'Contact Privacy Office', href: '/contact', priority: 'high' },
        { title: 'Verification Process', href: '/faq', priority: 'medium' },
        { title: 'Access Guidelines', href: '/how-it-works', priority: 'medium' }
      ],
      color: 'amber',
    }
  ];

  const dataRightsTypes = [
    {
      id: 'access',
      title: 'Right to Access',
      description: 'View or obtain copies of personal employment and HR data',
      icon: <Eye className="h-6 w-6 text-blue-600" />,
      examples: ['Payroll records', 'Performance reviews', 'Benefits information', 'Disciplinary records'],
      regulations: ['ADA', 'EEOC', 'CCPA', 'GDPR'],
      timeline: '30-45 days'
    },
    {
      id: 'correction',
      title: 'Right to Correction',
      description: 'Request correction of inaccurate or incomplete employment information',
      icon: <Edit className="h-6 w-6 text-green-600" />,
      examples: ['Performance corrections', 'Contact updates', 'Record amendments', 'Benefits corrections'],
      regulations: ['ADA', 'EEOC', 'CCPA', 'GDPR'],
      timeline: '30-45 days'
    },
    {
      id: 'deletion',
      title: 'Right to Deletion',
      description: 'Request removal of personal employment information when legally permissible',
      icon: <Trash2 className="h-6 w-6 text-red-600" />,
      examples: ['Old application data', 'Unnecessary records', 'Marketing preferences', 'Outdated information'],
      regulations: ['CCPA', 'GDPR', 'Employment Privacy Laws'],
      timeline: '30 days'
    },
    {
      id: 'portability',
      title: 'Right to Portability',
      description: 'Receive employment data in portable format for transfer',
      icon: <Download className="h-6 w-6 text-purple-600" />,
      examples: ['Work history', 'Performance data', 'Training records', 'Benefits information'],
      regulations: ['GDPR', 'CCPA', 'Employment Privacy Laws'],
      timeline: '30 days'
    }
  ];

  const privacyCompliance = [
    { regulation: 'ADA', coverage: 'All employees & applicants', icon: <Shield className="h-5 w-5" /> },
    { regulation: 'EEOC', coverage: 'Workplace privacy rights', icon: <Users className="h-5 w-5" /> },
    { regulation: 'CCPA', coverage: 'California residents', icon: <Lock className="h-5 w-5" /> },
    { regulation: 'GDPR', coverage: 'EU data subjects', icon: <Globe className="h-5 w-5" /> }
  ];

  // Generate recent activity from real data
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const recentActivity = isLoading ? [] : [
    ...(dataRightsRequests || []).slice(0, 2).map(req => ({
      type: 'data_request',
      title: `${req.type.charAt(0).toUpperCase() + req.type.slice(1)} Request`,
      description: `Data rights request submitted`,
      timestamp: formatTimestamp(req.submittedAt),
      status: req.status,
      stakeholder: 'family'
    })),
    ...(privacyIncidents || []).slice(0, 1).map(incident => ({
      type: 'incident',
      title: incident.title,
      description: 'Privacy incident reported',
      timestamp: formatTimestamp(incident.discoveryDate),
      status: incident.status,
      stakeholder: 'staff'
    })),
    ...(vendorAssessments || []).slice(0, 1).map(vendor => ({
      type: 'vendor',
      title: `${vendor.vendorName} Assessment`,
      description: 'Vendor assessment updated',
      timestamp: formatTimestamp(vendor.lastAssessmentDate),
      status: vendor.complianceStatus,
      stakeholder: 'admin'
    }))
  ].slice(0, 4);

  const privacyManagementFeatures = [
    {
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      title: 'Data Rights Management',
      description: 'Submit and track data access, correction, and deletion requests',
      link: '/privacy/data-rights'
    },
    {
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: 'Privacy Compliance',
      description: 'Monitor compliance obligations and regulatory requirements',
      link: '/privacy/obligations'
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: 'Stakeholder Management',
      description: 'Manage access rights and permissions for all stakeholders',
      link: '/privacy/stakeholders'
    },
    {
      icon: <Building className="h-6 w-6 text-red-600" />,
      title: 'Vendor Oversight',
      description: 'Assess and monitor third-party data processing compliance',
      link: '/privacy/vendors'
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
      title: 'Incident Response',
      description: 'Report and manage privacy incidents and data breaches',
      link: '/privacy/incidents'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      title: 'Analytics & Reports',
      description: 'Generate insights and compliance reports',
      link: '/privacy/analytics'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white">
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-10" 
          aria-hidden="true"
        />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center bg-white/10 text-white rounded-full px-6 py-3 mb-8">
            <Database className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">{brand.description}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Employee Privacy Rights &{' '}
            <br className="hidden md:block" />
            <span className="text-blue-200">Employer Compliance Portal</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto mb-10">
            <TextCarousel 
              messages={heroMessages}
              interval={4000}
              className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto"
            />
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm"
              onClick={() => handleNavigation('/data-rights')}
            >
              Exercise My Data Rights <Eye className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              className="font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm"
              onClick={() => handleNavigation('/stakeholder-duties')}
            >
              View My Privacy Duties <UserCheck className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {privacyCompliance.map((item, index) => (
              <div key={index} className="flex items-center justify-center bg-white/10 rounded-lg p-4">
                {item.icon}
                <div className="ml-3 text-left">
                  <div className="font-medium text-sm">{item.regulation}</div>
                  <div className="text-xs text-blue-200">{item.coverage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Privacy Compliance Suite */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Workplace Privacy Compliance Suite
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to manage workplace privacy compliance across multiple regulations and stakeholders in one comprehensive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Core Compliance */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multi-Regulation Compliance</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive support for ADA, EEOC, CCPA, GDPR, and other employment privacy regulations
              </p>
              <div className="flex flex-wrap gap-1">
                {['ADA', 'EEOC', 'CCPA', 'GDPR'].map(reg => (
                  <Badge key={reg} variant="info" className="text-xs">
                    {reg}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Self-Service Portal */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Self-Service Portal</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Empowers all workplace stakeholders to understand duties and exercise rights independently
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Employees & job prospects data rights</li>
                <li>• HR privacy duty guidance</li>
                <li>• Employer oversight tools</li>
                <li>• External party access</li>
              </ul>
            </div>

            {/* Automated Workflows */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mx-auto mb-4">
                <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Automated Workflows</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Streamline compliance processes with intelligent automation and alerts
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Deadline reminders</li>
                <li>• Request processing</li>
                <li>• Incident response</li>
                <li>• Compliance reporting</li>
              </ul>
            </div>

            {/* Analytics & Insights */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 text-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg w-fit mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Analytics & Insights</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive analytics and reporting for privacy program performance
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Compliance score tracking</li>
                <li>• Request processing metrics</li>
                <li>• Incident response analysis</li>
                <li>• Regulatory reporting</li>
              </ul>
            </div>

            {/* Stakeholder Management */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 text-center">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg w-fit mx-auto mb-4">
                <UserCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Stakeholder Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete access control and permission management for all user types
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Role-based access control</li>
                <li>• Permission management</li>
                <li>• Activity monitoring</li>
                <li>• Audit trails</li>
              </ul>
            </div>

            {/* Vendor Oversight */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6 text-center">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg w-fit mx-auto mb-4">
                <Building className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Vendor Oversight</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comprehensive third-party vendor privacy assessment and monitoring
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Privacy assessments</li>
                <li>• Risk evaluation</li>
                <li>• Contract management</li>
                <li>• Ongoing monitoring</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">All-in-One Workplace Privacy Management Platform</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                From employee data rights to workplace compliance oversight, our platform provides every tool you need to maintain privacy compliance across your organization.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm"
                  onClick={() => handleNavigation('/privacy')}
                >
                  Explore Full Platform <Database className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
                  onClick={() => handleNavigation('/how-it-works')}
                >
                  See How It Works <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
       
      {/* Stakeholder Categories - Primary Focus */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Access Portal by Your Workplace Role
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Different workplace stakeholders have different privacy duties and rights. Choose your role to access the appropriate self-service tools and exercise your data rights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {stakeholderCategories.map((category) => (
              <div key={category.id} className="bg-card rounded-xl border p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center gap-6 mb-8 text-center">
                  <div className={`p-4 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-xl shadow-sm`}>
                    {category.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{category.description}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-foreground">Privacy Duties</h4>
                  <ul className="space-y-3">
                    {category.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground leading-relaxed">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Quick Access</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {category.quickActions.map((action) => (
                      <Button 
                        key={action.title}
                        variant={action.priority === 'high' ? 'default' : 'outline'}
                        size="sm" 
                        className={`w-full justify-start text-xs transition-all duration-200 ${
                          action.priority === 'high' 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 border-0 shadow-sm hover:shadow-md' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:shadow-sm'
                        }`}
                        onClick={() => handleNavigation(action.href)}
                      >
                        <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{action.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Rights Exercise - Main Feature */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Exercise Your Workplace Data Privacy Rights
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Submit requests to access, correct, delete, or transfer your employment data. Our self-service portal guides you through the process for each type of request.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {dataRightsTypes.map((right) => (
              <div key={right.id} className="bg-white dark:bg-gray-900 rounded-lg border p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                    {right.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{right.title}</h3>
                    <p className="text-xs text-muted-foreground">Response: {right.timeline}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{right.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-xs mb-3 text-foreground">Examples:</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    {right.examples.map((example, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {right.regulations.map(reg => (
                    <Badge key={reg} variant="info" className="text-xs px-2 py-1">
                      {reg}
                    </Badge>
                  ))}
                </div>

                <Button 
                  size="sm" 
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 border-0"
                  onClick={() => handleNavigation('/data-rights')}
                >
                  Submit Request
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
              onClick={() => handleNavigation('/data-rights')}
            >
              Start Data Rights Request <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Need help? <Link to="/contact" className="text-primary-600 hover:underline">Contact our privacy team</Link> for guidance
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Management Dashboard */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Workplace Privacy Management Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools for HR and compliance officers to manage workplace privacy compliance and employee access
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privacyManagementFeatures.map((feature, index) => (
              <Link key={index} to={feature.link} className="group">
                <div className="bg-card rounded-lg border p-6 h-full transition-all duration-300 hover:shadow-lg group-hover:border-primary-300 text-center hover:-translate-y-1">
                  <div className="p-4 bg-white dark:bg-gray-700 rounded-lg w-fit mb-6 mx-auto shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => handleNavigation('/privacy')}
            >
              View Full Privacy Portal <Database className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>


      {/* Recent Privacy Activity */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg border p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold flex items-center">
                <Clock className="h-6 w-6 mr-3 text-blue-600" />
                Recent Privacy Portal Activity
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleNavigation('/privacy/dashboard')}
              >
                View All Activity <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {isLoading ? (
                // Loading state
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start justify-between p-6 border rounded-lg animate-pulse">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-full"></div>
                        <div className="flex items-center gap-3">
                          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start justify-between p-6 border rounded-lg hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {activity.type === 'data_request' ? (
                          <FileText className="h-5 w-5 text-blue-500" />
                        ) : activity.type === 'consent' ? (
                          <Users className="h-5 w-5 text-green-500" />
                        ) : activity.type === 'incident' ? (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Building className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground mb-1">{activity.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{activity.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                          <Badge className={`text-xs px-2 py-1 ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            activity.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            activity.status === 'investigating' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                          }`}>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Empty state
                <div className="col-span-2 text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Recent Activity</h3>
                  <p className="text-gray-500 dark:text-gray-400">Recent privacy activities will appear here once you start using the platform.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 rounded-lg p-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Take Control of Your Workplace Privacy Today
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-3xl mx-auto">
            Whether you're exercising your data rights, fulfilling privacy duties, or managing workplace compliance, our self-service portal makes privacy management simple and accessible.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm"
              onClick={() => handleNavigation('/data-rights')}
            >
              Exercise Your Rights <Eye className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              className="font-medium bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm"
              onClick={() => handleNavigation('/stakeholder-duties')}
            >
              View My Privacy Duties <UserCheck className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-blue-100 text-sm mb-4">
              Questions about your privacy rights or duties?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                size="sm" 
                className="bg-transparent border border-white/60 text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
                onClick={() => handleNavigation('/contact')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Privacy Team
              </Button>
              <Button 
                size="sm" 
                className="bg-transparent border border-white/60 text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
                onClick={() => handleNavigation('/how-it-works')}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                How It Works
              </Button>
              <Button 
                size="sm" 
                className="bg-transparent border border-white/60 text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
                onClick={() => handleNavigation('/faq')}
              >
                <Info className="h-4 w-4 mr-2" />
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}