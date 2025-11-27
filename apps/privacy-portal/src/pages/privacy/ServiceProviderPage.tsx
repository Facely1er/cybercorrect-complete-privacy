import React, { useState } from 'react';
import { 
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Download,
  BarChart3,
  Target,
  Building,
  Database,
  Shield,
  Award,
  Mail
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { localStorageService } from '../../services/localStorageService';

interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  category: 'cloud' | 'analytics' | 'marketing' | 'payment' | 'communication' | 'security' | 'other';
  status: 'active' | 'pending' | 'expired' | 'terminated' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dataTypes: string[];
  dataVolume: 'low' | 'medium' | 'high';
  dataSensitivity: 'low' | 'medium' | 'high' | 'critical';
  contactInfo: {
    primary: string;
    email: string;
    phone: string;
    address: string;
  };
  agreement: {
    type: 'DPA' | 'BAA' | 'SLA' | 'MSA' | 'Custom';
    status: 'draft' | 'under_review' | 'approved' | 'expired' | 'terminated';
    startDate: string;
    endDate: string;
    renewalDate: string;
    lastReview: string;
    nextReview: string;
    version: string;
    documentUrl: string;
  };
  compliance: {
    gdpr: boolean;
    ccpa: boolean;
    hipaa: boolean;
    ferpa: boolean;
    sox: boolean;
    pci: boolean;
    iso27001: boolean;
    soc2: boolean;
  };
  security: {
    encryption: boolean;
    accessControls: boolean;
    auditLogging: boolean;
    dataResidency: string;
    breachNotification: boolean;
    incidentResponse: boolean;
    regularAudits: boolean;
    certifications: string[];
  };
  dataProcessing: {
    purposes: string[];
    legalBasis: string[];
    retentionPeriod: string;
    dataMinimization: boolean;
    purposeLimitation: boolean;
    dataSubjectRights: boolean;
    crossBorderTransfers: boolean;
    adequacyDecision: boolean;
    transferMechanisms: string[];
  };
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    dataBreachRisk: 'low' | 'medium' | 'high' | 'critical';
    complianceRisk: 'low' | 'medium' | 'high' | 'critical';
    operationalRisk: 'low' | 'medium' | 'high' | 'critical';
    lastAssessment: string;
    nextAssessment: string;
  };
  monitoring: {
    lastAudit: string;
    nextAudit: string;
    auditFindings: number;
    resolvedFindings: number;
    complianceScore: number;
    performanceScore: number;
  };
  incidents: {
    total: number;
    resolved: number;
    open: number;
    lastIncident: string;
  };
  costs: {
    monthly: number;
    annual: number;
    setup: number;
    termination: number;
  };
  notes: string;
  createdDate: string;
  createdBy: string;
  lastUpdated: string;
  updatedBy: string;
}

