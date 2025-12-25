import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useJourneyTool } from '../../hooks/useJourneyTool';
import { 
  Database, 
  CheckCircle, 
  Plus, 
  Edit, 
  Download, 
  ArrowLeft,
  Network,
  Shield,
  Eye,
  Lock,
  AlertTriangle,
  Info,
  Users,
  Globe,
  FileText,
  Clock,
  Scale
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/storage';

// PII Categories
type PiiCategory = 
  | 'direct-identifier' 
  | 'indirect-identifier' 
  | 'sensitive-pii' 
  | 'special-category' 
  | 'biometric' 
  | 'financial' 
  | 'health' 
  | 'location';

// Legal Basis (GDPR Article 6)
type LegalBasis = 
  | 'consent' 
  | 'contract' 
  | 'legal-obligation' 
  | 'vital-interests' 
  | 'public-task' 
  | 'legitimate-interests';

// Data Subject Rights
type DataSubjectRight = 
  | 'access' 
  | 'rectification' 
  | 'erasure' 
  | 'restriction' 
  | 'portability' 
  | 'object' 
  | 'automated-decision';

interface PiiNode {
  id: string;
  label: string;
  type: 'source' | 'processing' | 'storage' | 'output' | 'third-party';
  piiCategories: PiiCategory[];
  privacyRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  legalBasis?: LegalBasis;
  purpose?: string;
  retentionPeriod?: string;
  dataSubjectRights: DataSubjectRight[];
  thirdPartyProcessor?: string;
  crossBorderTransfer?: boolean;
  transferSafeguards?: string;
  position: { x: number; y: number };
}

interface PiiFlow {
  id: string;
  from: string;
  to: string;
  label: string;
  encryption: boolean;
  protocol: string;
  purpose?: string;
  lawfulBasis?: LegalBasis;
}

const PiiDataFlowMapper = () => {
  // Journey tracking - automatically marks tool as started on mount
  const { markCompleted } = useJourneyTool('pii-data-flow-mapper');
  
  const [nodes, setNodes] = useState<PiiNode[]>(() => {
    const saved = secureStorage.getItem<PiiNode[]>('pii_dataflow_nodes');
    return saved || [
      {
        id: 'source-1',
        label: 'Customer Registration Form',
        type: 'source',
        piiCategories: ['direct-identifier', 'sensitive-pii'],
        privacyRiskLevel: 'high',
        legalBasis: 'consent',
        purpose: 'User account creation and authentication',
        retentionPeriod: '7 years',
        dataSubjectRights: ['access', 'rectification', 'erasure', 'portability'],
        position: { x: 100, y: 100 }
      },
      {
        id: 'processing-1',
        label: 'CRM System',
        type: 'processing',
        piiCategories: ['direct-identifier', 'indirect-identifier'],
        privacyRiskLevel: 'medium',
        legalBasis: 'legitimate-interests',
        purpose: 'Customer relationship management',
        retentionPeriod: '5 years',
        dataSubjectRights: ['access', 'rectification', 'erasure'],
        position: { x: 300, y: 100 }
      },
      {
        id: 'storage-1',
        label: 'Encrypted Database',
        type: 'storage',
        piiCategories: ['direct-identifier', 'sensitive-pii', 'financial'],
        privacyRiskLevel: 'high',
        legalBasis: 'contract',
        purpose: 'Secure data storage',
        retentionPeriod: '7 years',
        dataSubjectRights: ['access', 'rectification', 'erasure', 'portability'],
        position: { x: 500, y: 100 }
      },
      {
        id: 'third-party-1',
        label: 'Payment Processor',
        type: 'third-party',
        piiCategories: ['financial', 'direct-identifier'],
        privacyRiskLevel: 'critical',
        legalBasis: 'contract',
        purpose: 'Payment processing',
        retentionPeriod: '10 years',
        dataSubjectRights: ['access', 'rectification'],
        thirdPartyProcessor: 'Stripe Inc.',
        crossBorderTransfer: true,
        transferSafeguards: 'Standard Contractual Clauses (SCCs)',
        position: { x: 300, y: 250 }
      }
    ];
  });

  const [flows, setFlows] = useState<PiiFlow[]>(() => {
    const saved = secureStorage.getItem<PiiFlow[]>('pii_dataflow_flows');
    return saved || [
      {
        id: 'flow-1',
        from: 'source-1',
        to: 'processing-1',
        label: 'HTTPS/TLS 1.3',
        encryption: true,
        protocol: 'HTTPS',
        purpose: 'Data transmission for processing',
        lawfulBasis: 'consent'
      },
      {
        id: 'flow-2',
        from: 'processing-1',
        to: 'storage-1',
        label: 'Encrypted API',
        encryption: true,
        protocol: 'REST API',
        purpose: 'Data storage',
        lawfulBasis: 'contract'
      },
      {
        id: 'flow-3',
        from: 'storage-1',
        to: 'third-party-1',
        label: 'Secure Payment Gateway',
        encryption: true,
        protocol: 'PCI-DSS',
        purpose: 'Payment processing',
        lawfulBasis: 'contract'
      }
    ];
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(() => 
    secureStorage.getItem('pii_dataflow_selected_node', null)
  );

  // Auto-save nodes and flows
  useEffect(() => {
    secureStorage.setItem('pii_dataflow_nodes', nodes);
  }, [nodes]);

  useEffect(() => {
    secureStorage.setItem('pii_dataflow_flows', flows);
  }, [flows]);

  useEffect(() => {
    if (selectedNode) {
      secureStorage.setItem('pii_dataflow_selected_node', selectedNode);
    }
  }, [selectedNode]);

  const handleAddNode = () => {
    const newNode: PiiNode = {
      id: `node-${Date.now()}`,
      label: 'New Node',
      type: 'processing',
      piiCategories: [],
      privacyRiskLevel: 'medium',
      dataSubjectRights: [],
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 }
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    toast.success('Node Added', 'New PII data flow node has been added');
  };

  const handleExportMap = () => {
    const mapData = {
      metadata: {
        title: 'PII Data Flow Map',
        created: new Date().toISOString(),
        version: '1.0',
        complianceFrameworks: ['GDPR', 'CCPA', 'PIPEDA']
      },
      nodes,
      flows,
      compliance: {
        gdpr: {
          article30: 'Records of Processing Activities',
          article35: 'Data Protection Impact Assessment',
          requirements: ['Art. 5(1)(f)', 'Art. 32', 'Art. 33']
        },
        ccpa: {
          section: '1798.100 - Consumer Rights',
          requirements: ['Data mapping', 'Consumer rights', 'Opt-out mechanisms']
        },
        pipeda: {
          principle: 'Principle 4.1.3 - Limiting Collection',
          requirements: ['Data flow documentation', 'Purpose specification']
        }
      }
    };

    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pii-data-flow-map-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Map exported", "PII data flow map has been exported successfully");
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'source': return 'bg-primary/10 border-primary/30 text-primary';
      case 'processing': return 'bg-warning/10 border-warning/30 text-warning';
      case 'storage': return 'bg-success/10 border-success/30 text-success';
      case 'output': return 'bg-accent/10 border-accent/30 text-accent';
      case 'third-party': return 'bg-warning/10 border-warning/30 text-warning';
      default: return 'bg-muted border-border text-foreground';
    }
  };

  const getPrivacyRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <Shield className="h-4 w-4 text-red-700" />;
      case 'high': return <Shield className="h-4 w-4 text-red-600" />;
      case 'medium': return <Lock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Eye className="h-4 w-4 text-green-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPiiCategoryLabel = (category: PiiCategory): string => {
    const labels: Record<PiiCategory, string> = {
      'direct-identifier': 'Direct ID',
      'indirect-identifier': 'Indirect ID',
      'sensitive-pii': 'Sensitive',
      'special-category': 'Special Category',
      'biometric': 'Biometric',
      'financial': 'Financial',
      'health': 'Health',
      'location': 'Location'
    };
    return labels[category] || category;
  };

  const getLegalBasisLabel = (basis?: LegalBasis): string => {
    if (!basis) return 'Not specified';
    const labels: Record<LegalBasis, string> = {
      'consent': 'Consent (Art. 6(1)(a))',
      'contract': 'Contract (Art. 6(1)(b))',
      'legal-obligation': 'Legal Obligation (Art. 6(1)(c))',
      'vital-interests': 'Vital Interests (Art. 6(1)(d))',
      'public-task': 'Public Task (Art. 6(1)(e))',
      'legitimate-interests': 'Legitimate Interests (Art. 6(1)(f))'
    };
    return labels[basis];
  };

  const getDataSubjectRightLabel = (right: DataSubjectRight): string => {
    const labels: Record<DataSubjectRight, string> = {
      'access': 'Access',
      'rectification': 'Rectification',
      'erasure': 'Erasure',
      'restriction': 'Restriction',
      'portability': 'Portability',
      'object': 'Object',
      'automated-decision': 'Automated Decision'
    };
    return labels[right] || right;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/toolkit" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Toolkit
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">PII Data Flow Mapper</h1>
            <p className="text-muted-foreground">Visualize and document Personal Identifiable Information flows for GDPR, CCPA, and PIPEDA compliance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddNode}>
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
            <Button onClick={handleExportMap}>
              <Download className="h-4 w-4 mr-2" />
              Export Map
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapping Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="h-5 w-5 mr-2 text-primary" />
                PII Data Flow Diagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-muted/20 border border-muted rounded-lg h-96 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full">
                  {/* Render connections */}
                  {flows.map((flow) => {
                    const fromNode = nodes.find(n => n.id === flow.from);
                    const toNode = nodes.find(n => n.id === flow.to);
                    if (!fromNode || !toNode) return null;

                    return (
                      <g key={flow.id}>
                        <line
                          x1={fromNode.position.x + 80}
                          y1={fromNode.position.y + 40}
                          x2={toNode.position.x}
                          y2={toNode.position.y + 40}
                          stroke={flow.encryption ? "#10b981" : "#ef4444"}
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                        <text
                          x={(fromNode.position.x + toNode.position.x) / 2 + 40}
                          y={(fromNode.position.y + toNode.position.y) / 2 + 35}
                          className="fill-current text-xs"
                          textAnchor="middle"
                        >
                          {flow.label}
                        </text>
                      </g>
                    );
                  })}
                  
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>

                {/* Render nodes */}
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`absolute w-40 p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${getNodeTypeColor(node.type)} ${
                      selectedNode === node.id ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{
                      left: node.position.x,
                      top: node.position.y
                    }}
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-xs">{node.label}</span>
                      {getPrivacyRiskIcon(node.privacyRiskLevel)}
                    </div>
                    <div className="text-xs space-y-1">
                      {node.piiCategories.slice(0, 2).map((category, idx) => (
                        <span key={idx} className="bg-primary/10 px-1 py-0.5 rounded mr-1 text-[10px]">
                          {getPiiCategoryLabel(category)}
                        </span>
                      ))}
                      {node.piiCategories.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">+{node.piiCategories.length - 2}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node Details Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-primary" />
                Node Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  {(() => {
                    const node = nodes.find(n => n.id === selectedNode);
                    if (!node) return null;
                    
                    return (
                      <>
                        <div>
                          <label className="text-sm font-medium">Label</label>
                          <input
                            type="text"
                            id="pii-node-label"
                            name="nodeLabel"
                            value={node.label}
                            className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <select
                            id="pii-node-type"
                            name="nodeType"
                            value={node.type}
                            className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                            disabled
                          >
                            <option value="source">Data Source</option>
                            <option value="processing">Processing</option>
                            <option value="storage">Storage</option>
                            <option value="output">Output</option>
                            <option value="third-party">Third Party</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Privacy Risk Level</label>
                          <div className="mt-1 flex items-center gap-2">
                            <select
                              id="pii-privacy-risk"
                              name="privacyRiskLevel"
                              value={node.privacyRiskLevel}
                              className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                              disabled
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                            </select>
                            {getPrivacyRiskIcon(node.privacyRiskLevel)}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">PII Categories</label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {node.piiCategories.map((category, idx) => (
                              <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                {getPiiCategoryLabel(category)}
                              </span>
                            ))}
                          </div>
                        </div>
                        {node.legalBasis && (
                          <div>
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Scale className="h-4 w-4" />
                              Legal Basis (GDPR)
                            </label>
                            <div className="mt-1 px-3 py-2 border border-border rounded-md bg-muted/50 text-sm">
                              {getLegalBasisLabel(node.legalBasis)}
                            </div>
                          </div>
                        )}
                        {node.purpose && (
                          <div>
                            <label className="text-sm font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Purpose of Processing
                            </label>
                            <div className="mt-1 px-3 py-2 border border-border rounded-md bg-muted/50 text-sm">
                              {node.purpose}
                            </div>
                          </div>
                        )}
                        {node.retentionPeriod && (
                          <div>
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Retention Period
                            </label>
                            <div className="mt-1 px-3 py-2 border border-border rounded-md bg-muted/50 text-sm">
                              {node.retentionPeriod}
                            </div>
                          </div>
                        )}
                        {node.dataSubjectRights.length > 0 && (
                          <div>
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Data Subject Rights
                            </label>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {node.dataSubjectRights.map((right, idx) => (
                                <Badge key={idx} variant="info" size="sm">
                                  {getDataSubjectRightLabel(right)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {node.thirdPartyProcessor && (
                          <div>
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Third Party Processor
                            </label>
                            <div className="mt-1 px-3 py-2 border border-border rounded-md bg-muted/50 text-sm">
                              {node.thirdPartyProcessor}
                            </div>
                          </div>
                        )}
                        {node.crossBorderTransfer && (
                          <div>
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Cross Border Transfer
                            </label>
                            <div className="mt-1 space-y-2">
                              <div className="px-3 py-2 border border-border rounded-md bg-muted/50 text-sm">
                                Yes - {node.transferSafeguards || 'No safeguards specified'}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="pt-4">
                          <Button variant="outline" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Node
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a node to view and edit its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compliance Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">GDPR Article 30 (ROPA)</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">GDPR Article 35 (DPIA)</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CCPA Data Mapping</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PIPEDA Documentation</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Legal Basis Validation</span>
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Subject Rights Mapping</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">PII Data Flow Mapping Requirements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Privacy regulations require organizations to document how Personal Identifiable Information flows through their systems. This tool helps you create comprehensive data flow maps for GDPR Article 30 (Records of Processing Activities), CCPA data mapping requirements, and PIPEDA documentation.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Document all PII data sources, processing activities, and destinations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Identify legal basis for processing (GDPR Article 6)</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Map data subject rights applicable to each processing activity</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Document third-party processors and cross-border transfers</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Track retention periods and purpose of processing</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Maintain current documentation for privacy audits and regulatory compliance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiiDataFlowMapper;


