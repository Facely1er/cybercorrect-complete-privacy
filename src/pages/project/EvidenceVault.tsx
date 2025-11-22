import { useState, useEffect, useRef } from 'react';
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
  Link2,
  FileDown,
  ChevronDown,
  FileJson,
  File
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '../../components/ui/Toaster';
import { generateEvidencePdf, EvidenceItem as EvidenceItemType } from '../../utils/generateEvidencePdf';
import { secureStorage } from '../../utils/secureStorage';
import { EmptyState } from '../../components/ui/EmptyState';

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
  const { getCurrentProject } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const project = getCurrentProject();

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(() => {
    const saved = secureStorage.getItem<EvidenceItem[]>('evidence_items');
    return saved || [];
  });

  // Auto-save evidence items
  useEffect(() => {
    if (evidenceItems.length > 0) {
      secureStorage.setItem('evidence_items', evidenceItems);
    }
  }, [evidenceItems]);

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

  const handleExportJSON = () => {
    try {
      setIsExporting(true);
      const exportData = {
        metadata: {
          timestamp: new Date().toISOString(),
          exportDate: new Date().toLocaleDateString(),
          totalDocuments: filteredEvidence.length,
          projectName: project?.projectId || 'Unknown Project'
        },
        documents: filteredEvidence
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidence-vault-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export successful', 'Evidence vault exported as JSON');
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error('Export failed', 'Failed to export evidence vault as JSON');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      generateEvidencePdf(filteredEvidence as EvidenceItemType[]);
      toast.success('Export successful', 'Evidence vault exported as PDF');
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Export failed', 'Failed to export evidence vault as PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleUploadEvidence = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.json,.csv';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach((file) => {
        const newEvidence: EvidenceItem = {
          id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: 'technical', // Default type, can be changed later
          category: 'Uploaded',
          description: `Uploaded file: ${file.name}`,
          uploadDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          uploadedBy: 'Current User',
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          tags: [],
          linkedTasks: [],
          complianceFrameworks: [],
          auditTrail: [{
            action: 'Uploaded',
            user: 'Current User',
            timestamp: new Date().toISOString()
          }]
        };

        setEvidenceItems(prev => [...prev, newEvidence]);
      });

      toast.success('Upload successful', `${files.length} file(s) uploaded successfully`);
    };

    input.click();
  };

  const handleCreateDocument = () => {
    const newDocument: EvidenceItem = {
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `New Document ${new Date().toLocaleDateString()}`,
      type: 'policy',
      category: 'Custom',
      description: 'New document created',
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      uploadedBy: 'Current User',
      fileSize: '0 KB',
      tags: ['new'],
      linkedTasks: [],
      complianceFrameworks: [],
      auditTrail: [{
        action: 'Created',
        user: 'Current User',
        timestamp: new Date().toISOString()
      }]
    };

    setEvidenceItems(prev => [...prev, newDocument]);
    setSelectedItem(newDocument.id);
    toast.success('Document created', 'New document added to evidence vault');
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
            <Button variant="outline" onClick={handleUploadEvidence}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Evidence
            </Button>
            <div className="relative" ref={exportMenuRef}>
              <Button 
                variant="outline" 
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting || filteredEvidence.length === 0}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-10">
                  <button
                    onClick={handleExportJSON}
                    disabled={isExporting}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    Export as JSON
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <File className="h-4 w-4 mr-2" />
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
            <Button onClick={handleCreateDocument}>
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
                <p className="text-3xl font-bold text-purple-600">0</p>
                <p className="text-xs text-muted-foreground">MB</p>
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
            {filteredEvidence.length === 0 ? (
              <EmptyState
                icon={Database}
                title="No Evidence Items"
                description="Upload your first evidence document to start building your compliance documentation library."
                action={{
                  label: "Upload Evidence",
                  onClick: () => toast.info('Upload', 'Upload feature coming soon'),
                  icon: Upload
                }}
              />
            ) : (
              filteredEvidence.map(item => (
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
            ))
            )}
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
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              if (selectedItem) {
                                const item = evidenceItems.find(e => e.id === selectedItem);
                                if (item) {
                                  // Create a download link for the evidence item
                                  const dataStr = JSON.stringify(item, null, 2);
                                  const blob = new Blob([dataStr], { type: 'application/json' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${item.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                  toast.success('Download started', 'Evidence item downloaded');
                                }
                              }
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              if (selectedItem) {
                                const item = evidenceItems.find(e => e.id === selectedItem);
                                if (item) {
                                  // Open edit modal or allow inline editing
                                  const newName = prompt('Edit document name:', item.name);
                                  if (newName && newName !== item.name) {
                                    setEvidenceItems(prev => prev.map(e => 
                                      e.id === selectedItem 
                                        ? { ...e, name: newName, lastModified: new Date().toISOString() }
                                        : e
                                    ));
                                    toast.success('Updated', 'Document details updated');
                                  }
                                }
                              }
                            }}
                          >
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