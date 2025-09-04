import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  ArrowLeft, 
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Plus,
  FileText,
  Shield
} from 'lucide-react';
import { toast } from '../../components/ui/Toaster';

interface DataSubjectRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  submittedDate: string;
  dueDate: string;
  requesterName: string;
  requesterEmail: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  completedDate?: string;
  responseNotes?: string;
}

const PrivacyRightsManager = () => {
  const [requests, setRequests] = useState<DataSubjectRequest[]>([
    {
      id: 'DSR-001',
      type: 'access',
      status: 'pending',
      submittedDate: '2024-01-15',
      dueDate: '2024-02-14',
      requesterName: 'John Smith',
      requesterEmail: 'john.smith@email.com',
      description: 'Request for access to all personal data held by the organization',
      priority: 'medium',
      assignedTo: 'Data Protection Officer'
    },
    {
      id: 'DSR-002',
      type: 'erasure',
      status: 'in_progress',
      submittedDate: '2024-01-10',
      dueDate: '2024-02-09',
      requesterName: 'Jane Doe',
      requesterEmail: 'jane.doe@email.com',
      description: 'Request for deletion of account and all associated personal data',
      priority: 'high',
      assignedTo: 'Data Steward'
    },
    {
      id: 'DSR-003',
      type: 'portability',
      status: 'completed',
      submittedDate: '2024-01-05',
      dueDate: '2024-02-04',
      requesterName: 'Bob Johnson',
      requesterEmail: 'bob.johnson@email.com',
      description: 'Request for data export in machine-readable format',
      priority: 'low',
      assignedTo: 'IT Administrator',
      completedDate: '2024-01-20',
      responseNotes: 'Data export provided via secure email'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showNewRequest] = useState(false);

  const getRequestTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'access': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      'rectification': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      'erasure': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      'portability': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      'restriction': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
      'objection': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
      'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return <Eye className="h-4 w-4" />;
      case 'rectification': return <Edit className="h-4 w-4" />;
      case 'erasure': return <AlertTriangle className="h-4 w-4" />;
      case 'portability': return <Download className="h-4 w-4" />;
      case 'restriction': return <Shield className="h-4 w-4" />;
      case 'objection': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: DataSubjectRequest['status']) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
    toast.success('Status updated', `Request ${requestId} status changed to ${newStatus}`);
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
            <h1 className="text-3xl font-bold text-foreground">Privacy Rights Manager</h1>
            <p className="text-muted-foreground">
              Manage data subject rights requests and ensure timely compliance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowNewRequest(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {requests.filter(req => req.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">
                  {requests.filter(req => req.status === 'in_progress').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter(req => req.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Response</p>
                <p className="text-3xl font-bold text-purple-600">18</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Data Subject Requests ({requests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card 
                    key={request.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRequest === request.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-primary">{request.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getRequestTypeColor(request.type)}`}>
                            {getRequestTypeIcon(request.type)}
                            <span className="ml-1 capitalize">{request.type}</span>
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold text-foreground">Due: {new Date(request.dueDate).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {Math.ceil((new Date(request.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-2">{request.requesterName}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Email:</span>
                          <div className="text-muted-foreground">{request.requesterEmail}</div>
                        </div>
                        <div>
                          <span className="font-medium">Assigned To:</span>
                          <div className="text-muted-foreground">{request.assignedTo}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Details Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRequest ? (
                <div className="space-y-4">
                  {(() => {
                    const request = requests.find(r => r.id === selectedRequest);
                    if (!request) return null;
                    
                    return (
                      <>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{request.id}</h3>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <div className="font-medium capitalize">{request.type}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Priority:</span>
                            <div className="font-medium capitalize">{request.priority}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Submitted:</span>
                            <div className="font-medium">{new Date(request.submittedDate).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Due:</span>
                            <div className="font-medium">{new Date(request.dueDate).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Requester Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-primary mr-2" />
                              <span>{request.requesterName}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-primary mr-2" />
                              <span>{request.requesterEmail}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Status Actions</h4>
                          <div className="space-y-2">
                            {['pending', 'in_progress', 'completed', 'rejected'].map(status => (
                              <Button
                                key={status}
                                variant={request.status === status ? 'default' : 'outline'}
                                size="sm"
                                className="w-full"
                                onClick={() => handleStatusUpdate(request.id, status as 'pending' | 'in_progress' | 'completed' | 'rejected')}
                              >
                                {status.replace('_', ' ').toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a request to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rights Information */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">Data Subject Rights Under GDPR</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Organizations must respond to data subject requests within one month under GDPR Articles 15-22.
            </p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Right to access personal data (Article 15)</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Right to rectification of inaccurate data (Article 16)</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Right to erasure "right to be forgotten" (Article 17)</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span>Right to data portability (Article 20)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyRightsManager;