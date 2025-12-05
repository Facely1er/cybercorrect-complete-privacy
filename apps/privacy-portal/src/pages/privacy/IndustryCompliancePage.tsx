import React, { useState } from 'react';
import { 
  Building,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Target,
  Database,
  Award,
  Heart,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { localStorageService } from '../../services/localStorageService';

interface IndustryCompliance {
  id: string;
  title: string;
  description: string;
  industry: 'healthcare' | 'financial' | 'education' | 'government' | 'retail' | 'technology';
  regulation: 'HIPAA' | 'GLBA' | 'FERPA' | 'SOX' | 'PCI-DSS' | 'COPPA' | 'CCPA' | 'GDPR';
  status: 'compliant' | 'needs_review' | 'non_compliant' | 'in_progress';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastAssessment: string;
  nextAssessment: string;
  assessor: string;
  requirements: {
    administrative: string[];
    physical: string[];
    technical: string[];
  };
  controls: {
    implemented: number;
    total: number;
    percentage: number;
  };
  risks: {
    identified: number;
    mitigated: number;
    residual: number;
  };
  documentation: string[];
  training: {
    required: boolean;
    completed: boolean;
    lastTraining: string;
    nextTraining: string;
  };
  audit: {
    lastAudit: string;
    nextAudit: string;
    findings: number;
    resolved: number;
  };
}

export function IndustryCompliancePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Get real data from localStorage
  const [complianceRecords] = useState<IndustryCompliance[]>(() => 
    localStorageService.getItem('industry_compliance', [])
  );


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Compliant</Badge>;
      case 'needs_review':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Needs Review</Badge>;
      case 'non_compliant':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Non-Compliant</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">In Progress</Badge>;
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

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'healthcare':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'financial':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'education':
        return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case 'government':
        return <Building className="h-5 w-5 text-purple-500" />;
      case 'retail':
        return <Target className="h-5 w-5 text-orange-500" />;
      case 'technology':
        return <Database className="h-5 w-5 text-cyan-500" />;
      default:
        return <Building className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRegulationBadge = (regulation: string) => {
    switch (regulation) {
      case 'HIPAA':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">HIPAA</Badge>;
      case 'GLBA':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">GLBA</Badge>;
      case 'FERPA':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">FERPA</Badge>;
      case 'SOX':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">SOX</Badge>;
      case 'PCI-DSS':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">PCI-DSS</Badge>;
      case 'COPPA':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">COPPA</Badge>;
      case 'CCPA':
        return <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">CCPA</Badge>;
      case 'GDPR':
        return <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">GDPR</Badge>;
      default:
        return <Badge variant="general">{regulation}</Badge>;
    }
  };

  // Calculate metrics
  const totalRecords = complianceRecords.length;
  const compliantRecords = complianceRecords.filter(r => r.status === 'compliant').length;
  const needsReviewRecords = complianceRecords.filter(r => r.status === 'needs_review').length;
  const averageCompliance = complianceRecords.length > 0 
    ? Math.round(complianceRecords.reduce((sum, r) => sum + r.controls.percentage, 0) / complianceRecords.length)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Industry-Specific Compliance</h1>
        <p className="text-muted-foreground">
          Manage compliance with industry-specific privacy and security regulations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="other">Other Industries</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold">{totalRecords}</span>
              </div>
              <h3 className="font-semibold mb-1">Total Assessments</h3>
              <p className="text-sm text-muted-foreground">Industry compliance records</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {compliantRecords}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Compliant</h3>
              <p className="text-sm text-muted-foreground">Meeting requirements</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {needsReviewRecords}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Need Review</h3>
              <p className="text-sm text-muted-foreground">Require attention</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {averageCompliance}%
                </span>
              </div>
              <h3 className="font-semibold mb-1">Avg Compliance</h3>
              <p className="text-sm text-muted-foreground">Overall compliance rate</p>
            </div>
          </div>

          {/* Industry Distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Industry Distribution
            </h2>
            <div className="space-y-4">
              {[
                { industry: 'healthcare', count: complianceRecords.filter(r => r.industry === 'healthcare').length, color: 'red' },
                { industry: 'financial', count: complianceRecords.filter(r => r.industry === 'financial').length, color: 'green' },
                { industry: 'education', count: complianceRecords.filter(r => r.industry === 'education').length, color: 'blue' },
                { industry: 'government', count: complianceRecords.filter(r => r.industry === 'government').length, color: 'purple' },
                { industry: 'retail', count: complianceRecords.filter(r => r.industry === 'retail').length, color: 'orange' },
                { industry: 'technology', count: complianceRecords.filter(r => r.industry === 'technology').length, color: 'cyan' }
              ].map((item) => {
                const percentage = totalRecords > 0 ? Math.round((item.count / totalRecords) * 100) : 0;
                
                return (
                  <div key={item.industry} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIndustryIcon(item.industry)}
                        <span className="font-medium capitalize">{item.industry}</span>
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
              {complianceRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{record.title}</h3>
                      {getStatusBadge(record.status)}
                      {getPriorityBadge(record.priority)}
                      {getRegulationBadge(record.regulation)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Industry:</span>
                        <div className="capitalize">{record.industry}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessor:</span>
                        <div>{record.assessor}</div>
                      </div>
                      <div>
                        <span className="font-medium">Last Assessment:</span>
                        <div>{record.lastAssessment}</div>
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

        <TabsContent value="healthcare" className="space-y-6">
          {/* HIPAA Compliance */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              HIPAA Compliance
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">Administrative Safeguards</h3>
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                    <li>• Security Officer designation</li>
                    <li>• Workforce training</li>
                    <li>• Access management</li>
                    <li>• Information access management</li>
                    <li>• Security awareness training</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">Physical Safeguards</h3>
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                    <li>• Facility access controls</li>
                    <li>• Workstation use restrictions</li>
                    <li>• Device and media controls</li>
                    <li>• Workstation security</li>
                    <li>• Device and media disposal</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">Technical Safeguards</h3>
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                    <li>• Access control</li>
                    <li>• Audit controls</li>
                    <li>• Integrity controls</li>
                    <li>• Person or entity authentication</li>
                    <li>• Transmission security</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Healthcare Compliance Records */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Healthcare Compliance Records</h2>
            <div className="space-y-4">
              {complianceRecords
                .filter(r => r.industry === 'healthcare')
                .map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{record.title}</h3>
                          {getStatusBadge(record.status)}
                          {getPriorityBadge(record.priority)}
                          {getRegulationBadge(record.regulation)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{record.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Controls Implemented:</span>
                            <div className="text-muted-foreground">
                              {record.controls.implemented}/{record.controls.total} ({record.controls.percentage}%)
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Last Assessment:</span>
                            <div className="text-muted-foreground">{record.lastAssessment}</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Assessment:</span>
                            <div className="text-muted-foreground">{record.nextAssessment}</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="font-medium text-sm">Risks:</span>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-red-600 dark:text-red-400">
                              {record.risks.identified} Identified
                            </span>
                            <span className="text-amber-600 dark:text-amber-400">
                              {record.risks.mitigated} Mitigated
                            </span>
                            <span className="text-green-600 dark:text-green-400">
                              {record.risks.residual} Residual
                            </span>
                          </div>
                        </div>
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
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {/* GLBA Compliance */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              GLBA Compliance
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Safeguards Rule Requirements</h3>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>• Designate a security coordinator</li>
                    <li>• Conduct risk assessments</li>
                    <li>• Implement safeguards program</li>
                    <li>• Regular monitoring and testing</li>
                    <li>• Oversee service providers</li>
                    <li>• Adjust program as needed</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Privacy Rule Requirements</h3>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>• Provide privacy notices</li>
                    <li>• Honor opt-out requests</li>
                    <li>• Limit information sharing</li>
                    <li>• Maintain data security</li>
                    <li>• Train employees</li>
                    <li>• Monitor compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Compliance Records */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Compliance Records</h2>
            <div className="space-y-4">
              {complianceRecords
                .filter(r => r.industry === 'financial')
                .map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{record.title}</h3>
                          {getStatusBadge(record.status)}
                          {getPriorityBadge(record.priority)}
                          {getRegulationBadge(record.regulation)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{record.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Controls Implemented:</span>
                            <div className="text-muted-foreground">
                              {record.controls.implemented}/{record.controls.total} ({record.controls.percentage}%)
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Last Assessment:</span>
                            <div className="text-muted-foreground">{record.lastAssessment}</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Assessment:</span>
                            <div className="text-muted-foreground">{record.nextAssessment}</div>
                          </div>
                        </div>
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
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          {/* FERPA Compliance */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />
              FERPA Compliance
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Student Rights</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Right to inspect and review records</li>
                    <li>• Right to request amendment</li>
                    <li>• Right to consent to disclosures</li>
                    <li>• Right to file complaints</li>
                    <li>• Right to opt-out of directory information</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Institution Obligations</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Annual notification of rights</li>
                    <li>• Maintain confidentiality</li>
                    <li>• Provide access to records</li>
                    <li>• Honor opt-out requests</li>
                    <li>• Train staff on FERPA</li>
                    <li>• Maintain audit trails</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Education Compliance Records */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Education Compliance Records</h2>
            <div className="space-y-4">
              {complianceRecords
                .filter(r => r.industry === 'education')
                .map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{record.title}</h3>
                          {getStatusBadge(record.status)}
                          {getPriorityBadge(record.priority)}
                          {getRegulationBadge(record.regulation)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{record.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="font-medium">Controls Implemented:</span>
                            <div className="text-muted-foreground">
                              {record.controls.implemented}/{record.controls.total} ({record.controls.percentage}%)
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Last Assessment:</span>
                            <div className="text-muted-foreground">{record.lastAssessment}</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Assessment:</span>
                            <div className="text-muted-foreground">{record.nextAssessment}</div>
                          </div>
                        </div>
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
          </div>
        </TabsContent>

        <TabsContent value="other" className="space-y-6">
          {/* Other Industries */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Other Industry Regulations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'SOX Compliance', industry: 'government', regulation: 'SOX', description: 'Sarbanes-Oxley Act compliance for public companies' },
                { name: 'PCI-DSS Compliance', industry: 'retail', regulation: 'PCI-DSS', description: 'Payment Card Industry Data Security Standard' },
                { name: 'COPPA Compliance', industry: 'technology', regulation: 'COPPA', description: 'Children\'s Online Privacy Protection Act' },
                { name: 'CCPA Compliance', industry: 'retail', regulation: 'CCPA', description: 'California Consumer Privacy Act' },
                { name: 'GDPR Compliance', industry: 'technology', regulation: 'GDPR', description: 'General Data Protection Regulation' },
                { name: 'Custom Compliance', industry: 'other', regulation: 'Custom', description: 'Custom industry-specific requirements' }
              ].map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getIndustryIcon(item.industry)}
                      {getRegulationBadge(item.regulation)}
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}