import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf';

const GapAnalysisReportArtifact: React.FC = () => {
  const navigate = useNavigate();

  const handleExportPdf = async () => {
    try {
      await generateDataExportPdf(
        {
          title: 'Privacy Gap Analysis Report',
          subtitle: 'Comprehensive Compliance Assessment',
          timestamp: new Date().toISOString(),
          reportId: `GAP-ANALYSIS-${Date.now()}`,
          version: '1.0',
          generatedBy: 'Gap Analysis Tool'
        },
        {
          'Overall Compliance': '65%',
          'Compliant Controls': '65%',
          'Partial Controls': '25%',
          'Gap Controls': '10%',
          'Assessment Date': new Date().toLocaleDateString(),
          'Frameworks Assessed': 'GDPR, CCPA, NIST Privacy Framework'
        },
        [
          {
            title: 'Key Findings',
            headers: ['Finding', 'Priority', 'Status'],
            rows: [
              ['Data retention policies need updating to align with GDPR requirements', 'High', 'In Progress'],
              ['Consent mechanisms require enhancement for explicit opt-in', 'High', 'Planned'],
              ['DPIA process needs formalization and documentation', 'Medium', 'Planned'],
              ['Data subject rights procedures need streamlining', 'Medium', 'In Progress']
            ]
          },
          {
            title: 'Compliance Breakdown',
            headers: ['Framework', 'Compliance Score', 'Status'],
            rows: [
              ['GDPR', '68%', 'Partial Compliance'],
              ['CCPA', '72%', 'Partial Compliance'],
              ['NIST Privacy Framework', '58%', 'Needs Improvement']
            ]
          }
        ],
        `gap-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Privacy Gap Analysis Report</h1>
            <p className="text-sm text-foreground/60">Comprehensive Compliance Assessment</p>
          </div>
        </div>
        <Button onClick={handleExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-green-50 dark:bg-green-900/30 rounded-lg text-center border-2 border-green-200 dark:border-green-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="text-5xl font-bold text-green-700 dark:text-green-300 mb-2">65%</div>
              <div className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Compliant</div>
              <div className="text-xs text-foreground/60 mt-1">Controls</div>
            </div>
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-center border-2 border-yellow-200 dark:border-yellow-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="text-5xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">25%</div>
              <div className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Partial</div>
              <div className="text-xs text-foreground/60 mt-1">Implementation</div>
            </div>
            <div className="p-6 bg-red-50 dark:bg-red-900/30 rounded-lg text-center border-2 border-red-200 dark:border-red-800 shadow-sm transition-shadow hover:shadow-md">
              <div className="text-5xl font-bold text-red-700 dark:text-red-300 mb-2">10%</div>
              <div className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Gaps</div>
              <div className="text-xs text-foreground/60 mt-1">Require Action</div>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-foreground/80 leading-relaxed mb-3">
              This comprehensive gap analysis report evaluates your organization's privacy compliance posture across multiple frameworks including GDPR, CCPA, and NIST Privacy Framework. The assessment identifies areas of compliance, partial implementation, and gaps requiring remediation.
            </p>
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-foreground/70">
                <span className="font-semibold text-foreground">Assessment Methodology:</span> This report uses risk-weighted compliance scoring with framework-specific control mapping. Scores are calculated based on control implementation status (Yes=2, Partial=1, No=0) with weighted priority levels and maturity thresholds.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Key Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-foreground text-lg">Data Retention Policies</strong>
                <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-xs font-semibold uppercase tracking-wide">
                  High Priority
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-2">Data retention policies need updating to align with GDPR Article 5(1)(e) (storage limitation principle) and Article 17 (right to erasure). Current policies do not specify retention periods for all data categories and lack automated deletion procedures. This gap affects compliance with GDPR, CCPA Section 1798.105 (right to deletion), and NIST Privacy Framework ID-PI-5 (data retention controls).</p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-red-200 dark:border-red-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Status:</span>
                  <span className="px-2 py-0.5 bg-foreground/10 text-foreground/80 rounded text-xs font-medium">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Risk Level:</span>
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs font-medium">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Affected Frameworks:</span>
                  <span className="text-xs text-foreground/70">GDPR, CCPA, NIST</span>
                </div>
              </div>
            </div>
            <div className="p-5 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-foreground text-lg">Consent Mechanisms</strong>
                <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-md text-xs font-semibold uppercase tracking-wide">
                  High Priority
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-2">Consent mechanisms require enhancement for explicit opt-in. Current consent collection does not meet GDPR Article 7 (conditions for consent) and Article 6(1)(a) (lawful basis) requirements for clear, affirmative action. Additionally, CCPA Section 1798.135 requires clear opt-out mechanisms, and NIST Privacy Framework CM-DP-3 (consent management) controls need implementation.</p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-orange-200 dark:border-orange-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Status:</span>
                  <span className="px-2 py-0.5 bg-foreground/10 text-foreground/80 rounded text-xs font-medium">Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Risk Level:</span>
                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded text-xs font-medium">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Affected Frameworks:</span>
                  <span className="text-xs text-foreground/70">GDPR, CCPA, NIST</span>
                </div>
              </div>
            </div>
            <div className="p-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-foreground text-lg">DPIA Process</strong>
                <span className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md text-xs font-semibold uppercase tracking-wide">
                  Medium Priority
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-2">DPIA process needs formalization and documentation. While some assessments have been conducted, there is no standardized process or documentation template. GDPR Article 35 requires Data Protection Impact Assessments for high-risk processing activities. This aligns with NIST Privacy Framework ID-PI-4 (risk assessment) and supports compliance with GDPR Article 25 (data protection by design and by default).</p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Status:</span>
                  <span className="px-2 py-0.5 bg-foreground/10 text-foreground/80 rounded text-xs font-medium">Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Risk Level:</span>
                  <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Affected Frameworks:</span>
                  <span className="text-xs text-foreground/70">GDPR, NIST</span>
                </div>
              </div>
            </div>
            <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-foreground text-lg">Data Subject Rights Procedures</strong>
                <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-xs font-semibold uppercase tracking-wide">
                  Medium Priority
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed mb-2">Data subject rights procedures need streamlining. Current processes are manual and do not meet the 30-day response requirement consistently. GDPR Articles 15-22 (data subject rights) require timely responses, and CCPA Section 1798.100 mandates consumer rights fulfillment within 45 days. NIST Privacy Framework CM-DP-4 (data subject rights management) controls need automation to ensure consistent compliance.</p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Status:</span>
                  <span className="px-2 py-0.5 bg-foreground/10 text-foreground/80 rounded text-xs font-medium">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Risk Level:</span>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground/70">Affected Frameworks:</span>
                  <span className="text-xs text-foreground/70">GDPR, CCPA, NIST</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Framework-Specific Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="p-5 bg-muted/50 rounded-lg border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-foreground text-lg font-semibold">GDPR Compliance</strong>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">68%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mt-3 mb-3 overflow-hidden">
                <div className="bg-blue-600 h-3 rounded-full w-[68%] transition-all duration-300 shadow-sm"></div>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">
                <span className="font-medium">Partial Compliance</span> - Key gaps in data retention (Article 5(1)(e)), consent management (Article 7), and DPIA processes (Article 35). Maturity Level: 2 (40-70% implementation rate)
              </p>
            </div>
            <div className="p-5 bg-muted/50 rounded-lg border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-foreground text-lg font-semibold">CCPA Compliance</strong>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">72%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mt-3 mb-3 overflow-hidden">
                <div className="bg-green-600 h-3 rounded-full w-[72%] transition-all duration-300 shadow-sm"></div>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">
                <span className="font-medium">Partial Compliance</span> - Strong in disclosure requirements (Section 1798.100), needs improvement in opt-out mechanisms (Section 1798.135) and data deletion procedures. Maturity Level: 2 (40-70% implementation rate)
              </p>
            </div>
            <div className="p-5 bg-muted/50 rounded-lg border border-border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <strong className="text-foreground text-lg font-semibold">NIST Privacy Framework</strong>
                <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">58%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mt-3 mb-3 overflow-hidden">
                <div className="bg-yellow-600 h-3 rounded-full w-[58%] transition-all duration-300 shadow-sm"></div>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">
                <span className="font-medium">Needs Improvement</span> - Data governance (GV-PO functions) and risk management (ID-PI functions) require enhancement. Maturity Level: 1 (less than 40% implementation rate)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Prioritized Remediation Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-5 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">1.</span>
                    <strong className="text-foreground text-lg">Update Data Retention Policies</strong>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/70 ml-6">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Timeline:</span> 30 days
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Owner:</span> Legal & Compliance
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Controls:</span> GDPR-5.1.e, GDPR-17, CCPA-1798.105, NIST-ID-PI-5
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                  High Priority
                </span>
              </div>
            </div>
            <div className="p-5 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-lg shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">2.</span>
                    <strong className="text-foreground text-lg">Enhance Consent Mechanisms</strong>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/70 ml-6">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Timeline:</span> 60 days
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Owner:</span> Product & Engineering
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Controls:</span> GDPR-6.1.a, GDPR-7, CCPA-1798.135, NIST-CM-DP-3
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-md text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                  High Priority
                </span>
              </div>
            </div>
            <div className="p-5 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">3.</span>
                    <strong className="text-foreground text-lg">Formalize DPIA Process</strong>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/70 ml-6">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Timeline:</span> 45 days
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Owner:</span> Privacy Team
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Controls:</span> GDPR-35, GDPR-25, NIST-ID-PI-4
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                  Medium Priority
                </span>
              </div>
            </div>
            <div className="p-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">4.</span>
                    <strong className="text-foreground text-lg">Streamline DSR Procedures</strong>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/70 ml-6">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Timeline:</span> 30 days
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Owner:</span> Privacy & IT
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Controls:</span> GDPR-15-22, CCPA-1798.100, NIST-CM-DP-4
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
                  Medium Priority
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <strong className="text-sm font-semibold uppercase tracking-wide text-foreground/70">Assessment Date</strong>
              <p className="text-foreground font-medium mt-2 text-base">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <strong className="text-sm font-semibold uppercase tracking-wide text-foreground/70">Assessed By</strong>
              <p className="text-foreground font-medium mt-2 text-base">Privacy Compliance Team</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <strong className="text-sm font-semibold uppercase tracking-wide text-foreground/70">Frameworks Assessed</strong>
              <p className="text-foreground font-medium mt-2 text-base">GDPR, CCPA, NIST Privacy Framework</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <strong className="text-sm font-semibold uppercase tracking-wide text-foreground/70">Next Review Date</strong>
              <p className="text-foreground font-medium mt-2 text-base">{new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="mt-6 p-5 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
            <p className="text-sm text-foreground/80 leading-relaxed">
              <span className="font-semibold text-foreground mb-2 block">Report Features:</span>
              <span className="flex flex-wrap gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-primary">✓</span> Comprehensive assessment covering GDPR, CCPA, NIST Privacy Framework
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-primary">✓</span> Prioritized remediation roadmap
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-primary">✓</span> Framework-specific compliance scoring
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-primary">✓</span> Detailed gap analysis
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-primary">✓</span> Actionable recommendations
                </span>
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GapAnalysisReportArtifact;