export function ServiceProviderPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');

  // Get real data from localStorage
  const [serviceProviders] = useState<ServiceProvider[]>(() => 
    localStorageService.getItem('service_providers', [])
  );

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || provider.status === selectedStatus;
    const matchesRisk = selectedRisk === 'all' || provider.riskAssessment.overallRisk === selectedRisk;
    return matchesCategory && matchesStatus && matchesRisk;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Pending</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Expired</Badge>;
      case 'terminated':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Terminated</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Under Review</Badge>;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cloud':
        return <Database className="h-5 w-5 text-blue-500" />;
      case 'analytics':
        return <BarChart3 className="h-5 w-5 text-purple-500" />;
      case 'marketing':
        return <Target className="h-5 w-5 text-orange-500" />;
      case 'payment':
        return <Award className="h-5 w-5 text-green-500" />;
      case 'communication':
        return <Mail className="h-5 w-5 text-cyan-500" />;
      case 'security':
        return <Shield className="h-5 w-5 text-red-500" />;
      default:
        return <Building className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAgreementBadge = (type: string) => {
    switch (type) {
      case 'DPA':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">DPA</Badge>;
      case 'BAA':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">BAA</Badge>;
      case 'SLA':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">SLA</Badge>;
      case 'MSA':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">MSA</Badge>;
      case 'Custom':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Custom</Badge>;
      default:
        return <Badge variant="general">{type}</Badge>;
    }
  };

  // Calculate metrics
  const totalProviders = serviceProviders.length;
  const activeProviders = serviceProviders.filter(p => p.status === 'active').length;
  const expiredAgreements = serviceProviders.filter(p => p.agreement.status === 'expired').length;
  const averageComplianceScore = serviceProviders.length > 0 
    ? Math.round(serviceProviders.reduce((sum, p) => sum + p.monitoring.complianceScore, 0) / serviceProviders.length)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Service Provider Management</h1>
        <p className="text-muted-foreground">
          Manage third-party service providers and their data processing agreements
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold">{totalProviders}</span>
              </div>
              <h3 className="font-semibold mb-1">Total Providers</h3>
              <p className="text-sm text-muted-foreground">Service providers</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {activeProviders}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Active</h3>
              <p className="text-sm text-muted-foreground">Currently active</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {expiredAgreements}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Expired</h3>
              <p className="text-sm text-muted-foreground">Agreements expired</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {averageComplianceScore}%
                </span>
              </div>
              <h3 className="font-semibold mb-1">Avg Compliance</h3>
              <p className="text-sm text-muted-foreground">Overall compliance score</p>
            </div>
          </div>

          {/* Provider Categories */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Provider Categories
            </h2>
            <div className="space-y-4">
              {[
                { category: 'cloud', count: serviceProviders.filter(p => p.category === 'cloud').length, color: 'blue' },
                { category: 'analytics', count: serviceProviders.filter(p => p.category === 'analytics').length, color: 'purple' },
                { category: 'marketing', count: serviceProviders.filter(p => p.category === 'marketing').length, color: 'orange' },
                { category: 'payment', count: serviceProviders.filter(p => p.category === 'payment').length, color: 'green' },
                { category: 'communication', count: serviceProviders.filter(p => p.category === 'communication').length, color: 'cyan' },
                { category: 'security', count: serviceProviders.filter(p => p.category === 'security').length, color: 'red' }
              ].map((item) => {
                const percentage = totalProviders > 0 ? Math.round((item.count / totalProviders) * 100) : 0;
                
                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(item.category)}
                        <span className="font-medium capitalize">{item.category}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.count} providers ({percentage}%)
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

          {/* High Risk Providers */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              High Risk Providers
            </h2>
            <div className="space-y-4">
              {serviceProviders
                .filter(p => p.riskAssessment.overallRisk === 'high' || p.riskAssessment.overallRisk === 'critical')
                .slice(0, 3)
                .map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{provider.name}</h3>
                        {getStatusBadge(provider.status)}
                        {getPriorityBadge(provider.priority)}
                        {getRiskBadge(provider.riskAssessment.overallRisk)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Category:</span>
                          <div className="capitalize">{provider.category}</div>
                        </div>
                        <div>
                          <span className="font-medium">Compliance Score:</span>
                          <div>{provider.monitoring.complianceScore}%</div>
                        </div>
                        <div>
                          <span className="font-medium">Last Assessment:</span>
                          <div>{provider.riskAssessment.lastAssessment}</div>
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

        <TabsContent value="providers" className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="cloud">Cloud</option>
                  <option value="analytics">Analytics</option>
                  <option value="marketing">Marketing</option>
                  <option value="payment">Payment</option>
                  <option value="communication">Communication</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>
              <div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </div>
            </div>
          </div>

          {/* Providers List */}
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="bg-white dark:bg-gray-900 rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{provider.name}</h3>
                      {getStatusBadge(provider.status)}
                      {getPriorityBadge(provider.priority)}
                      {getRiskBadge(provider.riskAssessment.overallRisk)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{provider.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Category:</span>
                        <div className="text-muted-foreground capitalize">{provider.category}</div>
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span>
                        <div className="text-muted-foreground">{provider.contactInfo.primary}</div>
                      </div>
                      <div>
                        <span className="font-medium">Agreement Type:</span>
                        <div className="text-muted-foreground">{getAgreementBadge(provider.agreement.type)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Data Sensitivity:</span>
                        <div className="text-muted-foreground capitalize">{provider.dataSensitivity}</div>
                      </div>
                      <div>
                        <span className="font-medium">Compliance Score:</span>
                        <div className="text-muted-foreground">{provider.monitoring.complianceScore}%</div>
                      </div>
                      <div>
                        <span className="font-medium">Last Audit:</span>
                        <div className="text-muted-foreground">{provider.monitoring.lastAudit}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Data Types:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {provider.dataTypes.slice(0, 5).map((type, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {type}
                          </span>
                        ))}
                        {provider.dataTypes.length > 5 && (
                          <span className="text-xs text-muted-foreground">
                            +{provider.dataTypes.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Compliance:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(provider.compliance)
                          .filter(([, value]) => value)
                          .map(([key]) => (
                            <Badge key={key} variant="info">
                              {key.toUpperCase()}
                            </Badge>
                          ))}
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
        </TabsContent>

        <TabsContent value="agreements" className="space-y-6">
          {/* Agreement Management */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Agreement Management</h2>
            <div className="space-y-4">
              {serviceProviders.map((provider) => (
                <div key={provider.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{provider.name}</h3>
                        {getAgreementBadge(provider.agreement.type)}
                        {getStatusBadge(provider.agreement.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Start Date:</span>
                          <div>{provider.agreement.startDate}</div>
                        </div>
                        <div>
                          <span className="font-medium">End Date:</span>
                          <div>{provider.agreement.endDate}</div>
                        </div>
                        <div>
                          <span className="font-medium">Last Review:</span>
                          <div>{provider.agreement.lastReview}</div>
                        </div>
                        <div>
                          <span className="font-medium">Next Review:</span>
                          <div>{provider.agreement.nextReview}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Agreement
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

          {/* Agreement Templates */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Agreement Templates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Data Processing Agreement (DPA)', type: 'DPA', description: 'Standard GDPR-compliant DPA template' },
                { name: 'Business Associate Agreement (BAA)', type: 'BAA', description: 'HIPAA-compliant BAA template' },
                { name: 'Service Level Agreement (SLA)', type: 'SLA', description: 'Performance and availability SLA template' },
                { name: 'Master Service Agreement (MSA)', type: 'MSA', description: 'Comprehensive service agreement template' },
                { name: 'Custom Agreement', type: 'Custom', description: 'Customizable agreement template' }
              ].map((template, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    {getAgreementBadge(template.type)}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Compliance Overview</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { regulation: 'GDPR', count: serviceProviders.filter(p => p.compliance.gdpr).length, total: totalProviders },
                  { regulation: 'CCPA', count: serviceProviders.filter(p => p.compliance.ccpa).length, total: totalProviders },
                  { regulation: 'HIPAA', count: serviceProviders.filter(p => p.compliance.hipaa).length, total: totalProviders },
                  { regulation: 'FERPA', count: serviceProviders.filter(p => p.compliance.ferpa).length, total: totalProviders }
                ].map((item) => {
                  const percentage = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                  
                  return (
                    <div key={item.regulation} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">{item.regulation}</h3>
                      <div className="text-2xl font-bold mb-1">{item.count}</div>
                      <div className="text-sm text-muted-foreground">
                        {percentage}% of providers
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Compliance Details */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Compliance Details</h2>
            <div className="space-y-4">
              {serviceProviders.map((provider) => (
                <div key={provider.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{provider.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Compliance Score:</span>
                          <div>{provider.monitoring.complianceScore}%</div>
                        </div>
                        <div>
                          <span className="font-medium">Last Audit:</span>
                          <div>{provider.monitoring.lastAudit}</div>
                        </div>
                        <div>
                          <span className="font-medium">Audit Findings:</span>
                          <div>{provider.monitoring.auditFindings} total, {provider.monitoring.resolvedFindings} resolved</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          {/* Risk Assessment Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Risk Assessment Overview</h2>
            <div className="space-y-4">
              {serviceProviders.map((provider) => (
                <div key={provider.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{provider.name}</h3>
                        {getRiskBadge(provider.riskAssessment.overallRisk)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Data Breach Risk:</span>
                          <div>{getRiskBadge(provider.riskAssessment.dataBreachRisk)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Compliance Risk:</span>
                          <div>{getRiskBadge(provider.riskAssessment.complianceRisk)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Operational Risk:</span>
                          <div>{getRiskBadge(provider.riskAssessment.operationalRisk)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Last Assessment:</span>
                          <div>{provider.riskAssessment.lastAssessment}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Assessment
                      </Button>
                    </div>
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