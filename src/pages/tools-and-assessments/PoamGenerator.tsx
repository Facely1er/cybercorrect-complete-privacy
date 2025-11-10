import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  FileCheck, 
  CheckCircle, 
  Plus, 
  Download, 
  ArrowLeft,
  AlertTriangle,
  Target,
  DollarSign,
  Clock,
  Edit,
  Shield,
  ArrowRight,
  Calendar,
  Info,
  Loader2
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/secureStorage';

interface PoamItem {
  id: string;
  controlId: string;
  weakness: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'completed' | 'risk_accepted';
  plannedActions: string[];
  responsibleParty: string;
  targetDate: string;
  estimatedCost: number;
  businessImpact: string;
  milestones: {
    description: string;
    targetDate: string;
    status: 'pending' | 'complete';
  }[];
}

const PoamGenerator = () => {
  const [poamItems, setPoamItems] = useState<PoamItem[]>(() => {
    const saved = secureStorage.getItem<PoamItem[]>('poam_items');
    return saved || [];
  });

  const [selectedItem, setSelectedItem] = useState<string | null>(() => 
    secureStorage.getItem('poam_selected', null)
  );
  const [isExporting, setIsExporting] = useState(false);
  
  // Auto-save POAM items
  useEffect(() => {
    if (poamItems.length > 0) {
      secureStorage.setItem('poam_items', poamItems);
    }
  }, [poamItems]);

  useEffect(() => {
    if (selectedItem) {
      secureStorage.setItem('poam_selected', selectedItem);
    }
  }, [selectedItem]);
  
  const updatePoamStatus = (poamId: string, newStatus: PoamItem['status']) => {
    setPoamItems(prev => prev.map(item => 
      item.id === poamId ? { ...item, status: newStatus } : item
    ));
    toast.success('Status updated', `POAM ${poamId} status changed to ${newStatus}`);
  };

  const handleExportPoam = async () => {
    setIsExporting(true);
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const poamData = {
        metadata: {
          title: 'Plan of Action and Milestones (POA&M)',
          created: new Date().toISOString(),
          version: '1.0',
          organization: '',
          framework: 'NIST SP 800-171',
          totalItems: poamItems.length,
          totalCost: poamItems.reduce((sum, item) => sum + item.estimatedCost, 0)
        },
        executiveSummary: {
          criticalItems: poamItems.filter(item => item.priority === 'critical').length,
          highItems: poamItems.filter(item => item.priority === 'high').length,
          inProgress: poamItems.filter(item => item.status === 'in_progress').length,
          estimatedTotalCost: poamItems.reduce((sum, item) => sum + item.estimatedCost, 0)
        },
        poamItems: poamItems
      };

      const blob = new Blob([JSON.stringify(poamData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poam-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("POA&M exported", "Plan of Action and Milestones has been exported successfully");
    } catch (error) {
      toast.error('Export Failed', error instanceof Error ? error.message : 'Failed to export POA&M');
    } finally {
      setIsExporting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'high': return 'text-warning bg-warning/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'in_progress': return 'text-primary bg-primary/10';
      case 'open': return 'text-destructive bg-destructive/10';
      case 'risk_accepted': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  // Handle keyboard navigation for cards
  const handleCardKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedItem(itemId);
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
            <h1 className="text-3xl font-bold mb-2 text-foreground">POA&M Generator</h1>
            <p className="text-muted-foreground">Create and manage Plans of Action & Milestones for compliance gaps</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
            <Button onClick={handleExportPoam} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export POA&M
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Items</p>
                <p className="text-2xl font-bold text-destructive">
                  {poamItems.filter(item => item.priority === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-primary">
                  {poamItems.filter(item => item.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">
                  {poamItems.filter(item => item.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-accent">
                  ${(poamItems.reduce((sum, item) => sum + item.estimatedCost, 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* POA&M Items List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-primary" />
                POA&M Items ({poamItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {poamItems.length === 0 ? (
                <Card className="text-center py-12">
                  <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No POA&M Items Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by creating your first Plan of Action and Milestones item
                  </p>
                  <Button onClick={() => toast.info('Feature Coming Soon', 'Add Item functionality will be available soon')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Item
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {poamItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary ${
                        selectedItem === item.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedItem(item.id)}
                      onKeyDown={(e) => handleCardKeyDown(e, item.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select POA&M item ${item.id}: ${item.weakness}`}
                    >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-primary">{item.id}</span>
                          <span className="font-mono text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            {item.controlId}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold">${(item.estimatedCost / 1000).toFixed(0)}K</div>
                          <div className="text-muted-foreground">{item.targetDate}</div>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-2">{item.weakness}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Responsible Party:</span>
                          <div className="text-muted-foreground">{item.responsibleParty}</div>
                        </div>
                        <div>
                          <span className="font-medium">Business Impact:</span>
                          <div className="text-muted-foreground">{item.businessImpact}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">Progress</span>
                          <span>{item.milestones.filter(m => m.status === 'complete').length}/{item.milestones.length} milestones</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all" 
                            style={{ 
                              width: `${(item.milestones.filter(m => m.status === 'complete').length / item.milestones.length) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Item Details Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Item Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <div className="space-y-4">
                  {(() => {
                    const item = poamItems.find(p => p.id === selectedItem);
                    if (!item) return null;
                    
                    return (
                      <>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{item.weakness}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Planned Actions</h4>
                          <div className="space-y-2">
                            {item.plannedActions.map((action, idx) => (
                              <div key={idx} className="flex items-start text-sm">
                                <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Milestones</h4>
                          <div className="space-y-2">
                            {item.milestones.map((milestone, idx) => (
                              <div key={idx} className="flex items-start text-sm">
                                {milestone.status === 'complete' ? (
                                  <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Clock className="h-4 w-4 text-warning mr-2 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                  <div>{milestone.description}</div>
                                  <div className="text-xs text-muted-foreground">{milestone.targetDate}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                          <div>
                            <span className="text-xs text-muted-foreground">Target Date</span>
                            <div className="font-medium">{item.targetDate}</div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Est. Cost</span>
                            <div className="font-medium">${item.estimatedCost.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-border">
                          <label className="block text-sm font-medium mb-2">Status</label>
                          <select
                            value={item.status}
                            onChange={(e) => updatePoamStatus(item.id, e.target.value as PoamItem['status'])}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="risk_accepted">Risk Accepted</option>
                          </select>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="outline" className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Item
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a POA&M item to view its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/assessments/privacy-assessment">
                  <Button variant="outline" size="sm" className="w-full">
                    Import from Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full">
                  Generate Executive Summary
                  <FileCheck className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Schedule Review Meeting
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* POA&M Requirements Info */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">POA&M Requirements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Plans of Action and Milestones (POA&M) are required for documenting planned remediation actions for identified security control deficiencies.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Document all control weaknesses and deficiencies</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Identify planned remediation actions with timelines</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Assign responsible parties and track progress</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Estimate costs and business impact</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoamGenerator;