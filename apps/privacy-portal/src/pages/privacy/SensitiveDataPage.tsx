import React, { useState } from 'react';
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Database,
  Lock,
  Award,
  Heart,
  Fingerprint
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { localStorageService } from '../../services/localStorageService';

interface SensitiveDataRecord {
  id: string;
  dataType: string;
  category: 'health' | 'financial' | 'biometric' | 'genetic' | 'political' | 'religious' | 'sexual' | 'criminal' | 'children' | 'location' | 'other';
  description: string;
  dataSubject: string;
  dataController: string;
  dataProcessor: string;
  collectionDate: string;
  lastAccessed: string;
  lastUpdated: string;
  retentionPeriod: string;
  legalBasis: string;
  purposes: string[];
  location: string;
  encryptionStatus: 'encrypted' | 'unencrypted' | 'partial';
  accessControls: {
    roleBased: boolean;
    multiFactor: boolean;
    timeRestricted: boolean;
    locationRestricted: boolean;
    auditLogging: boolean;
  };
  sharing: {
    internal: boolean;
    external: boolean;
    thirdParty: boolean;
    crossBorder: boolean;
    anonymized: boolean;
  };
  processing: {
    automated: boolean;
    profiling: boolean;
    decisionMaking: boolean;
    monitoring: boolean;
    tracking: boolean;
  };
  risks: {
    dataBreach: 'low' | 'medium' | 'high' | 'critical';
    unauthorizedAccess: 'low' | 'medium' | 'high' | 'critical';
    misuse: 'low' | 'medium' | 'high' | 'critical';
    loss: 'low' | 'medium' | 'high' | 'critical';
    overall: 'low' | 'medium' | 'high' | 'critical';
  };
  safeguards: {
    technical: string[];
    organizational: string[];
    legal: string[];
  };
  compliance: {
    gdpr: boolean;
    ccpa: boolean;
    hipaa: boolean;
    ferpa: boolean;
    other: string[];
  };
  incidents: {
    total: number;
    resolved: number;
    open: number;
    lastIncident: string;
  };
  status: 'active' | 'archived' | 'deleted' | 'anonymized' | 'under_review';
  lastReview: string;
  nextReview: string;
  notes: string;
  createdDate: string;
  createdBy: string;
  lastUpdated: string;
  updatedBy: string;
}

