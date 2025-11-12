import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
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
  Info
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/secureStorage';

interface DataNode {
  id: string;
  label: string;
  type: 'source' | 'processing' | 'storage' | 'output';
  cuiTypes: string[];
  securityLevel: 'low' | 'medium' | 'high';
  position: { x: number; y: number };
}

interface DataFlow {
  id: string;
  from: string;
  to: string;
  label: string;
  encryption: boolean;
  protocol: string;
}

const DataFlowMapper = () => {
  const [nodes, setNodes] = useState<DataNode[]>(() => {
    const saved = secureStorage.getItem<DataNode[]>('dataflow_nodes');
    return saved || [
      {
        id: 'source-1',
        label: 'Government Contract Data',
        type: 'source',
        cuiTypes: ['CRAD', 'NNPI'],
        securityLevel: 'high',
        position: { x: 100, y: 100 }
      },
      {
        id: 'processing-1',
        label: 'Document Management System',
        type: 'processing',
        cuiTypes: ['CRAD'],
        securityLevel: 'high',
        position: { x: 300, y: 100 }
      },
      {
        id: 'storage-1',
        label: 'Secure Database',
        type: 'storage',
        cuiTypes: ['CRAD', 'NNPI'],
        securityLevel: 'high',
        position: { x: 500, y: 100 }
      }
    ];
  });

  const [flows] = useState<DataFlow[]>(() => {
    const saved = secureStorage.getItem<DataFlow[]>('dataflow_flows');
    return saved || [
      {
        id: 'flow-1',
        from: 'source-1',
        to: 'processing-1',
        label: 'HTTPS/TLS',
        encryption: true,
        protocol: 'HTTPS'
      },
      {
        id: 'flow-2',
        from: 'processing-1',
        to: 'storage-1',
        label: 'TLS 1.3',
        encryption: true,
        protocol: 'TLS'
      }
    ];
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(() => 
    secureStorage.getItem('dataflow_selected_node', null)
  );

  // Auto-save nodes and flows
  useEffect(() => {
    secureStorage.setItem('dataflow_nodes', nodes);
  }, [nodes]);

  useEffect(() => {
    secureStorage.setItem('dataflow_flows', flows);
  }, [flows]);

  useEffect(() => {
    if (selectedNode) {
      secureStorage.setItem('dataflow_selected_node', selectedNode);
    }
  }, [selectedNode]);

  const handleAddNode = () => {
    const newNode: DataNode = {
      id: `node-${Date.now()}`,
      label: 'New Node',
      type: 'processing',
      cuiTypes: [],
      securityLevel: 'medium',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 }
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    toast.success('Node Added', 'New data flow node has been added');
  };

  const handleExportMap = () => {
    const mapData = {
      metadata: {
        title: 'CUI Data Flow Map',
        created: new Date().toISOString(),
        version: '1.0'
      },
      nodes,
      flows,
      compliance: {
        framework: 'NIST SP 800-171',
        requirements: ['3.1.3', '3.13.8', '3.8.1']
      }
    };

    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cui-data-flow-map-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Map exported", "CUI data flow map has been exported successfully");
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'source': return 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200';
      case 'processing': return 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-200';
      case 'storage': return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200';
      case 'output': return 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-200';
      default: return 'bg-muted border-border text-foreground';
    }
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'high': return <Shield className="h-4 w-4 text-red-600" />;
      case 'medium': return <Lock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Eye className="h-4 w-4 text-green-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
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
            <h1 className="text-3xl font-bold mb-2 text-foreground">CUI Data Flow Mapper</h1>
            <p className="text-muted-foreground">Visualize and document Controlled Unclassified Information flows for NIST SP 800-171 compliance</p>
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
                CUI Data Flow Diagram
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
                      <span className="font-medium text-sm">{node.label}</span>
                      {getSecurityIcon(node.securityLevel)}
                    </div>
                    <div className="text-xs">
                      {node.cuiTypes.map((type, idx) => (
                        <span key={idx} className="bg-primary/10 px-1 py-0.5 rounded mr-1">
                          {type}
                        </span>
                      ))}
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
                            id="cui-node-label"
                            name="nodeLabel"
                            value={node.label}
                            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <select
                            id="cui-node-type"
                            name="nodeType"
                            value={node.type}
                            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                            disabled
                          >
                            <option value="source">Data Source</option>
                            <option value="processing">Processing</option>
                            <option value="storage">Storage</option>
                            <option value="output">Output</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Security Level</label>
                          <select
                            id="cui-security-level"
                            name="securityLevel"
                            value={node.securityLevel}
                            className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                            disabled
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">CUI Types</label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {node.cuiTypes.map((type, idx) => (
                              <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
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
                  <span className="text-sm">NIST SP 800-171 Alignment</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CUI Flow Documentation</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Encryption Requirements</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Access Control Mapping</span>
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
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
            <h3 className="font-semibold mb-2">CUI Data Flow Mapping Requirements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              NIST SP 800-171 requires organizations to document how Controlled Unclassified Information flows through their systems.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Document all CUI data sources and destinations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Identify processing and storage locations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Map encryption and access controls</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Maintain current documentation for audits</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowMapper;