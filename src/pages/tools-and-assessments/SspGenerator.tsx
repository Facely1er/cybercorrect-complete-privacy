import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft, Shield, CheckCircle, FileText, Database, Lock, AlertTriangle, 
  Info, Download, Network, Server, Users, Table, Building, Fingerprint,
  Plus, Save, Edit3, Trash2, Upload, Eye, EyeOff, Copy, ChevronDown,
  ChevronRight, Calendar, User, Clock, Settings, Tag, Loader2, Search,
  FileDown, FileUp, CheckSquare, Square, AlertCircle, TrendingUp,
  BarChart3, Layers, GitBranch, Share2, History, RefreshCw, Zap,
  BookOpen, MessageSquare, Star, Archive, Filter, SortAsc, X
} from 'lucide-react';

import { toast } from '../../components/ui/Toaster';
interface SSPSection {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'complete' | 'review';
  lastModified: string;
  modifiedBy: string;
  content: any;
  validation?: {
    errors: string[];
    warnings: string[];
  };
}

interface Control {
  id: string;
  family: string;
  title: string;
  description: string;
  implementation: {
    status: 'implemented' | 'partially-implemented' | 'planned' | 'not-applicable' | 'alternative';
    description: string;
    responsibleParty: string;
    implementationDate?: string;
    evidence?: Evidence[];
    gaps?: string[];
    compensatingControls?: string[];
  };
  relatedPOAMs?: string[];
  lastAssessed?: string;
  assessedBy?: string;
  notes?: string;
}

interface Evidence {
  id: string;
  type: 'document' | 'screenshot' | 'report' | 'config' | 'other';
  name: string;
  description: string;
  uploadDate: string;
  uploadedBy: string;
  url?: string;
  tags?: string[];
}

interface SystemInfo {
  name: string;
  identifier: string;
  owner: string;
  type: string;
  description: string;
  authorizationStatus: string;
  authorizationDate?: string;
  categorization: {
    confidentiality: 'low' | 'moderate' | 'high';
    integrity: 'low' | 'moderate' | 'high';
    availability: 'low' | 'moderate' | 'high';
  };
  boundaries: {
    description: string;
    diagram?: string;
  };
}

interface SSPTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: 'small' | 'medium' | 'large';
  sections: Partial<SSPSection>[];
  controls: Partial<Control>[];
}

interface SSPMetrics {
  totalControls: number;
  implementedControls: number;
  partiallyImplementedControls: number;
  plannedControls: number;
  notApplicableControls: number;
  alternativeControls: number;
  completionPercentage: number;
  sectionsComplete: number;
  totalSections: number;
  lastUpdated: string;
  nextReviewDate: string;
}

// NIST 800-171 Control Families
const CONTROL_FAMILIES = [
  { id: 'AC', name: 'Access Control', icon: Lock, controlCount: 22 },
  { id: 'AT', name: 'Awareness & Training', icon: Users, controlCount: 3 },
  { id: 'AU', name: 'Audit & Accountability', icon: Table, controlCount: 9 },
  { id: 'CM', name: 'Configuration Management', icon: Settings, controlCount: 9 },
  { id: 'IA', name: 'Identification & Authentication', icon: Fingerprint, controlCount: 11 },
  { id: 'IR', name: 'Incident Response', icon: AlertTriangle, controlCount: 3 },
  { id: 'MA', name: 'Maintenance', icon: Server, controlCount: 6 },
  { id: 'MP', name: 'Media Protection', icon: Database, controlCount: 9 },
  { id: 'PS', name: 'Personnel Security', icon: Users, controlCount: 2 },
  { id: 'PE', name: 'Physical Protection', icon: Building, controlCount: 6 },
  { id: 'RA', name: 'Risk Assessment', icon: Shield, controlCount: 3 },
  { id: 'CA', name: 'Security Assessment', icon: CheckCircle, controlCount: 4 },
  { id: 'SC', name: 'System & Communications Protection', icon: Network, controlCount: 16 },
  { id: 'SI', name: 'System & Information Integrity', icon: Shield, controlCount: 7 }
];

