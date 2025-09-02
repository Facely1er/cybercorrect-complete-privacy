import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProject } from '../../context/ProjectContext';
import { 
  Database, 
  FileText, 
  Upload, 
  Download, 
  ArrowLeft,
  Plus,
  Search,
  Eye,
  Edit,
  Shield,
  CheckCircle,
  Users,
  Link2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EvidenceItem {
  id: string;
  name: string;
  type: 'policy' | 'procedure' | 'assessment' | 'training' | 'technical' | 'legal';
  category: string;
  description: string;
  uploadDate: string;
  lastModified: string;
  uploadedBy: string;
  fileSize: string;
  tags: string[];
  linkedTasks: string[];
  complianceFrameworks: string[];
  auditTrail: {
    action: string;
    user: string;
    timestamp: string;
  }[];
}

const EvidenceVault = () => {
  const { getCurrentProject, userMode } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const project = getCurrentProject();

  // Sample evidence items for privacy compliance
  const evidenceItems: EvidenceItem[] = [
    {
      id: 'ev001',
      name: 'Privacy Assessment Report v1.0',
      type: 'assessment',
      category: 'Foundation Documents',
      description: 'Comprehensive privacy assessment against NIST Privacy Framework',
      uploadDate: '2024-01-20',
      lastModified: '2024-01-20',
      uploadedBy: 'Data Protection Officer',
      fileSize: '2.4 MB',
      tags: ['NIST', 'Assessment', 'Baseline'],
      linkedTasks: ['1.1.1', '1.1.2'],
      complianceFrameworks: ['NIST Privacy Framework', 'GDPR', 'CCPA'],
      auditTrail: [
        { action: 'Document uploaded', user: 'DPO', timestamp: '2024-01-20 10:30' },
        { action: 'Document approved', user: 'Legal Counsel', timestamp: '2024-01-20 14:15' }
      ]
    },
    {
      id: 'ev002',
      name: 'GDPR Data Processing Inventory',
      type: 'technical',
      category: 'Data Management',
      description: 'Complete inventory of personal data processing activities under GDPR Article 30',
      uploadDate: '2024-01-25',
      lastModified: '2024-01-28',
      uploadedBy: 'Data Steward',
      fileSize: '1.8 MB',
      tags: ['GDPR', 'Article 30', 'Data Inventory'],
      linkedTasks: ['1.2.1', '1.2.3'],
      complianceFrameworks: ['GDPR'],
      auditTrail: [
        { action: 'Document created', user: 'Data Steward', timestamp: '2024-01-25 09:00' },
        { action: 'Document updated', user: 'Data Steward', timestamp: '2024-01-28 16:45' }
      ]
    },
    {
      id: 'ev003',
      name: 'Privacy Policy v2.1',
      type: 'policy',
      category: 'Governance',
      description: 'Updated privacy policy compliant with GDPR, CCPA, and NIST Privacy Framework',
      uploadDate: '2024-02-01',
      lastModified: '2024-02-01',
      uploadedBy: 'Legal Counsel',
      fileSize: '856 KB',
      tags: ['Policy', 'GDPR', 'CCPA', 'Public'],
      linkedTasks: ['2.1.1', '2.1.2'],
      complianceFrameworks: ['GDPR', 'CCPA', 'NIST Privacy Framework'],
      auditTrail: [
        { action: 'Document uploaded', user: 'Legal Counsel', timestamp: '2024-02-01 11:20' }
      ]
    },
    {
      id: 'ev004',
      name: 'Data Subject Rights Procedures',
      type: 'procedure',
      category: 'Rights Management',
      description: 'Detailed procedures for handling data subject requests (access, rectification, deletion)',
      uploadDate: '2024-02-05',
      lastModified: '2024-02-05',
      uploadedBy: 'Data Protection Officer',
      fileSize: '1.2 MB',
      tags: ['Rights', 'GDPR', 'Procedures'],
      linkedTasks: ['2.2.1'],
      complianceFrameworks: ['GDPR', 'CCPA'],
      auditTrail: [
        { action: 'Document created', user: 'DPO', timestamp: '2024-02-05 14:30' }
      ]
    },
    {
      id: 'ev005',
      name: 'Privacy Training Materials',
      type: 'training',
      category: 'Awareness',
      description: 'Comprehensive privacy training materials for all staff levels',
      uploadDate: '2024-02-08',
      lastModified: '2024-02-08',
      uploadedBy: 'Business Analyst',
      fileSize: '3.1 MB',
      tags: ['Training', 'Awareness', 'Staff'],
      linkedTasks: ['2.3.1'],
      complianceFrameworks: ['GDPR', 'NIST Privacy Framework'],
      auditTrail: [
        { action: 'Document uploaded', user: 'Business Analyst', timestamp: '2024-02-08 13:15' }
      ]
    }
  ];

  const evidenceTypes = [
    { key: 'all', name: 'All Evidence', icon: Database },
    { key: 'policy', name: 'Policies', icon: Shield },
    { key: 'procedure', name: 'Procedures', icon: FileText },
    { key: 'assessment', name: 'Assessments', icon: CheckCircle },
    { key: 'training', name: 'Training', icon: Users },
    { key: 'technical', name: 'Technical', icon: Database },
    { key: 'legal', name: 'Legal', icon: FileText }
  ];

  const filteredEvidence = evidenceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'policy': 'bg-blue-100 text-blue-800',
      'procedure': 'bg-green-100 text-green-800',
      'assessment': 'bg-purple-100 text-purple-800',
      'training': 'bg-orange-100 text-orange-800',
      'technical': 'bg-cyan-100 text-cyan-800',
      'legal': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Active Project</h1>
          <Link to="/project">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/project" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Evidence Vault</h1>
            <p className="text-muted-foreground">
              Centralized repository for privacy compliance documentation and evidence
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Evidence
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Document
            </Button>
          </div>
        </div>
      </div>

      {/* Evidence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-3xl font-bold text-foreground">{evidenceItems.length}</p>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Policies</p>
                <p className="text-3xl font-bold text-blue-600">
                  {evidenceItems.filter(item => item.type === 'policy').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assessments</p>
                <p className="text-3xl font-bold text-green-600">
                  {evidenceItems.filter(item => item.type === 'assessment').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-3xl font-bold text-purple-600">8.3</p>
                <p className="text-xs text-muted-foreground">GB</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search evidence..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {evidenceTypes.map(type => (
                <Button
                  key={type.key}
                  variant={selectedType === type.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.key)}
                >
                  <type.icon className="h-4 w-4 mr-1" />
                  {type.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredEvidence.map(item => (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedItem === item.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedItem(item.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-primary mr-3" />
                      <div>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.fileSize}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploaded: {new Date(item.uploadDate).toLocaleDateString()}</span>
                    <span>By: {item.uploadedBy}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Evidence Details Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Evidence Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <div className="space-y-4">
                  {(() => {
                    const item = evidenceItems.find(e => e.id === selectedItem);
                    if (!item) return null;

                    return (
                      <>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <div className="font-medium capitalize">{item.type}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Size:</span>
                            <div className="font-medium">{item.fileSize}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Uploaded:</span>
                            <div className="font-medium">{new Date(item.uploadDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Modified:</span>
                            <div className="font-medium">{new Date(item.lastModified).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Compliance Frameworks</h4>
                          <div className="space-y-1">
                            {item.complianceFrameworks.map(framework => (
                              <div key={framework} className="text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600 inline mr-1" />
                                {framework}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Linked Tasks</h4>
                          <div className="space-y-1">
                            {item.linkedTasks.map(task => (
                              <div key={task} className="text-sm">
                                <Link2 className="h-3 w-3 text-blue-600 inline mr-1" />
                                Task {task}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Audit Trail</h4>
                          <div className="space-y-2">
                            {item.auditTrail.map((entry, idx) => (
                              <div key={idx} className="text-xs p-2 bg-muted/30 rounded">
                                <div className="font-medium">{entry.action}</div>
                                <div className="text-muted-foreground">
                                  {entry.user} • {entry.timestamp}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 space-y-2">
                          <Button size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
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
                    Select an evidence item to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EvidenceVault;