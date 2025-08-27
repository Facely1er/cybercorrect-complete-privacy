import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProject } from '../../context/ProjectContext';
import { 
  Users, 
  CheckCircle, 
  ArrowLeft,
  Plus,
  Edit,
  Download,
  Eye,
  Shield,
  Scale,
  Database,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RaciEntry {
  activity: string;
  category: string;
  dpo: 'R' | 'A' | 'C' | 'I';
  legal: 'R' | 'A' | 'C' | 'I';
  dataSteward: 'R' | 'A' | 'C' | 'I';
  itAdmin: 'R' | 'A' | 'C' | 'I';
  businessAnalyst: 'R' | 'A' | 'C' | 'I';
  projectManager?: 'R' | 'A' | 'C' | 'I';
}

const PrivacyRaci = () => {
  const { getCurrentProject, userMode } = useProject();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const project = getCurrentProject();

  // Privacy-specific RACI matrix
  const raciMatrix: RaciEntry[] = [
    // Assessment Activities
    {
      activity: 'Conduct Privacy Assessment',
      category: 'Assessment',
      dpo: 'A',
      legal: 'C',
      dataSteward: 'R',
      itAdmin: 'I',
      businessAnalyst: 'C',
      projectManager: 'R'
    },
    {
      activity: 'Data Processing Inventory',
      category: 'Assessment',
      dpo: 'A',
      legal: 'I',
      dataSteward: 'R',
      itAdmin: 'C',
      businessAnalyst: 'R',
      projectManager: 'C'
    },
    {
      activity: 'Legal Basis Mapping',
      category: 'Assessment',
      dpo: 'A',
      legal: 'R',
      dataSteward: 'C',
      itAdmin: 'I',
      businessAnalyst: 'C',
      projectManager: 'I'
    },
    // Governance Activities
    {
      activity: 'Develop Privacy Policies',
      category: 'Governance',
      dpo: 'A',
      legal: 'R',
      dataSteward: 'C',
      itAdmin: 'I',
      businessAnalyst: 'C',
      projectManager: 'I'
    },
    {
      activity: 'Privacy Training Development',
      category: 'Governance',
      dpo: 'A',
      legal: 'C',
      dataSteward: 'I',
      itAdmin: 'I',
      businessAnalyst: 'R',
      projectManager: 'C'
    },
    {
      activity: 'Privacy Governance Structure',
      category: 'Governance',
      dpo: 'R',
      legal: 'C',
      dataSteward: 'I',
      itAdmin: 'I',
      businessAnalyst: 'I',
      projectManager: 'A'
    },
    // Implementation Activities
    {
      activity: 'Implement Data Subject Rights',
      category: 'Implementation',
      dpo: 'A',
      legal: 'C',
      dataSteward: 'C',
      itAdmin: 'R',
      businessAnalyst: 'R',
      projectManager: 'C'
    },
    {
      activity: 'Deploy Consent Management',
      category: 'Implementation',
      dpo: 'A',
      legal: 'C',
      dataSteward: 'I',
      itAdmin: 'R',
      businessAnalyst: 'C',
      projectManager: 'I'
    },
    {
      activity: 'Configure Privacy Notices',
      category: 'Implementation',
      dpo: 'A',
      legal: 'R',
      dataSteward: 'I',
      itAdmin: 'C',
      businessAnalyst: 'C',
      projectManager: 'I'
    },
    // Documentation Activities
    {
      activity: 'Create DPIA Templates',
      category: 'Documentation',
      dpo: 'A',
      legal: 'R',
      dataSteward: 'C',
      itAdmin: 'I',
      businessAnalyst: 'I',
      projectManager: 'I'
    },
    {
      activity: 'Document Privacy Controls',
      category: 'Documentation',
      dpo: 'A',
      legal: 'C',
      dataSteward: 'R',
      itAdmin: 'C',
      businessAnalyst: 'I',
      projectManager: 'C'
    },
    {
      activity: 'Prepare Audit Documentation',
      category: 'Documentation',
      dpo: 'A',
      legal: 'C',
      dataSteward: 'R',
      itAdmin: 'I',
      businessAnalyst: 'I',
      projectManager: 'R'
    }
  ];

  const roles = [
    { key: 'dpo', name: 'Data Protection Officer', icon: Eye, color: 'text-blue-600' },
    { key: 'legal', name: 'Legal Counsel', icon: Scale, color: 'text-purple-600' },
    { key: 'dataSteward', name: 'Data Steward', icon: Database, color: 'text-green-600' },
    { key: 'itAdmin', name: 'IT Administrator', icon: Shield, color: 'text-orange-600' },
    { key: 'businessAnalyst', name: 'Business Analyst', icon: Users, color: 'text-pink-600' }
  ];

  if (userMode === 'team') {
    roles.push({ key: 'projectManager', name: 'Project Manager', icon: FileText, color: 'text-indigo-600' });
  }

  const categories = ['all', 'Assessment', 'Governance', 'Implementation', 'Documentation'];

  const filteredMatrix = selectedCategory === 'all' 
    ? raciMatrix 
    : raciMatrix.filter(entry => entry.category === selectedCategory);

  const raciDefinitions = {
    'R': 'Responsible - Does the work',
    'A': 'Accountable - Signs off on the work',
    'C': 'Consulted - Provides input',
    'I': 'Informed - Kept up-to-date'
  };

  const getRaciColor = (value: 'R' | 'A' | 'C' | 'I') => {
    switch (value) {
      case 'R': return 'bg-blue-100 text-blue-800 font-bold';
      case 'A': return 'bg-green-100 text-green-800 font-bold';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'I': return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/project" className="inline-flex items-center text-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Privacy RACI Matrix</h1>
            <p className="text-muted-foreground">
              Role-based responsibility assignment for privacy implementation activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export RACI
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Customize
            </Button>
          </div>
        </div>
      </div>

      {/* RACI Legend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>RACI Definitions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(raciDefinitions).map(([key, definition]) => (
              <div key={key} className="flex items-center">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getRaciColor(key as any)}`}>
                  {key}
                </span>
                <span className="text-sm">{definition}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Activities' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* RACI Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Responsibility Matrix</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium">Activity</th>
                <th className="text-left p-3 font-medium">Category</th>
                {roles.map(role => (
                  <th key={role.key} className="text-center p-3 font-medium min-w-[100px]">
                    <div className="flex flex-col items-center">
                      <role.icon className={`h-5 w-5 ${role.color} mb-1`} />
                      <span className="text-xs">{role.name.split(' ')[0]}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMatrix.map((entry, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3 font-medium">{entry.activity}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {entry.category}
                    </span>
                  </td>
                  {roles.map(role => (
                    <td key={role.key} className="p-3 text-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-sm ${
                        getRaciColor(entry[role.key as keyof RaciEntry] as any)
                      }`}>
                        {entry[role.key as keyof RaciEntry]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyRaci;