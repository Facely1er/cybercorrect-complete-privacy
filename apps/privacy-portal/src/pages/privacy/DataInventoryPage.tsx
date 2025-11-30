import React, { useState } from 'react';
import { 
  Database,
  Map,
  Eye,
  Edit,
  Plus,
  Search,
  BarChart3,
  Network,
  Shield,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { localStorageService } from '../../services/localStorageService';

interface DataAsset {
  id: string;
  name: string;
  description: string;
  category: 'personal' | 'sensitive' | 'public' | 'confidential';
  dataType: string[];
  source: string;
  purpose: string;
  retentionPeriod: string;
  legalBasis: string;
  dataSubjects: string[];
  processors: string[];
  location: string;
  encryptionStatus: 'encrypted' | 'unencrypted' | 'partial';
  lastUpdated: string;
  complianceStatus: 'compliant' | 'needs_review' | 'non_compliant';
  regulations: string[];
}

interface DataFlow {
  id: string;
  name: string;
  source: string;
  destination: string;
  dataTypes: string[];
  purpose: string;
  legalBasis: string;
  safeguards: string[];
  crossBorder: boolean;
  adequacyDecision: boolean;
  transferMechanism: string;
  lastAssessed: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export function DataInventoryPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCompliance, setSelectedCompliance] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get real data from localStorage
  const [dataAssets] = useState<DataAsset[]>(() => 
    localStorageService.getItem('data_assets', [])
  );
  const [dataFlows] = useState<DataFlow[]>(() => 
    localStorageService.getItem('data_flows', [])
  );

  const filteredAssets = dataAssets.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesCompliance = selectedCompliance === 'all' || asset.complianceStatus === selectedCompliance;
    const matchesSearch = searchTerm === '' || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesCompliance && matchesSearch;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'personal':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Personal</Badge>;
      case 'sensitive':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Sensitive</Badge>;
      case 'public':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Public</Badge>;
      case 'confidential':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Confidential</Badge>;
      default:
        return <Badge variant="general">{category}</Badge>;
    }
  };

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Compliant</Badge>;
      case 'needs_review':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Needs Review</Badge>;
      case 'non_compliant':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Non-Compliant</Badge>;
      default:
        return <Badge variant="general">{status}</Badge>;
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

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">High Risk</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Critical Risk</Badge>;
      default:
        return <Badge variant="general">{risk}</Badge>;
    }
  };

  // Calculate metrics
  const totalAssets = dataAssets.length;
  const personalDataAssets = dataAssets.filter(a => a.category === 'personal' || a.category === 'sensitive').length;
  const compliantAssets = dataAssets.filter(a => a.complianceStatus === 'compliant').length;
  const encryptedAssets = dataAssets.filter(a => a.encryptionStatus === 'encrypted').length;
  const crossBorderFlows = dataFlows.filter(f => f.crossBorder).length;
  const highRiskFlows = dataFlows.filter(f => f.riskLevel === 'high' || f.riskLevel === 'critical').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Inventory</h1>
        <p className="text-muted-foreground">
          Comprehensive mapping and visualization of personal data assets and flows
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Data Assets</TabsTrigger>
          <TabsTrigger value="flows">Data Flows</TabsTrigger>
          <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-2xl font-bold">{totalAssets}</span>
              </div>
              <h3 className="font-semibold mb-1">Total Data Assets</h3>
              <p className="text-sm text-muted-foreground">All data collections</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {personalDataAssets}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Personal Data</h3>
              <p className="text-sm text-muted-foreground">Subject to privacy laws</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {compliantAssets}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Compliant Assets</h3>
              <p className="text-sm text-muted-foreground">Meeting requirements</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Network className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {dataFlows.length}
                </span>
              </div>
              <h3 className="font-semibold mb-1">Data Flows</h3>
              <p className="text-sm text-muted-foreground">Data movements tracked</p>
            </div>
          </div>

          {/* Data Categories Distribution */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Data Categories Distribution
            </h2>
            <div className="space-y-4">
              {['personal', 'sensitive', 'confidential', 'public'].map((category) => {
                const count = dataAssets.filter(a => a.category === category).length;
                const percentage = totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getCategoryBadge(category)}
                        <span className="font-medium capitalize">{category} Data</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {count} assets ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          category === 'personal' ? 'bg-blue-500' :
                          category === 'sensitive' ? 'bg-red-500' :
                          category === 'confidential' ? 'bg-purple-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cross-Border Data Flows */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Network className="h-5 w-5 mr-2 text-purple-500" />
              Cross-Border Data Flows
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div>
                    <h3 className="font-medium">International Transfers</h3>
                    <p className="text-sm text-muted-foreground">Data flows outside jurisdiction</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {crossBorderFlows}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <div>
                    <h3 className="font-medium">High Risk Flows</h3>
                    <p className="text-sm text-muted-foreground">Require additional safeguards</p>
                  </div>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {highRiskFlows}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div>
                    <h3 className="font-medium">Encrypted Assets</h3>
                    <p className="text-sm text-muted-foreground">Data protection in place</p>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {encryptedAssets}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <div>
                    <h3 className="font-medium">Adequacy Decisions</h3>
                    <p className="text-sm text-muted-foreground">Approved transfer mechanisms</p>
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {dataFlows.filter(f => f.adequacyDecision).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search data assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="personal">Personal Data</option>
                  <option value="sensitive">Sensitive Data</option>
                  <option value="confidential">Confidential</option>
                  <option value="public">Public Data</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedCompliance}
                  onChange={(e) => setSelectedCompliance(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="compliant">Compliant</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="non_compliant">Non-Compliant</option>
                </select>
              </div>
              <div>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </div>
            </div>
          </div>

          {/* Data Assets List */}
          <div className="space-y-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white dark:bg-gray-900 rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{asset.name}</h3>
                      {getCategoryBadge(asset.category)}
                      {getComplianceBadge(asset.complianceStatus)}
                      {getEncryptionBadge(asset.encryptionStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{asset.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Data Types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {asset.dataType.map((type, index) => (
                            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Source:</span>
                        <div className="text-muted-foreground mt-1">{asset.source}</div>
                      </div>
                      <div>
                        <span className="font-medium">Purpose:</span>
                        <div className="text-muted-foreground mt-1">{asset.purpose}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Retention Period:</span>
                        <div className="text-muted-foreground mt-1">{asset.retentionPeriod}</div>
                      </div>
                      <div>
                        <span className="font-medium">Legal Basis:</span>
                        <div className="text-muted-foreground mt-1">{asset.legalBasis}</div>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <div className="text-muted-foreground mt-1">{asset.location}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Data Subjects:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {asset.dataSubjects.map((subject, index) => (
                          <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Processors:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {asset.processors.map((processor, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {processor}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {asset.regulations.map(reg => (
                        <Badge key={reg} variant="info">
                          {reg.toUpperCase()}
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

        <TabsContent value="flows" className="space-y-6">
          {/* Data Flows List */}
          <div className="space-y-4">
            {dataFlows.map((flow) => (
              <div key={flow.id} className="bg-white dark:bg-gray-900 rounded-lg border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{flow.name}</h3>
                      {getRiskBadge(flow.riskLevel)}
                      {flow.crossBorder && (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                          Cross-Border
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Source:</span>
                        <div className="text-muted-foreground mt-1">{flow.source}</div>
                      </div>
                      <div>
                        <span className="font-medium">Destination:</span>
                        <div className="text-muted-foreground mt-1">{flow.destination}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Purpose:</span>
                        <div className="text-muted-foreground mt-1">{flow.purpose}</div>
                      </div>
                      <div>
                        <span className="font-medium">Legal Basis:</span>
                        <div className="text-muted-foreground mt-1">{flow.legalBasis}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Data Types:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {flow.dataTypes.map((type, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="font-medium text-sm">Safeguards:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {flow.safeguards.map((safeguard, index) => (
                          <span key={index} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                            {safeguard}
                          </span>
                        ))}
                      </div>
                    </div>

                    {flow.crossBorder && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Cross-Border Transfer</span>
                        </div>
                        <div className="text-sm text-amber-700 dark:text-amber-400">
                          <p>Transfer Mechanism: {flow.transferMechanism}</p>
                          <p>Adequacy Decision: {flow.adequacyDecision ? 'Yes' : 'No'}</p>
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

        <TabsContent value="mapping" className="space-y-6">
          {/* Data Mapping Visualization */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Map className="h-5 w-5 mr-2 text-blue-500" />
              Data Flow Visualization
            </h2>
            <div className="text-center p-8">
              <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Interactive Data Flow Map</h3>
              <p className="text-muted-foreground mb-4">
                Visual representation of data flows and relationships between systems
              </p>
              <Button>
                <Map className="h-4 w-4 mr-2" />
                Open Data Flow Mapper
              </Button>
            </div>
          </div>

          {/* Data Lineage */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Data Lineage Tracking</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Employee Records System</h3>
                  <p className="text-sm text-muted-foreground">Primary data source for employee information</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">Source</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">HR Analytics Platform</h3>
                  <p className="text-sm text-muted-foreground">Processed data for workforce analytics</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Processor</Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">External Reporting System</h3>
                  <p className="text-sm text-muted-foreground">Anonymized data for regulatory reporting</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Destination</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          {/* Retention Policy Management */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Data Retention Management
            </h2>
            <div className="space-y-4">
              {dataAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{asset.name}</h3>
                      {getCategoryBadge(asset.category)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Retention Period:</span>
                        <div>{asset.retentionPeriod}</div>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <div>{asset.lastUpdated}</div>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <div>{getComplianceBadge(asset.complianceStatus)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retention Schedule */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Retention Schedule</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">Immediate Deletion</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">Data that should be deleted immediately</p>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">0</div>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Due for Review</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400">Data approaching retention limit</p>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">3</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Within Policy</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">Data within retention period</p>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">12</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}