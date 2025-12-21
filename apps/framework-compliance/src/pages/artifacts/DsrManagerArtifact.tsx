import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const DsrManagerArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'Data Subject Rights Request Manager',
          subtitle: 'GDPR Article 15-22 Request Management',
          timestamp: new Date().toISOString(),
          reportId: `DSR-MANAGER-${Date.now()}`,
          version: '1.0',
          generatedBy: 'DSR Manager Tool'
        },
        {
          'Total Requests': '12',
          'In Progress': '5',
          'Completed': '6',
          'Overdue': '1',
          'On-Time Completion': '98%',
          'Average Response Time': '18 days',
          'SLA Target': '30 days'
        },
        [
          {
            title: 'Active Requests',
            headers: ['Request ID', 'Requester', 'Type', 'Status', 'Days Remaining'],
            rows: [
              ['DSR-2025-001', 'john.doe@example.com', 'Access Request (Article 15)', 'In Progress', '22 days'],
              ['DSR-2025-002', 'jane.smith@example.com', 'Erasure Request (Article 17)', 'Completed', '-'],
              ['DSR-2025-003', 'bob.wilson@example.com', 'Portability Request (Article 20)', 'Under Review', '27 days'],
              ['DSR-2025-004', 'alice.brown@example.com', 'Rectification Request (Article 16)', 'Overdue', '-5 days']
            ]
          },
          {
            title: 'Request Types Supported',
            headers: ['Article', 'Right', 'Description'],
            rows: [
              ['Article 15', 'Right of Access', 'Obtain confirmation and copy of personal data'],
              ['Article 16', 'Right to Rectification', 'Correct inaccurate or incomplete data'],
              ['Article 17', 'Right to Erasure', 'Request deletion ("right to be forgotten")'],
              ['Article 18', 'Right to Restrict Processing', 'Limit processing in certain circumstances'],
              ['Article 20', 'Right to Data Portability', 'Receive data in structured, machine-readable format'],
              ['Article 21', 'Right to Object', 'Object to processing based on legitimate interests']
            ]
          }
        ],
        `dsr-manager-${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Data Subject Rights Request Manager</h1>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Request Dashboard Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-3xl font-bold text-foreground mb-2">12</div>
              <div className="text-foreground/70">Total Requests</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">5</div>
              <div className="text-foreground/70">In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">6</div>
              <div className="text-foreground/70">Completed</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">1</div>
              <div className="text-foreground/70">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Active Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left text-foreground">Request ID</th>
                  <th className="p-3 text-left text-foreground">Requester</th>
                  <th className="p-3 text-left text-foreground">Type</th>
                  <th className="p-3 text-left text-foreground">Submitted</th>
                  <th className="p-3 text-left text-foreground">Status</th>
                  <th className="p-3 text-left text-foreground">Days Remaining</th>
                  <th className="p-3 text-left text-foreground">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3 text-foreground/80">DSR-2025-001</td>
                  <td className="p-3 text-foreground/80">john.doe@example.com</td>
                  <td className="p-3 text-foreground/80">Access Request (Article 15)</td>
                  <td className="p-3 text-foreground/80">{new Date(Date.now() - 8*24*60*60*1000).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                      In Progress
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80 font-semibold">22 days</td>
                  <td className="p-3 text-foreground/80">Privacy Team</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-foreground/80">DSR-2025-002</td>
                  <td className="p-3 text-foreground/80">jane.smith@example.com</td>
                  <td className="p-3 text-foreground/80">Erasure Request (Article 17)</td>
                  <td className="p-3 text-foreground/80">{new Date(Date.now() - 15*24*60*60*1000).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm">
                      Completed
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">-</td>
                  <td className="p-3 text-foreground/80">Data Team</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-foreground/80">DSR-2025-003</td>
                  <td className="p-3 text-foreground/80">bob.wilson@example.com</td>
                  <td className="p-3 text-foreground/80">Portability Request (Article 20)</td>
                  <td className="p-3 text-foreground/80">{new Date(Date.now() - 3*24*60*60*1000).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                      Under Review
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">27 days</td>
                  <td className="p-3 text-foreground/80">IT Team</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3 text-foreground/80">DSR-2025-004</td>
                  <td className="p-3 text-foreground/80">alice.brown@example.com</td>
                  <td className="p-3 text-foreground/80">Rectification Request (Article 16)</td>
                  <td className="p-3 text-foreground/80">{new Date(Date.now() - 35*24*60*60*1000).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-sm">
                      Overdue
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80 font-semibold text-red-600 dark:text-red-400">-5 days</td>
                  <td className="p-3 text-foreground/80">Privacy Team</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Request Types Supported</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Article 15 - Right of Access:</strong>
              <p className="text-foreground/70 mt-2">Obtain confirmation and copy of personal data</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Article 16 - Right to Rectification:</strong>
              <p className="text-foreground/70 mt-2">Correct inaccurate or incomplete data</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Article 17 - Right to Erasure:</strong>
              <p className="text-foreground/70 mt-2">Request deletion ("right to be forgotten")</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Article 18 - Right to Restrict Processing:</strong>
              <p className="text-foreground/70 mt-2">Limit processing in certain circumstances</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Article 20 - Right to Data Portability:</strong>
              <p className="text-foreground/70 mt-2">Receive data in structured, machine-readable format</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Article 21 - Right to Object:</strong>
              <p className="text-foreground/70 mt-2">Object to processing based on legitimate interests</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Request Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                1
              </div>
              <div className="flex-1 p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Request Received:</strong>
                <p className="text-foreground/70 mt-1">Automated acknowledgment sent, request logged</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold">
                2
              </div>
              <div className="flex-1 p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Identity Verification:</strong>
                <p className="text-foreground/70 mt-1">Requester identity verified, additional info requested if needed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                3
              </div>
              <div className="flex-1 p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Data Collection:</strong>
                <p className="text-foreground/70 mt-1">Relevant data identified and collected from all systems</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                4
              </div>
              <div className="flex-1 p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Response Preparation:</strong>
                <p className="text-foreground/70 mt-1">Response prepared, reviewed, and formatted according to request type</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                5
              </div>
              <div className="flex-1 p-4 bg-muted/50 rounded">
                <strong className="text-foreground">Response Delivered:</strong>
                <p className="text-foreground/70 mt-1">Response sent to requester, request marked as completed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compliance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded text-center">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">98%</div>
              <div className="text-foreground/70">On-Time Completion</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded text-center">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">18 days</div>
              <div className="text-foreground/70">Average Response Time</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded text-center">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">30 days</div>
              <div className="text-foreground/70">SLA Target</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Automated Tracking:</strong>
              <p className="text-foreground/70 mt-2">30-day compliance window tracking with automated reminders</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Multi-Channel Support:</strong>
              <p className="text-foreground/70 mt-2">Email, web form, phone, postal mail integration</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Identity Verification:</strong>
              <p className="text-foreground/70 mt-2">Automated and manual verification workflows</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Data Discovery:</strong>
              <p className="text-foreground/70 mt-2">Automated data location across all systems</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Response Generation:</strong>
              <p className="text-foreground/70 mt-2">Automated response templates and formatting</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Export & Reporting:</strong>
              <p className="text-foreground/70 mt-2">Export to PDF, Excel, CSV for audit and reporting</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded">
            <p className="text-sm text-foreground/70">
              ✓ Track all GDPR Article 15-22 requests | ✓ 30-day compliance window | ✓ Automated reminders | ✓ Identity verification | ✓ Data discovery | ✓ Response generation | ✓ Multi-channel support | ✓ SLA tracking | ✓ Export capabilities | ✓ Audit trail
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DsrManagerArtifact;