export function SensitiveDataPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Get real data from localStorage
  const [sensitiveDataRecords] = useState<SensitiveDataRecord[]>(() => 
    localStorageService.getItem('sensitive_data_records', [])
  );

  const filteredRecords = sensitiveDataRecords.filter(record => {
    const matchesCategory = selectedCategory === 'all' || record.category === selectedCategory;
    const matchesRisk = selectedRisk === 'all' || record.risks.overall === selectedRisk;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesCategory && matchesRisk && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">Archived</Badge>;
      case 'deleted':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Deleted</Badge>;
      case 'anonymized':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Anonymized</Badge>;
      case 'under_review':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Under Review</Badge>;
      default:
        return <Badge variant="general">{status}</Badge>;
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
      case 'health':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'financial':
        return <Award className="h-5 w-5 text-green-500" />;
      case 'biometric':
        return <Fingerprint className="h-5 w-5 text-purple-500" />;
      case 'genetic':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'political':
        return <Building className="h-5 w-5 text-orange-500" />;
      case 'religious':
        return <Target className="h-5 w-5 text-amber-500" />;
      case 'sexual':
        return <Shield className="h-5 w-5 text-pink-500" />;
      case 'criminal':
        return <Lock className="h-5 w-5 text-gray-500" />;
      case 'children':
        return <Users className="h-5 w-5 text-cyan-500" />;
      case 'location':
        return <Globe className="h-5 w-5 text-indigo-500" />;
      default:
        return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEncryptionBadge = (status: string) => {
    switch (status) {
      case 'encrypted':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Encrypted</Badge>;
      case 'unencrypted':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Unencrypted</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Partial</Badge>;
      default:
        return <Badge variant="general">{status}</Badge>;
    }
  };

  // Calculate metrics
  const totalRecords = sensitiveDataRecords.length;
  const activeRecords = sensitiveDataRecords.filter(r => r.status === 'active').length;
  const highRiskRecords = sensitiveDataRecords.filter(r => r.risks.overall === 'high' || r.risks.overall === 'critical').length;
  const encryptedRecords = sensitiveDataRecords.filter(r => r.encryptionStatus === 'encrypted').length;
  const totalIncidents = sensitiveDataRecords.reduce((sum, r) => sum + r.incidents.total, 0);
  const openIncidents = sensitiveDataRecords.reduce((sum, r) => sum + r.incidents.open, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sensitive Personal Information Handling</h1>
        <p className="text-muted-foreground">
          Manage and protect sensitive personal information with enhanced security measures
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Data Records</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="protection">Protection</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold">{totalRecords}</span>
              </div>
              <h3 className="font-semibold mb-1">Total Records</h3>
              <p className="text-sm text-muted-foreground">Sensitive data records</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {activeRecords}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Active</h3>
              <p className="text-sm text-muted-foreground">Currently processed</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {highRiskRecords}
                </span>
              </div>
              <h3 className="font-semibold mb-1">High Risk</h3>
              <p className="text-sm text-muted-foreground">Require attention</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {encryptedRecords}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Encrypted</h3>
              <p className="text-sm text-muted-foreground">Protected data</p>
            </div>
          </div>

          {/* Data Categories Distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Sensitive Data Categories
            </h2>
            <div className="space-y-4">
              {[
                { category: 'health', count: sensitiveDataRecords.filter(r => r.category === 'health').length, color: 'red' },
                { category: 'financial', count: sensitiveDataRecords.filter(r => r.category === 'financial').length, color: 'green' },
                { category: 'biometric', count: sensitiveDataRecords.filter(r => r.category === 'biometric').length, color: 'purple' },
                { category: 'genetic', count: sensitiveDataRecords.filter(r => r.category === 'genetic').length, color: 'blue' },
                { category: 'political', count: sensitiveDataRecords.filter(r => r.category === 'political').length, color: 'orange' },
                { category: 'religious', count: sensitiveDataRecords.filter(r => r.category === 'religious').length, color: 'amber' },
                { category: 'sexual', count: sensitiveDataRecords.filter(r => r.category === 'sexual').length, color: 'pink' },
                { category: 'criminal', count: sensitiveDataRecords.filter(r => r.category === 'criminal').length, color: 'gray' },
                { category: 'children', count: sensitiveDataRecords.filter(r => r.category === 'children').length, color: 'cyan' },
                { category: 'location', count: sensitiveDataRecords.filter(r => r.category === 'location').length, color: 'indigo' }
              ].map((item) => {
                const percentage = totalRecords > 0 ? Math.round((item.count / totalRecords) * 100) : 0;
                
                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(item.category)}
                        <span className="font-medium capitalize">{item.category}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.count} records ({percentage}%)
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

          {/* Risk Distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Risk Distribution
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">Critical Risk</h3>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {sensitiveDataRecords.filter(r => r.risks.overall === 'critical').length}
                </div>
                <div className="text-sm text-red-700 dark:text-red-400">
                  Immediate action required
                </div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h3 className="font-medium text-orange-800 dark:text-orange-300 mb-2">High Risk</h3>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {sensitiveDataRecords.filter(r => r.risks.overall === 'high').length}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-400">
                  Priority attention needed
                </div>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Medium Risk</h3>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {sensitiveDataRecords.filter(r => r.risks.overall === 'medium').length}
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-400">
                  Monitor closely
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Low Risk</h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {sensitiveDataRecords.filter(r => r.risks.overall === 'low').length}
                </div>
                <div className="text-sm text-green-700 dark:text-green-400">
                  Standard monitoring
                </div>
              </div>
            </div>
          </div>

          {/* Recent Records */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Sensitive Data Records</h2>
            <div className="space-y-4">
              {sensitiveDataRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{record.dataType}</h3>
                      {getStatusBadge(record.status)}
                      {getRiskBadge(record.risks.overall)}
                      {getEncryptionBadge(record.encryptionStatus)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Category:</span>
                        <div className="capitalize">{record.category}</div>
                      </div>
                      <div>
                        <span className="font-medium">Data Subject:</span>
                        <div>{record.dataSubject}</div>
                      </div>
                      <div>
                        <span className="font-medium">Last Accessed:</span>
                        <div>{record.lastAccessed}</div>
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

        <TabsContent value="records" className="space-y-6">
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
                  <option value="health">Health</option>
                  <option value="financial">Financial</option>
                  <option value="biometric">Biometric</option>
                  <option value="genetic">Genetic</option>
                  <option value="political">Political</option>
                  <option value="religious">Religious</option>
                  <option value="sexual">Sexual</option>
                  <option value="criminal">Criminal</option>
                  <option value="children">Children</option>
                  <option value="location">Location</option>
                  <option value="other">Other</option>
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
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="deleted">Deleted</option>
                  <option value="anonymized">Anonymized</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>
              <div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div key={record.id} className="bg-white dark:bg-gray-900 rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{record.dataType}</h3>
                      {getStatusBadge(record.status)}
                      {getRiskBadge(record.risks.overall)}
                      {getEncryptionBadge(record.encryptionStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{record.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Category:</span>
                        <div className="text-muted-foreground capitalize">{record.category}</div>
                      </div>
                      <div>
                        <span className="font-medium">Data Subject:</span>
                        <div className="text-muted-foreground">{record.dataSubject}</div>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <div className="text-muted-foreground">{record.location}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Collection Date:</span>
                        <div className="text-muted-foreground">{record.collectionDate}</div>
                      </div>
                      <div>
                        <span className="font-medium">Last Accessed:</span>
                        <div className="text-muted-foreground">{record.lastAccessed}</div>
                      </div>
                      <div>
                        <span className="font-medium">Retention Period:</span>
                        <div className="text-muted-foreground">{record.retentionPeriod}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Purposes:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {record.purposes.map((purpose, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {purpose}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Access Controls:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(record.accessControls)
                          .filter(([, value]) => value)
                          .map(([key]) => (
                            <Badge key={key} variant="info" className="text-xs">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Safeguards:</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Technical:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {record.safeguards.technical.slice(0, 2).map((safeguard, index) => (
                              <span key={index} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1 py-0.5 rounded">
                                {safeguard}
                              </span>
                            ))}
                            {record.safeguards.technical.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{record.safeguards.technical.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Organizational:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {record.safeguards.organizational.slice(0, 2).map((safeguard, index) => (
                              <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1 py-0.5 rounded">
                                {safeguard}
                              </span>
                            ))}
                            {record.safeguards.organizational.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{record.safeguards.organizational.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-muted-foreground">Legal:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {record.safeguards.legal.slice(0, 2).map((safeguard, index) => (
                              <span key={index} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-1 py-0.5 rounded">
                                {safeguard}
                              </span>
                            ))}
                            {record.safeguards.legal.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{record.safeguards.legal.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Object.entries(record.compliance)
                        .filter(([, value]) => value)
                        .map(([key]) => (
                          <Badge key={key} variant="info">
                            {key.toUpperCase()}
                          </Badge>
                        ))}
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

        <TabsContent value="classification" className="space-y-6">
          {/* Data Classification Framework */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Data Classification Framework</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Health Information
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Medical records and diagnoses</li>
                    <li>• Mental health information</li>
                    <li>• Prescription and medication data</li>
                    <li>• Health insurance information</li>
                    <li>• Disability status</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-green-500" />
                    Financial Information
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Bank account numbers</li>
                    <li>• Credit card information</li>
                    <li>• Income and salary data</li>
                    <li>• Tax identification numbers</li>
                    <li>• Investment information</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Fingerprint className="h-5 w-5 mr-2 text-purple-500" />
                    Biometric Data
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Fingerprints and palm prints</li>
                    <li>• Facial recognition data</li>
                    <li>• Voice patterns</li>
                    <li>• Iris and retina scans</li>
                    <li>• DNA and genetic data</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-cyan-500" />
                    Children's Data
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Personal information of minors</li>
                    <li>• Educational records</li>
                    <li>• Behavioral data</li>
                    <li>• Location tracking data</li>
                    <li>• Social media activity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Classification Guidelines */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Classification Guidelines</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Classification Criteria</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Data Sensitivity Factors:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Potential harm if disclosed</li>
                      <li>• Legal and regulatory requirements</li>
                      <li>• Business impact of exposure</li>
                      <li>• Data subject expectations</li>
                      <li>• Industry standards</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Risk Assessment Factors:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Data volume and scope</li>
                      <li>• Processing complexity</li>
                      <li>• Third-party involvement</li>
                      <li>• Cross-border transfers</li>
                      <li>• Retention requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="protection" className="space-y-6">
          {/* Protection Measures */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Protection Measures</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Technical Safeguards</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• End-to-end encryption</li>
                    <li>• Access controls and authentication</li>
                    <li>• Data loss prevention (DLP)</li>
                    <li>• Secure data transmission</li>
                    <li>• Regular security updates</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Organizational Safeguards</h3>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>• Privacy by design principles</li>
                    <li>• Staff training and awareness</li>
                    <li>• Data minimization practices</li>
                    <li>• Regular audits and assessments</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Legal Safeguards</h3>
                  <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
                    <li>• Data processing agreements</li>
                    <li>• Consent management</li>
                    <li>• Data subject rights procedures</li>
                    <li>• Cross-border transfer mechanisms</li>
                    <li>• Regular compliance reviews</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Access Controls */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Access Controls</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Role-Based Access Control</h3>
                  <div className="space-y-2">
                    {[
                      'Data Controller - Full access',
                      'Data Processor - Limited access',
                      'Privacy Officer - Oversight access',
                      'IT Administrator - Technical access',
                      'Auditor - Read-only access'
                    ].map((role, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-primary" />
                        <span className="text-sm">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">Additional Controls</h3>
                  <div className="space-y-2">
                    {[
                      'Multi-factor authentication',
                      'Time-based access restrictions',
                      'Location-based access controls',
                      'Audit logging and monitoring',
                      'Regular access reviews'
                    ].map((control, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300 text-primary" />
                        <span className="text-sm">{control}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          {/* Incident Overview */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Sensitive Data Incidents</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">Total Incidents</h3>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalIncidents}</div>
                <div className="text-sm text-red-700 dark:text-red-400">All time</div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Open Incidents</h3>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{openIncidents}</div>
                <div className="text-sm text-amber-700 dark:text-amber-400">Require attention</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Resolved</h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalIncidents - openIncidents}
                </div>
                <div className="text-sm text-green-700 dark:text-green-400">Successfully handled</div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Resolution Rate</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalIncidents > 0 ? Math.round(((totalIncidents - openIncidents) / totalIncidents) * 100) : 0}%
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-400">Success rate</div>
              </div>
            </div>
          </div>

          {/* Incident Response Procedures */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Incident Response Procedures</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Immediate Response (0-24 hours)</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">1.</span>
                      <span>Contain the incident and prevent further damage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">2.</span>
                      <span>Assess the scope and impact of the breach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">3.</span>
                      <span>Notify the privacy officer and incident response team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">4.</span>
                      <span>Document all actions and evidence</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Investigation Phase (1-7 days)</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">1.</span>
                      <span>Conduct detailed forensic analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">2.</span>
                      <span>Identify affected data subjects and records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">3.</span>
                      <span>Assess legal and regulatory obligations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">4.</span>
                      <span>Prepare notification materials</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}