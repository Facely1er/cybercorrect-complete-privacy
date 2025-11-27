import React, { useState } from 'react';
import { 
  Shield,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  Target,
  Database,
  Settings,
  FileText,
  Award
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { localStorageService } from '../../services/localStorageService';

interface PrivacyByDesignAssessment {
  id: string;
  name: string;
  description: string;
  systemType: 'new_system' | 'existing_system' | 'process' | 'service';
  status: 'draft' | 'in_progress' | 'completed' | 'needs_review';
  assessmentDate: string;
  assessor: string;
  overallScore: number;
  principles: {
    proactive: { score: number; notes: string; };
    default: { score: number; notes: string; };
    embedded: { score: number; notes: string; };
    full: { score: number; notes: string; };
    end_to_end: { score: number; notes: string; };
    visibility: { score: number; notes: string; };
    respect: { score: number; notes: string; };
  };
  recommendations: string[];
  nextReviewDate: string;
  complianceStatus: 'compliant' | 'needs_improvement' | 'non_compliant';
}

interface PrivacyPrinciple {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  weight: number;
}

export function PrivacyByDesignPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCompliance, setSelectedCompliance] = useState('all');

  // Get real data from localStorage
  const [assessments] = useState<PrivacyByDesignAssessment[]>(() => 
    localStorageService.getItem('privacy_by_design_assessments', [])
  );

  const filteredAssessments = assessments.filter(assessment => {
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus;
    const matchesCompliance = selectedCompliance === 'all' || assessment.complianceStatus === selectedCompliance;
    return matchesStatus && matchesCompliance;
  });

  const privacyPrinciples: PrivacyPrinciple[] = [
    {
      id: 'proactive',
      name: 'Proactive not Reactive',
      description: 'Anticipate and prevent privacy-invasive events before they happen',
      criteria: [
        'Privacy risks are identified and addressed at the design stage',
        'Preventive measures are implemented rather than reactive ones',
        'Privacy impact is considered before system deployment',
        'Regular privacy risk assessments are conducted'
      ],
      weight: 15
    },
    {
      id: 'default',
      name: 'Privacy as the Default',
      description: 'Ensure that personal data is automatically protected in any given IT system or business practice',
      criteria: [
        'Privacy settings are set to the most protective by default',
        'Data minimization is implemented by default',
        'Consent is not assumed but explicitly obtained',
        'Only necessary data is collected and processed'
      ],
      weight: 20
    },
    {
      id: 'embedded',
      name: 'Privacy Embedded into Design',
      description: 'Privacy is built into the system architecture and design',
      criteria: [
        'Privacy controls are integrated into system architecture',
        'Data protection measures are built into the system',
        'Privacy considerations are part of the design process',
        'Technical and organizational measures are implemented'
      ],
      weight: 15
    },
    {
      id: 'full',
      name: 'Full Functionality',
      description: 'Ensure that all legitimate interests and objectives are met',
      criteria: [
        'System functionality is not compromised by privacy measures',
        'Business objectives are achieved while protecting privacy',
        'Privacy and functionality are balanced appropriately',
        'All stakeholders benefit from the implementation'
      ],
      weight: 10
    },
    {
      id: 'end_to_end',
      name: 'End-to-End Security',
      description: 'Ensure complete lifecycle protection of personal data',
      criteria: [
        'Data is protected throughout its entire lifecycle',
        'Secure data transmission and storage',
        'Secure data deletion and disposal',
        'Regular security assessments and updates'
      ],
      weight: 15
    },
    {
      id: 'visibility',
      name: 'Visibility and Transparency',
      description: 'Ensure that all stakeholders can verify compliance',
      criteria: [
        'Privacy practices are transparent and documented',
        'Data subjects can understand how their data is used',
        'Privacy policies are clear and accessible',
        'Regular reporting on privacy compliance'
      ],
      weight: 15
    },
    {
      id: 'respect',
      name: 'Respect for User Privacy',
      description: 'Keep the interests of the individual paramount',
      criteria: [
        'User privacy preferences are respected',
        'Data subjects have control over their data',
        'User rights are easily exercisable',
        'Privacy is treated as a fundamental right'
      ],
      weight: 10
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">In Progress</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Draft</Badge>;
      case 'needs_review':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Needs Review</Badge>;
      default:
        return <Badge variant="general">{status}</Badge>;
    }
  };

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Compliant</Badge>;
      case 'needs_improvement':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Needs Improvement</Badge>;
      case 'non_compliant':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Non-Compliant</Badge>;
      default:
        return <Badge variant="general">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (score >= 60) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  // Calculate metrics
  const totalAssessments = assessments.length;
  const completedAssessments = assessments.filter(a => a.status === 'completed').length;
  const compliantAssessments = assessments.filter(a => a.complianceStatus === 'compliant').length;
  const averageScore = assessments.length > 0 
    ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy by Design</h1>
        <p className="text-muted-foreground">
          Evaluate and ensure privacy is built into systems and processes from the ground up
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="principles">Principles</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold">{totalAssessments}</span>
              </div>
              <h3 className="font-semibold mb-1">Total Assessments</h3>
              <p className="text-sm text-muted-foreground">Privacy by design evaluations</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {completedAssessments}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Completed</h3>
              <p className="text-sm text-muted-foreground">Finished assessments</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {compliantAssessments}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Compliant</h3>
              <p className="text-sm text-muted-foreground">Meeting requirements</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {averageScore}%
                </span>
              </div>
              <h3 className="font-semibold mb-1">Average Score</h3>
              <p className="text-sm text-muted-foreground">Overall compliance rating</p>
            </div>
          </div>

          {/* Privacy Principles Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Privacy by Design Principles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {privacyPrinciples.map((principle) => (
                <div key={principle.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium">{principle.name}</h3>
                    <Badge variant="info">{principle.weight}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{principle.description}</p>
                  <div className="space-y-2">
                    {principle.criteria.slice(0, 2).map((criterion, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{criterion}</span>
                      </div>
                    ))}
                    {principle.criteria.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{principle.criteria.length - 2} more criteria
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Assessments</h2>
            <div className="space-y-4">
              {assessments.slice(0, 3).map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{assessment.name}</h3>
                      {getStatusBadge(assessment.status)}
                      {getComplianceBadge(assessment.complianceStatus)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">System Type:</span>
                        <div className="capitalize">{assessment.systemType.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessor:</span>
                        <div>{assessment.assessor}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessment Date:</span>
                        <div>{assessment.assessmentDate}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${getScoreColor(assessment.overallScore)}`}>
                        {assessment.overallScore}%
                      </div>
                      <Badge className={getScoreBadge(assessment.overallScore)}>
                        {assessment.overallScore >= 80 ? 'Excellent' : 
                         assessment.overallScore >= 60 ? 'Good' : 'Needs Work'}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="needs_review">Needs Review</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedCompliance}
                  onChange={(e) => setSelectedCompliance(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Compliance</option>
                  <option value="compliant">Compliant</option>
                  <option value="needs_improvement">Needs Improvement</option>
                  <option value="non_compliant">Non-Compliant</option>
                </select>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </div>
            </div>
          </div>

          {/* Assessments List */}
          <div className="space-y-4">
            {filteredAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-white dark:bg-gray-900 rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{assessment.name}</h3>
                      {getStatusBadge(assessment.status)}
                      {getComplianceBadge(assessment.complianceStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">System Type:</span>
                        <div className="text-muted-foreground capitalize">{assessment.systemType.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessor:</span>
                        <div className="text-muted-foreground">{assessment.assessor}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessment Date:</span>
                        <div className="text-muted-foreground">{assessment.assessmentDate}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Recommendations:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {assessment.recommendations.slice(0, 3).map((rec, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {rec}
                          </span>
                        ))}
                        {assessment.recommendations.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{assessment.recommendations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(assessment.overallScore)}`}>
                        {assessment.overallScore}%
                      </div>
                      <Badge className={getScoreBadge(assessment.overallScore)}>
                        {assessment.overallScore >= 80 ? 'Excellent' : 
                         assessment.overallScore >= 60 ? 'Good' : 'Needs Work'}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="principles" className="space-y-6">
          {/* Detailed Principles Assessment */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Privacy by Design Principles Assessment</h2>
            <div className="space-y-6">
              {privacyPrinciples.map((principle) => (
                <div key={principle.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{principle.name}</h3>
                      <p className="text-muted-foreground mb-3">{principle.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="info">Weight: {principle.weight}%</Badge>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {principle.criteria.length} Criteria
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Assessment Criteria:</h4>
                    {principle.criteria.map((criterion, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300 text-primary" />
                          <span className="text-sm font-medium">{index + 1}.</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{criterion}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Assessment Notes</h4>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      placeholder="Add your assessment notes and observations..."
                    />
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Score (0-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-20 px-3 py-2 border border-input rounded-md bg-background text-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Save Assessment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Assessment Templates */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Assessment Templates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'New System Assessment', description: 'Comprehensive assessment for new systems', type: 'new_system' },
                { name: 'Existing System Review', description: 'Review of current systems for privacy compliance', type: 'existing_system' },
                { name: 'Process Assessment', description: 'Assessment of business processes for privacy', type: 'process' },
                { name: 'Service Evaluation', description: 'Evaluation of third-party services', type: 'service' },
                { name: 'Mobile App Assessment', description: 'Specialized assessment for mobile applications', type: 'new_system' },
                { name: 'Cloud Service Review', description: 'Assessment of cloud-based services', type: 'service' }
              ].map((template, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="info" className="capitalize">
                      {template.type.replace('_', ' ')}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Choose Assessment Type</h3>
                  <p className="text-sm text-muted-foreground">Select the appropriate template for your system or process</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Complete Assessment</h3>
                  <p className="text-sm text-muted-foreground">Evaluate each privacy principle against your system</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Review Results</h3>
                  <p className="text-sm text-muted-foreground">Analyze scores and implement recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-6">
          {/* Implementation Guidance */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Implementation Guidance</h2>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  Proactive Privacy Measures
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Implement privacy controls before any privacy-invasive events occur
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Conduct privacy impact assessments during design phase</li>
                  <li>Implement data minimization by default</li>
                  <li>Establish privacy training for development teams</li>
                  <li>Create privacy checklists for system development</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-green-500" />
                  Default Privacy Settings
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ensure the most privacy-protective settings are enabled by default
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Set data collection to minimum necessary</li>
                  <li>Enable privacy controls by default</li>
                  <li>Implement opt-in rather than opt-out for data processing</li>
                  <li>Provide clear privacy notices and choices</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-purple-500" />
                  Embedded Privacy Controls
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Build privacy into the system architecture and design
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Integrate privacy controls into system architecture</li>
                  <li>Implement technical privacy measures (encryption, access controls)</li>
                  <li>Design for data portability and deletion</li>
                  <li>Create privacy-aware user interfaces</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Technical Measures</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Implement end-to-end encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use privacy-preserving technologies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Implement data anonymization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Regular security assessments</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Organizational Measures</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Privacy training for all staff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Clear privacy policies and procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Regular privacy audits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Privacy by design governance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}