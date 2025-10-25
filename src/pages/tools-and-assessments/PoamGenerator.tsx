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
  Info
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
  const [poamItems] = useState<PoamItem[]>([
    {
      id: 'poam-001',
      controlId: 'AC.L2-3.1.3',
      weakness: 'CUI flow controls not fully implemented',
      description: 'Organization lacks comprehensive controls for managing the flow of CUI in accordance with approved authorizations.',
      priority: 'high',
      status: 'in_progress',
      plannedActions: [
        'Implement data loss prevention (DLP) solution',
        'Configure network segmentation for CUI systems',
        'Develop CUI handling procedures',
        'Train staff on CUI flow requirements'
      ],
      responsibleParty: 'IT Security Manager',
      targetDate: '2024-03-15',
      estimatedCost: 75000,
      businessImpact: 'Medium - Potential compliance violations',
      milestones: [
        {
          description: 'DLP solution procurement and installation',
          targetDate: '2024-02-01',
          status: 'complete'
        },
        {
          description: 'Network segmentation implementation',
          targetDate: '2024-02-28',
          status: 'pending'
        },
        {
          description: 'Staff training completion',
          targetDate: '2024-03-15',
          status: 'pending'
        }
      ]
    },
    {
      id: 'poam-002',
      controlId: 'IA.L2-3.5.3',
      weakness: 'Multifactor authentication not implemented for all accounts',
      description: 'MFA is not consistently implemented for all user accounts accessing CUI systems.',
      priority: 'critical',
      status: 'open',
      plannedActions: [
        'Deploy MFA solution organization-wide',
        'Configure MFA for all user accounts',
        'Implement MFA bypass procedures for emergencies',
        'Update access control policies'
      ],
      responsibleParty: 'Identity Management Team',
      targetDate: '2024-02-15',
      estimatedCost: 45000,
      businessImpact: 'High - Critical security vulnerability',
      milestones: [
        {
          description: 'MFA solution selection and procurement',
          targetDate: '2024-01-15',
          status: 'pending'
        },
        {
          description: 'Pilot deployment and testing',
          targetDate: '2024-01-31',
          status: 'pending'
        },
        {
          description: 'Full organization rollout',
          targetDate: '2024-02-15',
          status: 'pending'
        }
      ]
    },
    {
      id: 'poam-003',
      controlId: 'SI.L2-3.14.1',
      weakness: 'Vulnerability scanning not performed regularly',
      description: 'Organization does not conduct regular vulnerability scans of CUI systems as required.',
      priority: 'medium',
      status: 'open',
      plannedActions: [
        'Implement automated vulnerability scanning solution',
        'Establish scanning schedule and procedures',
        'Develop vulnerability remediation process',
        'Create vulnerability management dashboard'
      ],
      responsibleParty: 'Security Operations Team',
      targetDate: '2024-04-30',
      estimatedCost: 25000,
      businessImpact: 'Medium - Undetected vulnerabilities may persist',
      milestones: [
        {
          description: 'Vulnerability scanner deployment',
          targetDate: '2024-03-01',
          status: 'pending'
        },
        {
          description: 'Process documentation and training',
          targetDate: '2024-04-15',
          status: 'pending'
        },
        {
          description: 'Full operational capability',
          targetDate: '2024-04-30',
          status: 'pending'
        }
      ]
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<string | null>(() => 
    secureStorage.getItem('poam_selected', null)
  );
  
  // Auto-save POAM items
  useEffect(() => {
    secureStorage.setItem('poam_items', poamItems);
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

  const handleExportPoam = () => {
    const poamData = {
      metadata: {
        title: 'Plan of Action and Milestones (POA&M)',
        created: new Date().toISOString(),
        version: '1.0',
        organization: 'Sample Organization',
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
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-200';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200';
      case 'open': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-200';
      case 'risk_accepted': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-200';
      default: return 'text-muted-foreground bg-muted';
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
            <Button onClick={handleExportPoam}>
              <Download className="h-4 w-4 mr-2" />
              Export POA&M
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Items</p>
                <p className="text-2xl font-bold text-red-600">
                  {poamItems.filter(item => item.priority === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {poamItems.filter(item => item.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {poamItems.filter(item => item.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${(poamItems.reduce((sum, item) => sum + item.estimatedCost, 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-purple-600" />
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
              <div className="space-y-4">
                {poamItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedItem === item.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedItem(item.id)}
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
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
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