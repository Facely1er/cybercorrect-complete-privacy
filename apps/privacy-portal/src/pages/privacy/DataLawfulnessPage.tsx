import React, { useState } from 'react';
import { 
  Scale,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  Target,
  Building,
  Award,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { localStorageService } from '../../services/localStorageService';

interface LawfulnessAssessment {
  id: string;
  title: string;
  description: string;
  processingActivity: string;
  dataController: string;
  dataProcessor: string;
  status: 'draft' | 'in_progress' | 'review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdDate: string;
  dueDate: string;
  lastUpdated: string;
  assessor: string;
  reviewer: string;
  dataSubjects: string[];
  dataTypes: string[];
  purposes: string[];
  legalBasis: {
    primary: string;
    secondary: string[];
    justification: string;
    documentation: string[];
  };
  necessity: {
    purpose: string;
    dataMinimization: boolean;
    proportionality: boolean;
    alternatives: string[];
    justification: string;
  };
  consent: {
    required: boolean;
    obtained: boolean;
    valid: boolean;
    specific: boolean;
    informed: boolean;
    unambiguous: boolean;
    freelyGiven: boolean;
    withdrawable: boolean;
    documentation: string[];
  };
  legitimateInterest: {
    applicable: boolean;
    purpose: string;
    necessity: boolean;
    balancing: {
      dataSubjectInterests: string;
      controllerInterests: string;
      assessment: string;
      conclusion: string;
    };
    documentation: string[];
  };
  contract: {
    applicable: boolean;
    necessity: boolean;
    performance: boolean;
    documentation: string[];
  };
  legalObligation: {
    applicable: boolean;
    legalBasis: string;
    necessity: boolean;
    documentation: string[];
  };
  vitalInterests: {
    applicable: boolean;
    necessity: boolean;
    documentation: string[];
  };
  publicTask: {
    applicable: boolean;
    legalBasis: string;
    necessity: boolean;
    documentation: string[];
  };
  complianceStatus: 'compliant' | 'needs_improvement' | 'non_compliant';
  recommendations: string[];
  nextReview: string;
}

export function DataLawfulnessPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBasis, setSelectedBasis] = useState('all');
  const [selectedCompliance, setSelectedCompliance] = useState('all');

  // Get real data from localStorage
  const [assessments] = useState<LawfulnessAssessment[]>(() => 
    localStorageService.getItem('lawfulness_assessments', [])
  );

  const filteredAssessments = assessments.filter(assessment => {
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus;
    const matchesBasis = selectedBasis === 'all' || assessment.legalBasis.primary === selectedBasis;
    const matchesCompliance = selectedCompliance === 'all' || assessment.complianceStatus === selectedCompliance;
    return matchesStatus && matchesBasis && matchesCompliance;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Approved</Badge>;
      case 'review':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Under Review</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">In Progress</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Draft</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Rejected</Badge>;
      default:
        return <Badge variant="general">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Low</Badge>;
      default:
        return <Badge variant="general">{priority}</Badge>;
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

  const getBasisBadge = (basis: string) => {
    switch (basis) {
      case 'consent':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Consent</Badge>;
      case 'contract':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Contract</Badge>;
      case 'legal_obligation':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Legal Obligation</Badge>;
      case 'vital_interests':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Vital Interests</Badge>;
      case 'public_task':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">Public Task</Badge>;
      case 'legitimate_interests':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Legitimate Interests</Badge>;
      default:
        return <Badge variant="general">{basis}</Badge>;
    }
  };

  // Calculate metrics
  const totalAssessments = assessments.length;
  const completedAssessments = assessments.filter(a => a.status === 'approved').length;
  const compliantAssessments = assessments.filter(a => a.complianceStatus === 'compliant').length;
  const consentBased = assessments.filter(a => a.legalBasis.primary === 'consent').length;
  const legitimateInterestBased = assessments.filter(a => a.legalBasis.primary === 'legitimate_interests').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Processing Lawfulness Assessment</h1>
        <p className="text-muted-foreground">
          Evaluate and document the legal basis for data processing activities
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="legal_basis">Legal Basis</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold">{totalAssessments}</span>
              </div>
              <h3 className="font-semibold mb-1">Total Assessments</h3>
              <p className="text-sm text-muted-foreground">Lawfulness evaluations</p>
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
              <p className="text-sm text-muted-foreground">Approved assessments</p>
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
                  {consentBased}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Consent-Based</h3>
              <p className="text-sm text-muted-foreground">Based on consent</p>
            </div>
          </div>

          {/* Legal Basis Distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Legal Basis Distribution
            </h2>
            <div className="space-y-4">
              {[
                { basis: 'consent', count: consentBased, color: 'blue' },
                { basis: 'legitimate_interests', count: legitimateInterestBased, color: 'amber' },
                { basis: 'contract', count: assessments.filter(a => a.legalBasis.primary === 'contract').length, color: 'green' },
                { basis: 'legal_obligation', count: assessments.filter(a => a.legalBasis.primary === 'legal_obligation').length, color: 'purple' },
                { basis: 'vital_interests', count: assessments.filter(a => a.legalBasis.primary === 'vital_interests').length, color: 'red' },
                { basis: 'public_task', count: assessments.filter(a => a.legalBasis.primary === 'public_task').length, color: 'orange' }
              ].map((item) => {
                const percentage = totalAssessments > 0 ? Math.round((item.count / totalAssessments) * 100) : 0;
                
                return (
                  <div key={item.basis} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getBasisBadge(item.basis)}
                        <span className="font-medium capitalize">{item.basis.replace('_', ' ')}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.count} assessments ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 bg-${item.color}-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
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
                      <h3 className="font-medium">{assessment.title}</h3>
                      {getStatusBadge(assessment.status)}
                      {getPriorityBadge(assessment.priority)}
                      {getBasisBadge(assessment.legalBasis.primary)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Processing Activity:</span>
                        <div>{assessment.processingActivity}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessor:</span>
                        <div>{assessment.assessor}</div>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <div>{assessment.dueDate}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedBasis}
                  onChange={(e) => setSelectedBasis(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Legal Basis</option>
                  <option value="consent">Consent</option>
                  <option value="contract">Contract</option>
                  <option value="legal_obligation">Legal Obligation</option>
                  <option value="vital_interests">Vital Interests</option>
                  <option value="public_task">Public Task</option>
                  <option value="legitimate_interests">Legitimate Interests</option>
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
                      <h3 className="font-semibold text-lg">{assessment.title}</h3>
                      {getStatusBadge(assessment.status)}
                      {getPriorityBadge(assessment.priority)}
                      {getBasisBadge(assessment.legalBasis.primary)}
                      {getComplianceBadge(assessment.complianceStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Processing Activity:</span>
                        <div className="text-muted-foreground">{assessment.processingActivity}</div>
                      </div>
                      <div>
                        <span className="font-medium">Data Controller:</span>
                        <div className="text-muted-foreground">{assessment.dataController}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessor:</span>
                        <div className="text-muted-foreground">{assessment.assessor}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Created:</span>
                        <div className="text-muted-foreground">{assessment.createdDate}</div>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <div className="text-muted-foreground">{assessment.dueDate}</div>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <div className="text-muted-foreground">{assessment.lastUpdated}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Legal Basis Justification:</span>
                      <div className="text-sm text-muted-foreground mt-1">{assessment.legalBasis.justification}</div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Purposes:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {assessment.purposes.map((purpose, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {purpose}
                          </span>
                        ))}
                      </div>
                    </div>

                    {assessment.recommendations.length > 0 && (
                      <div className="mb-4">
                        <span className="font-medium text-sm">Recommendations:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {assessment.recommendations.slice(0, 3).map((rec, index) => (
                            <span key={index} className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
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
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="legal_basis" className="space-y-6">
          {/* Legal Basis Assessment Framework */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Legal Basis Assessment Framework</h2>
            <div className="space-y-6">
              {/* Consent */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Consent
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Data subject has given clear, specific, informed, and unambiguous consent
                </p>
                <div className="space-y-2">
                  {[
                    'Consent is freely given',
                    'Consent is specific to the purpose',
                    'Consent is informed and unambiguous',
                    'Consent can be withdrawn at any time',
                    'Consent is documented and verifiable'
                  ].map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Contract
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Processing is necessary for the performance of a contract
                </p>
                <div className="space-y-2">
                  {[
                    'Processing is necessary for contract performance',
                    'Data subject is party to the contract',
                    'Processing is reasonably expected',
                    'Contract terms are clear and fair'
                  ].map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legitimate Interests */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-amber-500" />
                  Legitimate Interests
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Processing is necessary for legitimate interests, subject to balancing test
                </p>
                <div className="space-y-2">
                  {[
                    'Legitimate interest is identified and documented',
                    'Processing is necessary for the purpose',
                    'Balancing test has been conducted',
                    'Data subject interests do not override',
                    'Appropriate safeguards are in place'
                  ].map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Obligation */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Scale className="h-5 w-5 mr-2 text-purple-500" />
                  Legal Obligation
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Processing is necessary for compliance with a legal obligation
                </p>
                <div className="space-y-2">
                  {[
                    'Legal obligation is clearly identified',
                    'Processing is necessary for compliance',
                    'Legal basis is documented',
                    'Obligation is binding on the controller'
                  ].map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vital Interests */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Vital Interests
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Processing is necessary to protect vital interests of data subject or another person
                </p>
                <div className="space-y-2">
                  {[
                    'Vital interest is clearly identified',
                    'Processing is necessary to protect life',
                    'Consent cannot be obtained',
                    'Processing is proportionate to the risk'
                  ].map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Public Task */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-orange-500" />
                  Public Task
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Processing is necessary for the performance of a task in the public interest
                </p>
                <div className="space-y-2">
                  {[
                    'Public task is clearly identified',
                    'Processing is necessary for the task',
                    'Legal basis is documented',
                    'Task is in the public interest'
                  ].map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Assessment Templates */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Assessment Templates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Consent-Based Processing', description: 'Template for consent-based data processing', basis: 'consent' },
                { name: 'Contract Performance', description: 'Template for contract-based processing', basis: 'contract' },
                { name: 'Legitimate Interests', description: 'Template for legitimate interests assessment', basis: 'legitimate_interests' },
                { name: 'Legal Obligation', description: 'Template for legal obligation processing', basis: 'legal_obligation' },
                { name: 'Vital Interests', description: 'Template for vital interests processing', basis: 'vital_interests' },
                { name: 'Public Task', description: 'Template for public task processing', basis: 'public_task' }
              ].map((template, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    {getBasisBadge(template.basis)}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Assessment Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Assessment Guide</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Identify Purpose</h3>
                  <p className="text-sm text-muted-foreground">Clearly define why you need to process personal data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Determine Legal Basis</h3>
                  <p className="text-sm text-muted-foreground">Choose the most appropriate legal basis for your processing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Assess Necessity</h3>
                  <p className="text-sm text-muted-foreground">Ensure processing is necessary and proportionate</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Document Justification</h3>
                  <p className="text-sm text-muted-foreground">Document your legal basis and justification clearly</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-6">
          {/* Legal Basis Guidance */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Legal Basis Guidance</h2>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Consent Requirements
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Must be freely given, specific, informed, and unambiguous</li>
                  <li>Must be as easy to withdraw as to give</li>
                  <li>Must be documented and verifiable</li>
                  <li>Cannot be a condition for service provision unless necessary</li>
                  <li>Must be renewed if processing purposes change</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-amber-500" />
                  Legitimate Interests Test
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Identify the legitimate interest</li>
                  <li>Demonstrate necessity for the purpose</li>
                  <li>Conduct balancing test against data subject interests</li>
                  <li>Consider data subject's reasonable expectations</li>
                  <li>Implement appropriate safeguards</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Contract Performance
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Processing must be necessary for contract performance</li>
                  <li>Data subject must be party to the contract</li>
                  <li>Processing must be reasonably expected</li>
                  <li>Contract terms must be clear and fair</li>
                  <li>Cannot extend beyond contract performance</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Documentation</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Document legal basis for each processing activity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Keep records of consent and withdrawals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Regular review and update of legal basis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Train staff on legal basis requirements</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Compliance</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Regular audits of legal basis compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Monitor changes in applicable law</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Implement privacy by design principles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Maintain data subject rights procedures</span>
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