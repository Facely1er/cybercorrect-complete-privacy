import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const ComplianceRoadmapArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'Compliance Roadmap',
          subtitle: 'Risk-Based Remediation Plan',
          timestamp: new Date().toISOString(),
          reportId: `ROADMAP-${Date.now()}`,
          version: '1.0',
          generatedBy: 'Compliance Roadmap Generator'
        },
        {
          'Total Action Items': '12',
          'High Priority': '4',
          'Medium Priority': '5',
          'Low Priority': '3',
          'In Progress': '3',
          'Planned': '9'
        },
        [
          {
            title: 'Action Items',
            headers: ['Priority', 'Action Item', 'Timeline', 'Status', 'Owner'],
            rows: [
              ['High', 'Update data retention policies', '30 days', 'In Progress', 'Legal & Compliance'],
              ['High', 'Enhance consent mechanisms', '60 days', 'Planned', 'Product & Engineering'],
              ['Medium', 'Formalize DPIA process', '45 days', 'Planned', 'Privacy Team'],
              ['Medium', 'Streamline DSR procedures', '30 days', 'In Progress', 'Privacy & IT']
            ]
          }
        ],
        `compliance-roadmap-${new Date().toISOString().split('T')[0]}.pdf`
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
          <h1 className="text-3xl font-bold text-foreground">Compliance Roadmap</h1>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Roadmap Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-3xl font-bold text-foreground mb-2">12</div>
              <div className="text-foreground/70">Total Items</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">4</div>
              <div className="text-foreground/70">High Priority</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">5</div>
              <div className="text-foreground/70">Medium Priority</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">3</div>
              <div className="text-foreground/70">Low Priority</div>
            </div>
          </div>
          <p className="text-foreground/80">
            This risk-based compliance roadmap prioritizes remediation actions based on compliance gaps, regulatory requirements, and business impact. Each action item includes timeline, ownership, and status tracking.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left text-foreground">Priority</th>
                  <th className="p-3 text-left text-foreground">Action Item</th>
                  <th className="p-3 text-left text-foreground">Timeline</th>
                  <th className="p-3 text-left text-foreground">Status</th>
                  <th className="p-3 text-left text-foreground">Owner</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3">
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-sm">
                      High
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Update data retention policies</td>
                  <td className="p-3 text-foreground/80">30 days</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                      In Progress
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Legal & Compliance</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-sm">
                      Medium
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Enhance consent mechanisms</td>
                  <td className="p-3 text-foreground/80">60 days</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                      Planned
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Product & Engineering</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                      Medium
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Formalize DPIA process</td>
                  <td className="p-3 text-foreground/80">45 days</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                      Planned
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Privacy Team</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                      Low
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Update privacy notices</td>
                  <td className="p-3 text-foreground/80">14 days</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-sm">
                      Completed
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Legal</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-sm">
                      High
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Implement data minimization controls</td>
                  <td className="p-3 text-foreground/80">45 days</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm">
                      Planned
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Engineering</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                      Medium
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Establish vendor risk assessment process</td>
                  <td className="p-3 text-foreground/80">60 days</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-sm">
                      In Progress
                    </span>
                  </td>
                  <td className="p-3 text-foreground/80">Procurement & Privacy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Timeline View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-6 pl-12">
                <div className="relative">
                  <div className="absolute -left-8 top-2 w-4 h-4 rounded-full bg-red-500"></div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-foreground">Update Data Retention Policies</strong>
                      <span className="text-sm text-foreground/70">Days 1-30</span>
                    </div>
                    <p className="text-foreground/70 text-sm">High Priority | Owner: Legal & Compliance</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-2 w-4 h-4 rounded-full bg-yellow-500"></div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-foreground">Enhance Consent Mechanisms</strong>
                      <span className="text-sm text-foreground/70">Days 31-90</span>
                    </div>
                    <p className="text-foreground/70 text-sm">High Priority | Owner: Product & Engineering</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-8 top-2 w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-foreground">Formalize DPIA Process</strong>
                      <span className="text-sm text-foreground/70">Days 46-90</span>
                    </div>
                    <p className="text-foreground/70 text-sm">Medium Priority | Owner: Privacy Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Risk-Based Prioritization:</strong>
              <p className="text-foreground/70 mt-2">Actions prioritized by compliance risk, regulatory requirements, and business impact</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Timeline Tracking:</strong>
              <p className="text-foreground/70 mt-2">Clear timelines and milestones for each action item with progress tracking</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Ownership Assignment:</strong>
              <p className="text-foreground/70 mt-2">Each item assigned to specific teams or individuals with accountability</p>
            </div>
            <div className="p-4 bg-muted/50 rounded">
              <strong className="text-foreground">Status Monitoring:</strong>
              <p className="text-foreground/70 mt-2">Real-time status updates and progress tracking for all roadmap items</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-primary/10 rounded">
            <p className="text-sm text-foreground/70">
              ✓ Automated roadmap generation with risk-based prioritization | ✓ Timeline tracking | ✓ Priority levels | ✓ Milestone management | ✓ Status updates | ✓ Export capabilities
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceRoadmapArtifact;