// Sample SSP sections
const DEFAULT_SECTIONS: SSPSection[] = [
  {
    id: 'system-info',
    title: 'System Information',
    description: 'Basic information about the system',
    status: 'not-started',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    content: {}
  },
  {
    id: 'system-environment',
    title: 'System Environment',
    description: 'Network architecture and system boundaries',
    status: 'not-started',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    content: {}
  },
  {
    id: 'roles-responsibilities',
    title: 'Roles & Responsibilities',
    description: 'Security roles and personnel responsibilities',
    status: 'not-started',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    content: {}
  },
  {
    id: 'security-controls',
    title: 'Security Controls Implementation',
    description: 'Detailed implementation of NIST 800-171 controls',
    status: 'not-started',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    content: {}
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'System risk assessment and analysis',
    status: 'not-started',
    lastModified: new Date().toISOString(),
    modifiedBy: 'System',
    content: {}
  }
];

const SspGenerator = () => {
  // Load from localStorage
  const loadFromStorage = (key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // State management
  const [sspSections, setSspSections] = useState<SSPSection[]>(() => 
    loadFromStorage('ssp_sections', DEFAULT_SECTIONS)
  );
  
  const [systemInfo, setSystemInfo] = useState<SystemInfo>(() => 
    loadFromStorage('ssp_system_info', {
      name: '',
      identifier: '',
      owner: '',
      type: '',
      description: '',
      authorizationStatus: 'In Process',
      categorization: {
        confidentiality: 'moderate',
        integrity: 'moderate',
        availability: 'moderate'
      },
      boundaries: {
        description: ''
      }
    })
  );
  
  const [controls, setControls] = useState<Control[]>(() => 
    loadFromStorage('ssp_controls', [])
  );
  
  const [activeSection, setActiveSection] = useState('system-info');
  const [editingControl, setEditingControl] = useState<Control | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFamily, setFilterFamily] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(new Date().toISOString());
  const [showEvidence, setShowEvidence] = useState(false);
  const [selectedControl, setSelectedControl] = useState<string | null>(null);
  
  // Sample templates
  const [templates] = useState<SSPTemplate[]>([
    {
      id: 'small-business',
      name: 'Small Business SSP',
      description: 'Template for small businesses with basic IT infrastructure',
      industry: 'General',
      size: 'small',
      sections: [],
      controls: []
    },
    {
      id: 'defense-contractor',
      name: 'Defense Contractor SSP',
      description: 'Comprehensive template for defense contractors',
      industry: 'Defense',
      size: 'large',
      sections: [],
      controls: []
    }
  ]);
  
  // Save to localStorage
  useEffect(() => {
    if (autoSaveEnabled) {
      localStorage.setItem('ssp_sections', JSON.stringify(sspSections));
      localStorage.setItem('ssp_system_info', JSON.stringify(systemInfo));
      localStorage.setItem('ssp_controls', JSON.stringify(controls));
      setLastSaved(new Date().toISOString());
    }
  }, [sspSections, systemInfo, controls, autoSaveEnabled]);
  
  // Initialize controls if empty
  useEffect(() => {
    if (controls.length === 0) {
      initializeControls();
    }
  }, []);
  
  // Initialize all NIST 800-171 controls
  const initializeControls = () => {
    const allControls: Control[] = [];
    
    // Sample controls for each family
    const sampleControls = {
      'AC': [
        { id: '3.1.1', title: 'Limit information system access' },
        { id: '3.1.2', title: 'Limit information system access to authorized transactions' },
        { id: '3.1.3', title: 'Control the flow of CUI' },
        { id: '3.1.4', title: 'Separate duties of individuals' },
        { id: '3.1.5', title: 'Employ least privilege' }
      ],
      'IA': [
        { id: '3.5.1', title: 'Identify information system users' },
        { id: '3.5.2', title: 'Authenticate users' },
        { id: '3.5.3', title: 'Use multifactor authentication' }
      ],
      'SC': [
        { id: '3.13.1', title: 'Monitor communications at system boundaries' },
        { id: '3.13.8', title: 'Implement cryptographic mechanisms' }
      ]
    };
    
    Object.entries(sampleControls).forEach(([family, familyControls]) => {
      familyControls.forEach(control => {
        allControls.push({
          id: control.id,
          family,
          title: control.title,
          description: `Implementation of NIST 800-171 control ${control.id}`,
          implementation: {
            status: 'planned',
            description: '',
            responsibleParty: '',
            evidence: []
          }
        });
      });
    });
    
    setControls(allControls);
  };
  
  // Calculate metrics
  const calculateMetrics = (): SSPMetrics => {
    const statusCounts = controls.reduce((acc, control) => {
      acc[control.implementation.status] = (acc[control.implementation.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const completedSections = sspSections.filter(s => s.status === 'complete').length;
    
    const totalImplemented = (statusCounts['implemented'] || 0) + (statusCounts['alternative'] || 0);
    const completionPercentage = controls.length > 0 
      ? Math.round((totalImplemented / controls.length) * 100)
      : 0;
    
    return {
      totalControls: controls.length,
      implementedControls: statusCounts['implemented'] || 0,
      partiallyImplementedControls: statusCounts['partially-implemented'] || 0,
      plannedControls: statusCounts['planned'] || 0,
      notApplicableControls: statusCounts['not-applicable'] || 0,
      alternativeControls: statusCounts['alternative'] || 0,
      completionPercentage,
      sectionsComplete: completedSections,
      totalSections: sspSections.length,
      lastUpdated: lastSaved,
      nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
  };
  
  // Update section status
  const updateSectionStatus = (sectionId: string, status: SSPSection['status']) => {
    setSspSections(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              status, 
              lastModified: new Date().toISOString(),
              modifiedBy: 'Current User'
            }
          : section
      )
    );
  };
  
  // Update control implementation
  const updateControl = (updatedControl: Control) => {
    setControls(controls.map(c => 
      c.id === updatedControl.id 
        ? {
            ...updatedControl,
            lastAssessed: new Date().toISOString(),
            assessedBy: 'Current User'
          }
        : c
    ));
    setEditingControl(null);
  };
  
  // Add evidence to control
  const addEvidence = (controlId: string, evidence: Evidence) => {
    setControls(controls.map(control => 
      control.id === controlId
        ? {
            ...control,
            implementation: {
              ...control.implementation,
              evidence: [...(control.implementation.evidence || []), evidence]
            }
          }
        : control
    ));
  };
  
  // Export SSP
  const exportSSP = async (format: 'pdf' | 'word' | 'json') => {
    setIsExporting(true);
    
    try {
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0',
          organization: systemInfo.owner || 'Your Organization',
          systemName: systemInfo.name,
          classification: 'CUI'
        },
        systemInfo,
        sections: sspSections,
        controls,
        metrics: calculateMetrics()
      };
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        downloadFile(blob, `SSP-${systemInfo.identifier || 'draft'}-${new Date().toISOString().split('T')[0]}.json`);
      } else if (format === 'pdf') {
        // In production, use a PDF library like jsPDF
        alert('PDF export would generate a professionally formatted SSP document');
      } else if (format === 'word') {
        // In production, use a library to generate DOCX
        alert('Word export would create an editable SSP document');
      }
    } finally {
      setIsExporting(false);
    }
  };
  
  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Filter controls
  const filteredControls = controls.filter(control => {
    const matchesSearch = searchQuery === '' || 
      control.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFamily = filterFamily === '' || control.family === filterFamily;
    const matchesStatus = filterStatus === '' || control.implementation.status === filterStatus;
    
    return matchesSearch && matchesFamily && matchesStatus;
  });
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'implemented': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'partially-implemented': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'planned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'not-applicable': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'alternative': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'complete': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'review': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'not-started': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const metrics = calculateMetrics();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">System Security Plan (SSP) Generator</h1>
            <p className="text-muted-foreground">
              Generate NIST SP 800-171 compliant System Security Plans efficiently
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDashboard(!showDashboard)}
              className="relative"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
              {metrics.completionPercentage < 100 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full"></span>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
              <Layers className="mr-2 h-4 w-4" />
              Templates
            </Button>
            <div className="relative">
              <Button 
                variant="outline"
                onClick={() => document.getElementById('export-menu')?.classList.toggle('hidden')}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export SSP
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <div id="export-menu" className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={() => exportSSP('pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={() => exportSSP('word')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as Word
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={() => exportSSP('json')}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export as JSON
                </button>
              </div>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save SSP
              {autoSaveEnabled && (
                <span className="ml-2 text-xs">Auto-save on</span>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dashboard */}
      {showDashboard && (
        <Card className="mb-6 animate-in fade-in slide-in-from-top-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>SSP Completion Dashboard</span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Last saved: {new Date(lastSaved).toLocaleString()}
                </span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  Auto-save
                </label>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <p className="text-2xl font-bold">{metrics.completionPercentage}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500 opacity-50" />
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Implemented Controls</p>
                    <p className="text-2xl font-bold">{metrics.implementedControls}</p>
                    <p className="text-xs text-muted-foreground">of {metrics.totalControls}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sections Complete</p>
                    <p className="text-2xl font-bold">{metrics.sectionsComplete}</p>
                    <p className="text-xs text-muted-foreground">of {metrics.totalSections}</p>
                  </div>
                  <FileText className="h-8 w-8 text-yellow-500 opacity-50" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next Review</p>
                    <p className="text-lg font-bold">
                      {new Date(metrics.nextReviewDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500 opacity-50" />
                </div>
              </div>
            </div>
            
            {/* Control status breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Control Implementation Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Implemented</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(metrics.implementedControls / metrics.totalControls) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{metrics.implementedControls}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Partially Implemented</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: `${(metrics.partiallyImplementedControls / metrics.totalControls) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{metrics.partiallyImplementedControls}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Planned</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(metrics.plannedControls / metrics.totalControls) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{metrics.plannedControls}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alternative Implementation</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(metrics.alternativeControls / metrics.totalControls) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{metrics.alternativeControls}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Section Completion Status</h4>
                <div className="space-y-2">
                  {sspSections.map(section => (
                    <div key={section.id} className="flex items-center justify-between">
                      <span className="text-sm truncate">{section.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(section.status)}`}>
                        {section.status.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SSP Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1 p-2">
                {sspSections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.title}</span>
                      {section.status === 'complete' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {section.status === 'in-progress' && (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      {section.status === 'review' && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
          
          {/* Quick actions */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Controls
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Version History
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share for Review
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Version
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          {activeSection === 'system-info' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>System Information</span>
                  <Button 
                    size="sm"
                    onClick={() => updateSectionStatus('system-info', 'complete')}
                  >
                    Mark Complete
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">System Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border py-2 px-3 text-sm"
                      value={systemInfo.name}
                      onChange={(e) => setSystemInfo({...systemInfo, name: e.target.value})}
                      placeholder="Enter system name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">System Identifier</label>
                    <input
                      type="text"
                      className="w-full rounded-md border py-2 px-3 text-sm"
                      value={systemInfo.identifier}
                      onChange={(e) => setSystemInfo({...systemInfo, identifier: e.target.value})}
                      placeholder="e.g., SYS-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">System Owner</label>
                    <input
                      type="text"
                      className="w-full rounded-md border py-2 px-3 text-sm"
                      value={systemInfo.owner}
                      onChange={(e) => setSystemInfo({...systemInfo, owner: e.target.value})}
                      placeholder="Organization or individual"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">System Type</label>
                    <select
                      className="w-full rounded-md border py-2 px-3 text-sm"
                      value={systemInfo.type}
                      onChange={(e) => setSystemInfo({...systemInfo, type: e.target.value})}
                    >
                      <option value="">Select system type</option>
                      <option value="major">Major Application</option>
                      <option value="general">General Support System</option>
                      <option value="minor">Minor Application</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">System Description</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border py-2 px-3 text-sm"
                      value={systemInfo.description}
                      onChange={(e) => setSystemInfo({...systemInfo, description: e.target.value})}
                      placeholder="Describe the system's purpose and functionality"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Authorization Status</label>
                    <select
                      className="w-full rounded-md border py-2 px-3 text-sm"
                      value={systemInfo.authorizationStatus}
                      onChange={(e) => setSystemInfo({...systemInfo, authorizationStatus: e.target.value})}
                    >
                      <option value="In Process">In Process</option>
                      <option value="Authorized">Authorized</option>
                      <option value="Denied">Denied</option>
                      <option value="Revoked">Revoked</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Authorization Date</label>
                    <input
                      type="date"
                      className="w-full rounded-md border py-2 px-3 text-sm"
                      value={systemInfo.authorizationDate || ''}
                      onChange={(e) => setSystemInfo({...systemInfo, authorizationDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium mb-3">System Categorization (FIPS 199)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Confidentiality</label>
                        <select
                          className="w-full rounded-md border py-1.5 px-3 text-sm"
                          value={systemInfo.categorization.confidentiality}
                          onChange={(e) => setSystemInfo({
                            ...systemInfo,
                            categorization: {
                              ...systemInfo.categorization,
                              confidentiality: e.target.value as any
                            }
                          })}
                        >
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Integrity</label>
                        <select
                          className="w-full rounded-md border py-1.5 px-3 text-sm"
                          value={systemInfo.categorization.integrity}
                          onChange={(e) => setSystemInfo({
                            ...systemInfo,
                            categorization: {
                              ...systemInfo.categorization,
                              integrity: e.target.value as any
                            }
                          })}
                        >
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1">Availability</label>
                        <select
                          className="w-full rounded-md border py-1.5 px-3 text-sm"
                          value={systemInfo.categorization.availability}
                          onChange={(e) => setSystemInfo({
                            ...systemInfo,
                            categorization: {
                              ...systemInfo.categorization,
                              availability: e.target.value as any
                            }
                          })}
                        >
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">System Boundary Description</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border py-2 px-3 text-sm"
                      value={systemInfo.boundaries.description}
                      onChange={(e) => setSystemInfo({
                        ...systemInfo,
                        boundaries: {
                          ...systemInfo.boundaries,
                          description: e.target.value
                        }
                      })}
                      placeholder="Describe the system boundaries and what is included/excluded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeSection === 'security-controls' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Controls Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search and filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search controls..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md"
                    />
                  </div>
                  
                  <select
                    value={filterFamily}
                    onChange={(e) => setFilterFamily(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                  >
                    <option value="">All Families</option>
                    {CONTROL_FAMILIES.map(family => (
                      <option key={family.id} value={family.id}>{family.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                  >
                    <option value="">All Status</option>
                    <option value="implemented">Implemented</option>
                    <option value="partially-implemented">Partially Implemented</option>
                    <option value="planned">Planned</option>
                    <option value="not-applicable">Not Applicable</option>
                    <option value="alternative">Alternative</option>
                  </select>
                  
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </div>
                
                {/* Control families overview */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {CONTROL_FAMILIES.map(family => {
                    const familyControls = controls.filter(c => c.family === family.id);
                    const implemented = familyControls.filter(c => 
                      c.implementation.status === 'implemented' || 
                      c.implementation.status === 'alternative'
                    ).length;
                    
                    return (
                      <div 
                        key={family.id} 
                        className="border rounded-lg p-3 hover:bg-muted/20 cursor-pointer"
                        onClick={() => setFilterFamily(family.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <family.icon className="h-4 w-4 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            {implemented}/{family.controlCount}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium">{family.name}</h4>
                        <div className="mt-2 bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full"
                            style={{ width: `${(implemented / family.controlCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Controls list */}
                <div className="space-y-3">
                  {filteredControls.map(control => (
                    <div 
                      key={control.id} 
                      className="border rounded-lg p-4 hover:bg-muted/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm font-medium">{control.id}</span>
                            <span className="font-medium">{control.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              getStatusColor(control.implementation.status)
                            }`}>
                              {control.implementation.status.replace('-', ' ')}
                            </span>
                          </div>
                          
                          {control.implementation.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {control.implementation.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {control.implementation.responsibleParty && (
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {control.implementation.responsibleParty}
                              </span>
                            )}
                            {control.lastAssessed && (
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Assessed: {new Date(control.lastAssessed).toLocaleDateString()}
                              </span>
                            )}
                            {control.implementation.evidence && control.implementation.evidence.length > 0 && (
                              <span className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {control.implementation.evidence.length} evidence files
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedControl(control.id);
                              setShowEvidence(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Evidence
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingControl(control)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {control.implementation.gaps && control.implementation.gaps.length > 0 && (
                        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                          <h5 className="text-xs font-medium mb-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Identified Gaps
                          </h5>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {control.implementation.gaps.map((gap, index) => (
                              <li key={index}>• {gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Other sections would be implemented similarly */}
          {activeSection !== 'system-info' && activeSection !== 'security-controls' && (
            <Card>
              <CardHeader>
                <CardTitle>{sspSections.find(s => s.id === activeSection)?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Section Under Development</h3>
                  <p className="text-muted-foreground mb-4">
                    This section of the SSP is being developed. Content will be available soon.
                  </p>
                  <Button onClick={() => updateSectionStatus(activeSection, 'in-progress')}>
                    <Zap className="mr-2 h-4 w-4" />
                    Start Working on This Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Edit Control Modal */}
      {editingControl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Edit Control {editingControl.id}</span>
                <Button variant="ghost" size="sm" onClick={() => setEditingControl(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Implementation Status</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editingControl.implementation.status}
                    onChange={(e) => setEditingControl({
                      ...editingControl,
                      implementation: {
                        ...editingControl.implementation,
                        status: e.target.value as any
                      }
                    })}
                  >
                    <option value="implemented">Implemented</option>
                    <option value="partially-implemented">Partially Implemented</option>
                    <option value="planned">Planned</option>
                    <option value="not-applicable">Not Applicable</option>
                    <option value="alternative">Alternative Implementation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Implementation Description</label>
                  <textarea
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    value={editingControl.implementation.description}
                    onChange={(e) => setEditingControl({
                      ...editingControl,
                      implementation: {
                        ...editingControl.implementation,
                        description: e.target.value
                      }
                    })}
                    placeholder="Describe how this control is implemented in your environment"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Responsible Party</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={editingControl.implementation.responsibleParty}
                    onChange={(e) => setEditingControl({
                      ...editingControl,
                      implementation: {
                        ...editingControl.implementation,
                        responsibleParty: e.target.value
                      }
                    })}
                    placeholder="Person or team responsible"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Implementation Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={editingControl.implementation.implementationDate || ''}
                    onChange={(e) => setEditingControl({
                      ...editingControl,
                      implementation: {
                        ...editingControl.implementation,
                        implementationDate: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Identified Gaps</label>
                  <textarea
                    rows={2}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter gaps, one per line"
                    value={editingControl.implementation.gaps?.join('\n') || ''}
                    onChange={(e) => setEditingControl({
                      ...editingControl,
                      implementation: {
                        ...editingControl.implementation,
                        gaps: e.target.value.split('\n').filter(g => g.trim())
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Compensating Controls</label>
                  <textarea
                    rows={2}
                    className="w-full p-2 border rounded-md"
                    placeholder="Describe any compensating controls"
                    value={editingControl.implementation.compensatingControls?.join('\n') || ''}
                    onChange={(e) => setEditingControl({
                      ...editingControl,
                      implementation: {
                        ...editingControl.implementation,
                        compensatingControls: e.target.value.split('\n').filter(c => c.trim())
                      }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    rows={2}
                    className="w-full p-2 border rounded-md"
                    value={editingControl.notes || ''}
                    onChange={(e) => setEditingControl({
                      ...editingControl,
                      notes: e.target.value
                    })}
                    placeholder="Additional notes or context"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingControl(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => updateControl(editingControl)}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SspGenerator;