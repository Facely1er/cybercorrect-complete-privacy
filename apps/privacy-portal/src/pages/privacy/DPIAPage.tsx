import React, { useState } from 'react';
import { 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { localStorageService } from '../../services/localStorageService';

interface DPIA {
  id: string;
  title: string;
  description: string;
  processingActivity: string;
  dataController: string;
  dataProcessor: string;
  status: 'draft' | 'in_progress' | 'review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  createdDate: string;
  dueDate: string;
  lastUpdated: string;
  assessor: string;
  reviewer: string;
  dataSubjects: string[];
  dataTypes: string[];
  purposes: string[];
  legalBasis: string[];
  retentionPeriod: string;
  dataSources: string[];
  recipients: string[];
  transfers: {
    country: string;
    adequacy: boolean;
    safeguards: string[];
  }[];
  risks: {
    type: string;
    description: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
    residualRisk: 'low' | 'medium' | 'high';
  }[];
  measures: {
    technical: string[];
    organizational: string[];
    legal: string[];
  };
  consultation: {
    dpo: boolean;
    stakeholders: boolean;
    public: boolean;
    authorities: boolean;
  };
  approval: {
    dpo: boolean;
    management: boolean;
    legal: boolean;
    date: string;
  };
  nextReview: string;
}

export function DPIAPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');

  // Get real data from localStorage
  const [dpias] = useState<DPIA[]>(() => 
    localStorageService.getItem('dpias', [])
  );

  const filteredDpias = dpias.filter(dpia => {
    const matchesStatus = selectedStatus === 'all' || dpia.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || dpia.priority === selectedPriority;
    const matchesRisk = selectedRisk === 'all' || dpia.riskLevel === selectedRisk;
    return matchesStatus && matchesPriority && matchesRisk;
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

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Critical Risk</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Low Risk</Badge>;
      default:
        return <Badge variant="general">{risk}</Badge>;
    }
  };


  // Calculate metrics
  const totalDpias = dpias.length;
  const completedDpias = dpias.filter(d => d.status === 'approved').length;
  const inProgressDpias = dpias.filter(d => d.status === 'in_progress' || d.status === 'review').length;
  const highRiskDpias = dpias.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Protection Impact Assessment (DPIA)</h1>
        <p className="text-muted-foreground">
          Assess and manage privacy risks for high-risk data processing activities
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold">{totalDpias}</span>
              </div>
              <h3 className="font-semibold mb-1">Total DPIAs</h3>
              <p className="text-sm text-muted-foreground">Impact assessments</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {completedDpias}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Completed</h3>
              <p className="text-sm text-muted-foreground">Approved assessments</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {inProgressDpias}
                </span>
              </div>
              <h3 className="font-semibold mb-1">In Progress</h3>
              <p className="text-sm text-muted-foreground">Under assessment</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {highRiskDpias}
                </span>
              </div>
              <h3 className="font-semibold mb-1">High Risk</h3>
              <p className="text-sm text-muted-foreground">Require attention</p>
            </div>
          </div>

          {/* DPIA Status Distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              DPIA Status Distribution
            </h2>
            <div className="space-y-4">
              {['draft', 'in_progress', 'review', 'approved', 'rejected'].map((status) => {
                const count = dpias.filter(d => d.status === status).length;
                const percentage = totalDpias > 0 ? Math.round((count / totalDpias) * 100) : 0;
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusBadge(status)}
                        <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {count} DPIAs ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status === 'approved' ? 'bg-green-500' :
                          status === 'review' ? 'bg-blue-500' :
                          status === 'in_progress' ? 'bg-amber-500' :
                          status === 'draft' ? 'bg-gray-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent DPIAs */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent DPIAs</h2>
            <div className="space-y-4">
              {dpias.slice(0, 3).map((dpia) => (
                <div key={dpia.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{dpia.title}</h3>
                      {getStatusBadge(dpia.status)}
                      {getPriorityBadge(dpia.priority)}
                      {getRiskBadge(dpia.riskLevel)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Processing Activity:</span>
                        <div>{dpia.processingActivity}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessor:</span>
                        <div>{dpia.assessor}</div>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <div>{dpia.dueDate}</div>
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
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Risk</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
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
                  New DPIA
                </Button>
              </div>
            </div>
          </div>

          {/* DPIAs List */}
          <div className="space-y-4">
            {filteredDpias.map((dpia) => (
              <div key={dpia.id} className="bg-white dark:bg-gray-900 rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{dpia.title}</h3>
                      {getStatusBadge(dpia.status)}
                      {getPriorityBadge(dpia.priority)}
                      {getRiskBadge(dpia.riskLevel)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{dpia.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Processing Activity:</span>
                        <div className="text-muted-foreground">{dpia.processingActivity}</div>
                      </div>
                      <div>
                        <span className="font-medium">Data Controller:</span>
                        <div className="text-muted-foreground">{dpia.dataController}</div>
                      </div>
                      <div>
                        <span className="font-medium">Assessor:</span>
                        <div className="text-muted-foreground">{dpia.assessor}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Created:</span>
                        <div className="text-muted-foreground">{dpia.createdDate}</div>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <div className="text-muted-foreground">{dpia.dueDate}</div>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <div className="text-muted-foreground">{dpia.lastUpdated}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Data Types:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {dpia.dataTypes.slice(0, 5).map((type, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {type}
                          </span>
                        ))}
                        {dpia.dataTypes.length > 5 && (
                          <span className="text-xs text-muted-foreground">
                            +{dpia.dataTypes.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Purposes:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {dpia.purposes.map((purpose, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {purpose}
                          </span>
                        ))}
                      </div>
                    </div>

                    {dpia.risks.length > 0 && (
                      <div className="mb-4">
                        <span className="font-medium text-sm">Identified Risks:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {dpia.risks.slice(0, 3).map((risk, index) => (
                            <span key={index} className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded">
                              {risk.type}
                            </span>
                          ))}
                          {dpia.risks.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{dpia.risks.length - 3} more risks
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

        <TabsContent value="risks" className="space-y-6">
          {/* Risk Analysis Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Risk Analysis Overview
            </h2>
            <div className="space-y-6">
              {dpias.map((dpia) => (
                <div key={dpia.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{dpia.title}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        {getRiskBadge(dpia.riskLevel)}
                        <span className="text-sm text-muted-foreground">
                          {dpia.risks.length} identified risks
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {dpia.risks.length > 0 && (
                    <div className="space-y-3">
                      {dpia.risks.map((risk, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{risk.type}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={
                                risk.likelihood === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                risk.likelihood === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }>
                                {risk.likelihood} likelihood
                              </Badge>
                              <Badge className={
                                risk.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                risk.impact === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }>
                                {risk.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                          <div className="text-sm">
                            <span className="font-medium">Mitigation:</span>
                            <span className="text-muted-foreground ml-2">{risk.mitigation}</span>
                          </div>
                          <div className="text-sm mt-1">
                            <span className="font-medium">Residual Risk:</span>
                            <Badge className={
                              risk.residualRisk === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              risk.residualRisk === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }>
                              {risk.residualRisk}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Risk Matrix */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Risk Matrix</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Impact</div>
                <div className="space-y-1">
                  <div className="text-xs text-red-600 dark:text-red-400">High</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400">Medium</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Low</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-2">High Likelihood</div>
                <div className="space-y-1">
                  <div className="h-6 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-xs flex items-center justify-center text-red-800 dark:text-red-300">Critical</div>
                  <div className="h-6 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-xs flex items-center justify-center text-red-800 dark:text-red-300">High</div>
                  <div className="h-6 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded text-xs flex items-center justify-center text-amber-800 dark:text-amber-300">Medium</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Medium Likelihood</div>
                <div className="space-y-1">
                  <div className="h-6 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-xs flex items-center justify-center text-red-800 dark:text-red-300">High</div>
                  <div className="h-6 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded text-xs flex items-center justify-center text-amber-800 dark:text-amber-300">Medium</div>
                  <div className="h-6 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded text-xs flex items-center justify-center text-green-800 dark:text-green-300">Low</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-2">Low Likelihood</div>
                <div className="space-y-1">
                  <div className="h-6 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded text-xs flex items-center justify-center text-amber-800 dark:text-amber-300">Medium</div>
                  <div className="h-6 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded text-xs flex items-center justify-center text-green-800 dark:text-green-300">Low</div>
                  <div className="h-6 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded text-xs flex items-center justify-center text-green-800 dark:text-green-300">Low</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* DPIA Templates */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">DPIA Templates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Standard DPIA', description: 'General purpose DPIA template', category: 'general' },
                { name: 'AI/ML Processing', description: 'DPIA for artificial intelligence and machine learning', category: 'ai' },
                { name: 'Biometric Data', description: 'Specialized DPIA for biometric data processing', category: 'biometric' },
                { name: 'Health Data', description: 'DPIA for health and medical data processing', category: 'health' },
                { name: 'Children\'s Data', description: 'DPIA for processing children\'s personal data', category: 'children' },
                { name: 'Cross-Border Transfer', description: 'DPIA for international data transfers', category: 'transfer' }
              ].map((template, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="info" className="capitalize">
                      {template.category}
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

          {/* DPIA Checklist */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">DPIA Checklist</h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium">1. Description of Processing</h3>
                <div className="space-y-2">
                  {[
                    'Nature of personal data being processed',
                    'Purposes of processing',
                    'Categories of data subjects',
                    'Retention periods',
                    'Data sources'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">2. Necessity and Proportionality</h3>
                <div className="space-y-2">
                  {[
                    'Processing is necessary for stated purpose',
                    'Data minimization is applied',
                    'Proportionality assessment completed',
                    'Alternative approaches considered'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">3. Risk Assessment</h3>
                <div className="space-y-2">
                  {[
                    'Risks to data subjects identified',
                    'Likelihood and impact assessed',
                    'Mitigation measures defined',
                    'Residual risk acceptable'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-6">
          {/* When DPIA is Required */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">When is a DPIA Required?</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  Mandatory DPIAs
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Systematic monitoring of individuals on a large scale</li>
                  <li>Processing of special categories of personal data on a large scale</li>
                  <li>Processing of personal data relating to criminal convictions</li>
                  <li>Systematic monitoring of publicly accessible areas on a large scale</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  Recommended DPIAs
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Use of new technologies or innovative solutions</li>
                  <li>Processing that could result in physical harm</li>
                  <li>Processing involving vulnerable data subjects</li>
                  <li>Processing that could prevent data subjects from exercising their rights</li>
                </ul>
              </div>
            </div>
          </div>

          {/* DPIA Process */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">DPIA Process Steps</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Identify Need', description: 'Determine if DPIA is required or recommended' },
                { step: '2', title: 'Describe Processing', description: 'Document the nature, scope, and purposes of processing' },
                { step: '3', title: 'Assess Necessity', description: 'Evaluate necessity and proportionality of processing' },
                { step: '4', title: 'Identify Risks', description: 'Identify and assess risks to data subjects' },
                { step: '5', title: 'Identify Measures', description: 'Identify measures to address identified risks' },
                { step: '6', title: 'Consult Stakeholders', description: 'Consult with DPO, stakeholders, and data subjects' },
                { step: '7', title: 'Document and Approve', description: 'Document findings and obtain necessary approvals' },
                { step: '8', title: 'Monitor and Review', description: 'Monitor implementation and review regularly' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Risk Assessment</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use structured risk assessment methodology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Consider both likelihood and impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Document all assumptions and reasoning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Review and update regularly</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Documentation</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Keep detailed records of all decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Include stakeholder input and feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Make documentation accessible to relevant parties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Version control and change tracking</span>
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