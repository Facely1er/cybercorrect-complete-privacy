import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AssessmentResults } from '../../components/assessment/AssessmentResults';
import { RecommendedTools } from '../../components/assessment/RecommendedTools';
import { 
  Download, 
  Target, 
  BarChart3,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { generateGapsFromAssessment, getToolsForGap, DOMAIN_TOOL_MAPPINGS, type GapDomain } from '../../utils/gapJourneyConfig';
import { generatePrivacyAssessmentReportPdf } from '../../utils/pdf';
import { toast } from '../../components/ui/Toaster';
import { secureStorage } from '../../utils/storage/secureStorage';

const PrivacyResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const assessmentResults = location.state?.assessmentResults;
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);

  // Generate gaps from assessment results
  const identifiedGaps = assessmentResults 
    ? generateGapsFromAssessment(assessmentResults)
    : [];

  // Helper to get tool path from tool ID
  const getToolPath = (toolId: string): string | null => {
    for (const domain of Object.keys(DOMAIN_TOOL_MAPPINGS) as GapDomain[]) {
      const tool = DOMAIN_TOOL_MAPPINGS[domain].find(t => t.toolId === toolId);
      if (tool) return tool.toolPath;
    }
    return null;
  };

  // Generate roadmap phases from gaps
  const generateRoadmapFromGaps = () => {
    const phases: Array<{
      id: string;
      name: string;
      duration: string;
      status: string;
      milestones: Array<{ name: string; date: string; status: string }>;
      deliverables: string[];
      keyActivities: string[];
      gaps: typeof identifiedGaps;
    }> = [];
    
    const criticalGaps = identifiedGaps.filter(g => g.severity === 'critical');
    const highGaps = identifiedGaps.filter(g => g.severity === 'high');
    const moderateGaps = identifiedGaps.filter(g => g.severity === 'moderate');

    // Phase 1: Critical Gaps (Immediate - 30 days)
    if (criticalGaps.length > 0) {
      phases.push({
        id: 'phase-critical',
        name: 'Critical Gap Remediation',
        duration: '2-4 weeks',
        status: 'pending',
        milestones: criticalGaps.map((gap, idx) => ({
          name: `Address ${gap.domainTitle} Gap`,
          date: new Date(Date.now() + (14 + idx * 7) * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        })),
        deliverables: criticalGaps.map(g => {
          const tools = getToolsForGap(g.domain);
          const primaryTool = tools[0];
          return `Complete ${g.domainTitle} remediation${primaryTool ? ` using ${primaryTool.toolName}` : ''}`;
        }),
        keyActivities: criticalGaps.flatMap(g => g.recommendedTools),
        gaps: criticalGaps
      });
    }

    // Phase 2: High Priority Gaps (30-60 days)
    if (highGaps.length > 0) {
      phases.push({
        id: 'phase-high',
        name: 'High Priority Improvements',
        duration: '4-6 weeks',
        status: 'pending',
        milestones: highGaps.map((gap, idx) => ({
          name: `Improve ${gap.domainTitle} Score`,
          date: new Date(Date.now() + (45 + idx * 7) * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        })),
        deliverables: highGaps.map(g => `Enhance ${g.domainTitle} compliance`),
        keyActivities: highGaps.flatMap(g => g.recommendedTools),
        gaps: highGaps
      });
    }

    // Phase 3: Moderate Gaps (60-90 days)
    if (moderateGaps.length > 0) {
      phases.push({
        id: 'phase-moderate',
        name: 'Ongoing Compliance Enhancement',
        duration: '6-8 weeks',
        status: 'pending',
        milestones: moderateGaps.map((gap, idx) => ({
          name: `Optimize ${gap.domainTitle}`,
          date: new Date(Date.now() + (75 + idx * 7) * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        })),
        deliverables: moderateGaps.map(g => `Optimize ${g.domainTitle} processes`),
        keyActivities: moderateGaps.flatMap(g => g.recommendedTools),
        gaps: moderateGaps
      });
    }

    return phases;
  };

  const roadmapPhases = generateRoadmapFromGaps();

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      await generatePrivacyAssessmentReportPdf({
        assessmentResults,
        identifiedGaps,
        roadmapPhases,
        metadata: {
          title: 'Privacy Assessment Results & Roadmap',
          timestamp: new Date().toISOString(),
          reportId: `PAR-${Date.now()}`,
          version: '1.0',
          generatedBy: 'CyberCorrect Privacy Platform'
        }
      });
      toast.success('Report Generated', 'Your assessment report with roadmap has been downloaded');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Report Generation Failed', 'Please try again');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleCreateRoadmap = () => {
    // Save roadmap phases to storage (remove gaps property to match Phase type)
    const phasesToSave = roadmapPhases.map(({ gaps, ...phase }) => phase);
    secureStorage.setItem('privacy_roadmap_phases', phasesToSave);
    setRoadmapGenerated(true);
    navigate('/project/roadmap', { 
      state: { 
        fromAssessment: true,
        assessmentResults 
      } 
    });
  };

  if (!assessmentResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No assessment results found</p>
            <Link to="/assessments/privacy-assessment">
              <Button>Take Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Privacy Assessment Results</h1>
        <p className="text-muted-foreground">
          Completed on {assessmentResults.completedDate} • {assessmentResults.frameworkName}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGeneratingReport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isGeneratingReport ? 'Generating Report...' : 'Download Full Report'}
        </Button>
        {roadmapPhases.length > 0 && (
          <Button 
            onClick={handleCreateRoadmap}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Create Implementation Roadmap
          </Button>
        )}
        <Link to="/toolkit/privacy-gap-analyzer" state={{ assessmentResults, fromAssessment: true }}>
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            View Gap Analysis
          </Button>
        </Link>
      </div>

      {/* Assessment Results */}
      <AssessmentResults 
        data={assessmentResults}
        onExport={handleGenerateReport}
      />

      {/* Identified Gaps Summary */}
      {identifiedGaps.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Identified Compliance Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {identifiedGaps.map((gap) => {
                const severityColor = gap.severity === 'critical' ? 'hsl(var(--destructive))' :
                                     gap.severity === 'high' ? 'hsl(var(--destructive))' :
                                     gap.severity === 'moderate' ? 'hsl(var(--warning))' : 'hsl(var(--success))';
                const severityBg = gap.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  gap.severity === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                
                return (
                  <Card key={gap.id} className="border-l-4" style={{ borderLeftColor: severityColor }}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{gap.domainTitle}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${severityBg}`}>
                          {gap.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Score: {gap.score}% • Timeline: {gap.timeline}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground">Recommended Tools:</p>
                        {gap.recommendedTools.slice(0, 2).map((toolId) => {
                          const tool = getToolsForGap(gap.domain).find(t => t.toolId === toolId);
                          return tool ? (
                            <Link 
                              key={toolId}
                              to={tool.toolPath}
                              className="text-xs text-primary hover:underline block"
                            >
                              → {tool.toolName}
                            </Link>
                          ) : null;
                        })}
                        {gap.recommendedTools.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{gap.recommendedTools.length - 2} more
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roadmap Preview */}
      {roadmapPhases.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Implementation Roadmap Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roadmapPhases.map((phase, index) => (
                <div key={phase.id} className="border-l-4 border-primary pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">Phase {index + 1}: {phase.name}</h3>
                    <span className="text-sm text-muted-foreground">{phase.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {phase.gaps.length} gap{phase.gaps.length !== 1 ? 's' : ''} to address
                  </p>
                  <div className="space-y-2">
                    {phase.deliverables.slice(0, 3).map((deliverable, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{deliverable}</span>
                      </div>
                    ))}
                    {phase.deliverables.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-6">
                        +{phase.deliverables.length - 3} more deliverables
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={handleCreateRoadmap} className="w-full">
                View Full Roadmap
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Tools */}
      <div className="mt-6">
        <RecommendedTools 
          assessmentResults={assessmentResults}
          onToolClick={(toolId) => {
            const toolPath = getToolPath(toolId);
            if (toolPath) {
              navigate(toolPath);
            }
          }}
        />
      </div>
    </div>
  );
};

export default PrivacyResults;

