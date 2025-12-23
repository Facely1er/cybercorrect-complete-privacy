import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InternalLink, RelatedContent } from '../../components/ui/InternalLinkingHelper';
import { ImportDialog } from '../../components/ui/ImportDialog';
import { validators } from '../../utils/import/jsonValidator';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useJourney } from '../../context/JourneyContext';
import { useAuth } from '../../context/AuthContext';
import JourneyProgressTracker from '../../components/onboarding/JourneyProgressTracker';
import { 
  Eye, 
  CheckCircle, 
  Plus, 
  Edit, 
  Download,
  Upload,
  ArrowRight,
  Users,
  Scale,
  Globe,
  Shield,
  AlertTriangle,
  Info,
  Trash2
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/storage';
import {
  getProcessingActivities,
  createProcessingActivity,
  updateProcessingActivity,
  deleteProcessingActivity,
  exportToCSV,
  exportToPDF,
  type ProcessingActivity,
} from '../../services/ropaService';
import { logError } from '../../utils/common/logger';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/Dialog';
import { Select } from '../../components/ui/Select';

const GdprMapper = () => {
  usePageTitle('GDPR Mapper');
  const { markToolStarted, markToolCompleted, currentStepIndex, completedSteps } = useJourney();
  const { user } = useAuth();
  
  const [activities, setActivities] = useState<ProcessingActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ProcessingActivity | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ProcessingActivity>>({});

  // Mark tool as started when component mounts
  useEffect(() => {
    markToolStarted('gdpr-mapper');
  }, [markToolStarted]);

  // Load activities on mount
  useEffect(() => {
    loadActivities();
  }, []);

  // Save selected activity to localStorage for persistence
  useEffect(() => {
    if (selectedActivity) {
      secureStorage.setItem('gdpr_selected_activity', selectedActivity);
    }
  }, [selectedActivity]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const loaded = await getProcessingActivities();
      setActivities(loaded);
      
      // Restore selected activity from localStorage
      const savedSelected = secureStorage.getItem<string | null>('gdpr_selected_activity', null);
      if (savedSelected && loaded.some(a => a.id === savedSelected)) {
        setSelectedActivity(savedSelected);
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error loading activities'), { component: 'GdprMapper' });
      toast.error('Load failed', 'Failed to load processing activities. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    try {
      setSaving(true);
      const newActivity = await createProcessingActivity({
        name: 'New Processing Activity',
        purpose: '',
        legalBasis: 'consent',
        dataTypes: [],
        dataSubjects: [],
        recipients: [],
        retentionPeriod: '',
        riskLevel: 'medium',
        dataController: 'Your Organization',
        createdBy: user?.name || user?.email || 'Current User',
      });
      
      setActivities(prev => [...prev, newActivity]);
      setSelectedActivity(newActivity.id || null);
      
      // Mark tool as completed when first activity is created
      if (activities.length === 0) {
        markToolCompleted('gdpr-mapper');
      }
      
      toast.success('Activity Added', 'New processing activity has been added');
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error creating activity'), { component: 'GdprMapper', operation: 'createActivity' });
      toast.error('Create failed', error instanceof Error ? error.message : 'Failed to create processing activity');
    } finally {
      setSaving(false);
    }
  };

  const handleImportData = async (importedData: Partial<ProcessingActivity>[]) => {
    try {
      const newActivities: ProcessingActivity[] = [];
      
      for (const item of importedData) {
        const activity = await createProcessingActivity({
          name: item.name || 'Imported Activity',
          purpose: item.purpose || '',
          legalBasis: item.legalBasis || 'consent',
          dataTypes: Array.isArray(item.dataTypes) ? item.dataTypes : [],
          dataSubjects: Array.isArray(item.dataSubjects) ? item.dataSubjects : [],
          recipients: Array.isArray(item.recipients) ? item.recipients : [],
          retentionPeriod: item.retentionPeriod || '',
          riskLevel: item.riskLevel || 'medium',
          dataController: item.dataController || 'Your Organization',
          createdBy: item.createdBy || 'Imported',
          dpiaRequired: item.dpiaRequired,
          thirdCountryTransfers: item.thirdCountryTransfers,
          securityMeasures: item.securityMeasures,
        });
        newActivities.push(activity);
      }

      // Reload all activities
      await loadActivities();

      toast.success(
        'Import Successful',
        `Imported ${newActivities.length} processing activity(ies)`
      );
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import processing activities');
    }
  };

  const handleEditActivity = (activity: ProcessingActivity) => {
    setEditingActivity(activity);
    setEditFormData({
      name: activity.name,
      description: activity.description,
      purpose: activity.purpose,
      legalBasis: activity.legalBasis,
      dataTypes: [...activity.dataTypes],
      dataSubjects: [...activity.dataSubjects],
      recipients: [...activity.recipients],
      thirdCountryTransfers: activity.thirdCountryTransfers ? [...activity.thirdCountryTransfers] : [],
      retentionPeriod: activity.retentionPeriod,
      securityMeasures: activity.securityMeasures ? [...activity.securityMeasures] : [],
      riskLevel: activity.riskLevel,
      dpiaRequired: activity.dpiaRequired,
      dataController: activity.dataController,
      dataProcessor: activity.dataProcessor,
      processingLocation: activity.processingLocation,
      automatedDecisionMaking: activity.automatedDecisionMaking,
      profiling: activity.profiling,
      notes: activity.notes,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingActivity?.id) return;

    try {
      setSaving(true);
      const updated = await updateProcessingActivity(editingActivity.id, {
        ...editFormData,
        updatedBy: user?.name || user?.email || 'Current User',
      });

      setActivities(prev => prev.map(a => a.id === editingActivity.id ? updated : a));
      if (selectedActivity === editingActivity.id) {
        setSelectedActivity(updated.id || null);
      }
      
      setShowEditDialog(false);
      setEditingActivity(null);
      toast.success('Activity Updated', 'Processing activity has been updated successfully');
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error updating activity'), {
        component: 'GdprMapper',
        operation: 'updateActivity',
      });
      toast.error('Update failed', error instanceof Error ? error.message : 'Failed to update processing activity');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this processing activity?')) {
      return;
    }

    try {
      setSaving(true);
      await deleteProcessingActivity(id);
      setActivities(prev => prev.filter(a => a.id !== id));
      if (selectedActivity === id) {
        setSelectedActivity(null);
      }
      toast.success('Activity Deleted', 'Processing activity has been deleted');
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error deleting activity'), { component: 'GdprMapper', operation: 'deleteActivity' });
      toast.error('Delete failed', error instanceof Error ? error.message : 'Failed to delete processing activity');
    } finally {
      setSaving(false);
    }
  };

  const getMappingData = () => {
    return {
      metadata: {
        title: 'GDPR Data Processing Mapping',
        created: new Date().toISOString(),
        version: '1.0',
        organization: ''
      },
      processingActivities: activities,
      compliance: {
        framework: 'GDPR',
        articles: ['Article 6', 'Article 30', 'Article 32'],
        dpiaRequired: activities.some(a => a.riskLevel === 'high' || a.riskLevel === 'critical' || a.dpiaRequired)
      }
    };
  };

  const handleExportMapping = async (format: 'json' | 'pdf' | 'csv' = 'json') => {
    if (activities.length === 0) {
      toast.error('No data', 'No processing activities to export');
      return;
    }

    try {
      setIsExporting(true);

      if (format === 'csv') {
        const csv = exportToCSV(activities);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ropa-records-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Mapping exported", "GDPR processing mapping has been exported as CSV");
        markToolCompleted('gdpr-mapper');
      } else if (format === 'pdf') {
        await exportToPDF(activities);
        toast.success("Mapping exported", "GDPR processing mapping has been exported as PDF");
        markToolCompleted('gdpr-mapper');
      } else {
        // JSON export
        const mappingData = getMappingData();
        const blob = new Blob([JSON.stringify(mappingData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gdpr-processing-mapping-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Mapping exported", "GDPR processing mapping has been exported as JSON");
        markToolCompleted('gdpr-mapper');
      }
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Error exporting'), { component: 'GdprMapper', operation: 'export' });
      toast.error("Export failed", "Failed to export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getLegalBasisColor = (basis: string) => {
    const normalizedBasis = basis.replace(/_/g, ' ').toLowerCase();
    const colors: Record<string, string> = {
      'consent': 'bg-primary/10 text-primary',
      'contract': 'bg-success/10 text-success',
      'legal obligation': 'bg-accent/10 text-accent',
      'vital interests': 'bg-destructive/10 text-destructive',
      'public task': 'bg-primary/10 text-primary',
      'legitimate interests': 'bg-warning/10 text-warning'
    };
    return colors[normalizedBasis] || 'bg-muted text-muted-foreground';
  };
  
  const formatLegalBasis = (basis: string) => {
    return basis.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="page-container">
      <JourneyProgressTracker 
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        compact={true}
        showNextAction={true}
      />
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">GDPR Data Processing Mapper</h1>
            <p className="page-description">Map and document personal data processing activities for GDPR compliance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddActivity} disabled={saving || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
            <Button variant="outline" onClick={() => setShowImportDialog(true)} title="Import Processing Activities">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={() => handleExportMapping('csv')} disabled={isExporting || activities.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExportMapping('json')} disabled={isExporting || activities.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={() => handleExportMapping('pdf')} disabled={isExporting || activities.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing Activities List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2 text-primary" />
                Data Processing Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading processing activities...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No processing activities yet</p>
                  <Button variant="outline" onClick={handleAddActivity}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Activity
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                  <Card 
                    key={activity.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedActivity === activity.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedActivity(activity.id || null)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{activity.name}</h3>
                          <p className="text-sm text-muted-foreground">{activity.purpose}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(activity.riskLevel)}`}>
                            {activity.riskLevel.toUpperCase()} RISK
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLegalBasisColor(activity.legalBasis)}`}>
                            {formatLegalBasis(activity.legalBasis)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Data Types:</span>
                          <div className="mt-1">
                            {activity.dataTypes.slice(0, 2).map((type, idx) => (
                              <span key={idx} className="inline-block bg-muted text-muted-foreground px-1 py-0.5 rounded mr-1">
                                {type}
                              </span>
                            ))}
                            {activity.dataTypes.length > 2 && (
                              <span className="text-muted-foreground">+{activity.dataTypes.length - 2} more</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Data Subjects:</span>
                          <div className="mt-1">
                            {activity.dataSubjects.map((subject, idx) => (
                              <span key={idx} className="inline-block bg-muted text-muted-foreground px-1 py-0.5 rounded mr-1">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Retention:</span>
                          <div className="mt-1 text-muted-foreground">{activity.retentionPeriod}</div>
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

        {/* Activity Details Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Activity Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedActivity ? (
                <div className="space-y-4">
                  {(() => {
                    const activity = activities.find(a => a.id === selectedActivity);
                    if (!activity) return null;
                    
                    return (
                      <>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{activity.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{activity.purpose}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Legal Basis</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getLegalBasisColor(activity.legalBasis)}`}>
                            {formatLegalBasis(activity.legalBasis)}
                          </span>
                        </div>
                        
                        {activity.description && (
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        )}
                        
                        {activity.dataController && (
                          <div>
                            <h4 className="font-medium mb-2">Data Controller</h4>
                            <p className="text-sm text-muted-foreground">{activity.dataController}</p>
                          </div>
                        )}
                        
                        {activity.retentionPeriod && (
                          <div>
                            <h4 className="font-medium mb-2">Retention Period</h4>
                            <p className="text-sm text-muted-foreground">{activity.retentionPeriod}</p>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium mb-2">Personal Data Categories</h4>
                          <div className="space-y-1">
                            {activity.dataTypes.map((type, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <CheckCircle className="h-3 w-3 text-primary mr-2" />
                                <span>{type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Data Subjects</h4>
                          <div className="space-y-1">
                            {activity.dataSubjects.map((subject, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <Users className="h-3 w-3 text-primary mr-2" />
                                <span>{subject}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Recipients</h4>
                          <div className="space-y-1">
                            {activity.recipients.map((recipient, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <Globe className="h-3 w-3 text-primary mr-2" />
                                <span>{recipient}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                         <div className="pt-4 space-y-2">
                           <Button 
                             variant="outline" 
                             className="w-full" 
                             disabled={saving}
                             onClick={() => activity && handleEditActivity(activity)}
                           >
                             <Edit className="h-4 w-4 mr-2" />
                             Edit Activity
                           </Button>
                           <Button 
                             variant="outline" 
                             className="w-full text-destructive hover:text-destructive" 
                             onClick={() => activity.id && handleDeleteActivity(activity.id)}
                             disabled={saving}
                           >
                             <Trash2 className="h-4 w-4 mr-2" />
                             Delete Activity
                           </Button>
                         </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a processing activity to view its details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GDPR Compliance Check */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                GDPR Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Records of Processing (Art. 30)</span>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lawful Basis Documented</span>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Subject Rights</span>
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DPIA Required</span>
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <Link to="/toolkit/resources/viewers/dpia-template">
                  <Button variant="outline" size="sm" className="w-full">
                    Generate DPIA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* GDPR Requirements Info */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">GDPR Article 30 - Records of Processing</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Organizations must maintain records of all personal data processing activities under GDPR Article 30.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Document purposes of processing for each activity</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Identify categories of data subjects and personal data</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Map data recipients and international transfers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Define retention periods and security measures</span>
                </li>
              </ul>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Next Steps:</p>
                <InternalLink href="/toolkit/privacy-rights-manager" className="text-sm block">
                  → Set up data subject rights management
                </InternalLink>
                <InternalLink href="/toolkit/dpia-generator" className="text-sm block">
                  → Generate DPIAs for high-risk processing
                </InternalLink>
                <InternalLink href="/documentation/gdpr-implementation-guide" className="text-sm block">
                  → Read complete GDPR implementation guide
                </InternalLink>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add related content */}
        <RelatedContent currentPath="/toolkit/gdpr-mapper" />

        {/* Import Dialog */}
        <ImportDialog<ProcessingActivity>
          open={showImportDialog}
          onClose={() => setShowImportDialog(false)}
          onImport={handleImportData}
          title="Import Processing Activities"
          description="Upload a CSV or JSON file containing GDPR processing activities (Article 30 records)"
          csvHeaders={[
            'id',
            'name',
            'purpose',
            'legalBasis',
            'dataTypes',
            'dataSubjects',
            'recipients',
            'retentionPeriod',
            'riskLevel',
            'dataController',
            'dpiaRequired',
            'thirdCountryTransfers',
            'securityMeasures'
          ]}
          jsonValidation={{
            required: ['name', 'purpose', 'legalBasis'],
            schema: {
              name: validators.isString,
              purpose: validators.isString,
              legalBasis: validators.oneOf(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),
              riskLevel: validators.oneOf(['low', 'medium', 'high', 'critical']),
              dpiaRequired: validators.isBoolean,
            },
          }}
          maxRecords={500}
        />

        {/* Edit Activity Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Processing Activity</DialogTitle>
              <DialogDescription>
                Update the details of this GDPR processing activity
              </DialogDescription>
            </DialogHeader>

            {editingActivity && (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Activity Name *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-purpose">Purpose *</Label>
                  <Textarea
                    id="edit-purpose"
                    value={editFormData.purpose || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, purpose: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-legalBasis">Legal Basis *</Label>
                    <select
                      id="edit-legalBasis"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editFormData.legalBasis || 'consent'}
                      onChange={(e) => setEditFormData({ ...editFormData, legalBasis: e.target.value as ProcessingActivity['legalBasis'] })}
                      required
                    >
                      <option value="consent">Consent</option>
                      <option value="contract">Contract</option>
                      <option value="legal_obligation">Legal Obligation</option>
                      <option value="vital_interests">Vital Interests</option>
                      <option value="public_task">Public Task</option>
                      <option value="legitimate_interests">Legitimate Interests</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="edit-riskLevel">Risk Level *</Label>
                    <select
                      id="edit-riskLevel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editFormData.riskLevel || 'medium'}
                      onChange={(e) => setEditFormData({ ...editFormData, riskLevel: e.target.value as ProcessingActivity['riskLevel'] })}
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-retentionPeriod">Retention Period *</Label>
                  <Input
                    id="edit-retentionPeriod"
                    value={editFormData.retentionPeriod || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, retentionPeriod: e.target.value })}
                    placeholder="e.g., 7 years, Until account deletion"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-dataController">Data Controller *</Label>
                  <Input
                    id="edit-dataController"
                    value={editFormData.dataController || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, dataController: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-dataTypes">Data Types (comma-separated)</Label>
                  <Input
                    id="edit-dataTypes"
                    value={editFormData.dataTypes?.join(', ') || ''}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      dataTypes: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                    })}
                    placeholder="e.g., Name, Email, Phone Number"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-dataSubjects">Data Subjects (comma-separated)</Label>
                  <Input
                    id="edit-dataSubjects"
                    value={editFormData.dataSubjects?.join(', ') || ''}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      dataSubjects: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                    })}
                    placeholder="e.g., Customers, Employees, Visitors"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-recipients">Recipients (comma-separated)</Label>
                  <Input
                    id="edit-recipients"
                    value={editFormData.recipients?.join(', ') || ''}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      recipients: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                    })}
                    placeholder="e.g., Cloud Provider, Analytics Service"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-dpiaRequired"
                      checked={editFormData.dpiaRequired || false}
                      onChange={(e) => setEditFormData({ ...editFormData, dpiaRequired: e.target.checked })}
                    />
                    <Label htmlFor="edit-dpiaRequired" className="font-normal cursor-pointer">
                      DPIA Required
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editFormData.notes || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    rows={3}
                    placeholder="Additional notes or comments"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditDialog(false);
                      setEditingActivity(null);
                      setEditFormData({});
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GdprMapper;
