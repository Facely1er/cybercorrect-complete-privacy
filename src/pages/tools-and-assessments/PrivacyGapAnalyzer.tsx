import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Eye, 
  ArrowLeft, 
  Download, 
  Target, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle,
  Scale,
  Database,
  Users,
  Shield,
  FileText,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PrivacyGapAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Privacy-specific compliance data
  const privacyGaps = [
    {
      id: 'GAP-001',
      title: 'Data Processing Records Incomplete',
      description: 'Organization lacks comprehensive records of processing activities required under GDPR Article 30',
      regulation: 'GDPR',
      article: 'Article 30',
      priority: 'critical',
      category: 'Documentation',
      effort: 'moderate',
      timeframe: 'immediate',
      impact: 'Regulatory non-compliance - potential GDPR fines',
      recommendation: 'Implement comprehensive data processing inventory system',
      framework: 'NIST Privacy Framework - ID.IM'
    },
    {
      id: 'GAP-002', 
      title: 'Data Subject Rights Process Missing',
      description: 'No formal process for handling data subject requests (access, rectification, deletion)',
      regulation: 'GDPR',
      article: 'Articles 15-22',
      priority: 'critical',
      category: 'Rights Management',
      effort: 'significant',
      timeframe: 'immediate',
      impact: 'Inability to fulfill data subject rights within required timeframes',
      recommendation: 'Implement data subject rights management system',
      framework: 'NIST Privacy Framework - CM.AW'
    },
    {
      id: 'GAP-003',
      title: 'Privacy by Design Not Implemented',
      description: 'New projects and systems do not incorporate privacy considerations from the design phase',
      regulation: 'GDPR',
      article: 'Article 25',
      priority: 'high',
      category: 'Governance',
      effort: 'significant',
      timeframe: 'short-term',
      impact: 'Reactive privacy compliance approach increases risk of violations',
      recommendation: 'Establish privacy by design framework and procedures',
      framework: 'NIST Privacy Framework - GV.PO'
    },
    {
      id: 'GAP-004',
      title: 'Consent Management Inadequate', 
      description: 'Current consent mechanisms do not meet GDPR requirements for specific, informed, and freely given consent',
      regulation: 'GDPR',
      article: 'Article 7',
      priority: 'high',
      category: 'Consent',
      effort: 'moderate',
      timeframe: 'short-term',
      impact: 'Invalid consent could invalidate legal basis for processing',
      recommendation: 'Implement compliant consent management system',
      framework: 'NIST Privacy Framework - CM.PO'
    }
  ];

  const complianceData = [
    { framework: 'NIST Privacy Framework', score: 68, gaps: 12 },
    { framework: 'GDPR', score: 55, gaps: 18 },
    { framework: 'CCPA', score: 72, gaps: 8 },
    { framework: 'LGPD', score: 62, gaps: 10 },
    { framework: 'PIPEDA', score: 78, gaps: 5 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100'; 
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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
            <h1 className="text-3xl font-bold text-foreground">Privacy Gap Analyzer</h1>
            <p className="text-muted-foreground">
              Multi-framework privacy compliance assessment and gap identification
            </p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'gaps', label: 'Gap Analysis', icon: AlertTriangle },
            { id: 'recommendations', label: 'Recommendations', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Privacy Compliance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">68%</div>
                  <div className="text-sm text-muted-foreground">Overall Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{privacyGaps.length}</div>
                  <div className="text-sm text-muted-foreground">Total Gaps</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {privacyGaps.filter(gap => gap.priority === 'critical').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical Gaps</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-muted-foreground">Frameworks</div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="framework" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="Compliance Score %" />
                  <Bar dataKey="gaps" fill="#ef4444" name="Gap Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'gaps' && (
        <div className="space-y-4">
          {privacyGaps.map(gap => (
            <Card key={gap.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-primary text-sm font-semibold">{gap.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(gap.priority)}`}>
                      {gap.priority.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {gap.regulation}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{gap.timeframe}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">{gap.title}</h3>
                <p className="text-muted-foreground mb-4">{gap.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Article/Section:</span>
                    <div className="font-medium">{gap.article}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">NIST Framework:</span>
                    <div className="font-medium">{gap.framework}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium">{gap.category}</div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-muted/30 rounded">
                  <h4 className="font-medium mb-1">Recommendation</h4>
                  <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Privacy Recommendations</h3>
          <p className="text-muted-foreground mb-4">
            Detailed remediation recommendations interface coming soon
          </p>
          <Link to="/privacy-recommendations">
            <Button>
              View Privacy Recommendations
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PrivacyGapAnalyzer;