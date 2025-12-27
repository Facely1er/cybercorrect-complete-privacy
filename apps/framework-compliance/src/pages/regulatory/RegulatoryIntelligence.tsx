import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Scale, 
  AlertTriangle,
  Info,
  Filter,
  Search,
  Calendar,
  Globe,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { supabase } from '../../lib/supabase';
import { toast } from '../../components/ui/Toaster';

export type RegulatoryUpdateType = 'new_regulation' | 'amendment' | 'guidance' | 'enforcement' | 'other';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RegulatoryUpdate {
  id: string;
  framework: string;
  region?: string;
  update_type: RegulatoryUpdateType;
  title: string;
  description: string;
  impact_level: ImpactLevel;
  published_at: string;
  affected_users?: string[];
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export const RegulatoryIntelligence: React.FC = () => {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<RegulatoryUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<{
    framework?: string;
    updateType?: RegulatoryUpdateType;
    impactLevel?: ImpactLevel;
  }>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUpdates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [updates, filter, searchQuery]);

  const loadUpdates = async () => {
    try {
      setIsLoading(true);
      
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('regulatory_updates')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        setUpdates(data as RegulatoryUpdate[]);
      } else {
        setUpdates([]);
      }
    } catch (error) {
      console.error('Failed to load regulatory updates:', error);
      toast.error('Failed to load regulatory updates', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...updates];

    if (filter.framework) {
      filtered = filtered.filter(u => u.framework === filter.framework);
    }

    if (filter.updateType) {
      filtered = filtered.filter(u => u.update_type === filter.updateType);
    }

    if (filter.impactLevel) {
      filtered = filtered.filter(u => u.impact_level === filter.impactLevel);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.title.toLowerCase().includes(query) ||
        u.description.toLowerCase().includes(query) ||
        u.framework.toLowerCase().includes(query)
      );
    }

    setFilteredUpdates(filtered);
  };

  const getUpdateTypeLabel = (type: RegulatoryUpdateType) => {
    const labels: Record<RegulatoryUpdateType, string> = {
      new_regulation: 'New Regulation',
      amendment: 'Amendment',
      guidance: 'Guidance',
      enforcement: 'Enforcement',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getImpactColor = (level: ImpactLevel) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
    }
  };

  const getImpactIcon = (level: ImpactLevel) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const frameworks = Array.from(new Set(updates.map(u => u.framework)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Regulatory Intelligence</h1>
            <p className="text-muted-foreground">
              Stay informed about regulatory changes and their impact
            </p>
          </div>
          <Button variant="outline" onClick={loadUpdates} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search updates..."
                className="px-3 py-2 border rounded text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filter.framework || ''}
                onChange={(e) => setFilter({ ...filter, framework: e.target.value || undefined })}
                className="px-3 py-2 border rounded text-sm"
              >
                <option value="">All Frameworks</option>
                {frameworks.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <select
              value={filter.updateType || ''}
              onChange={(e) => setFilter({ ...filter, updateType: e.target.value as RegulatoryUpdateType || undefined })}
              className="px-3 py-2 border rounded text-sm"
            >
              <option value="">All Types</option>
              <option value="new_regulation">New Regulation</option>
              <option value="amendment">Amendment</option>
              <option value="guidance">Guidance</option>
              <option value="enforcement">Enforcement</option>
              <option value="other">Other</option>
            </select>
            <select
              value={filter.impactLevel || ''}
              onChange={(e) => setFilter({ ...filter, impactLevel: e.target.value as ImpactLevel || undefined })}
              className="px-3 py-2 border rounded text-sm"
            >
              <option value="">All Impact Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Updates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Regulatory Updates
            {filteredUpdates.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredUpdates.length} update{filteredUpdates.length !== 1 ? 's' : ''})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading regulatory updates...
            </div>
          ) : filteredUpdates.length === 0 ? (
            <EmptyState
              icon={Scale}
              title="No Regulatory Updates Found"
              description="No regulatory updates match your current filters. Try adjusting your search criteria or check back later for new updates"
            />
          ) : (
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <div
                  key={update.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{update.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${getImpactColor(update.impact_level)}`}>
                          {getImpactIcon(update.impact_level)}
                          {update.impact_level}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Scale className="h-3 w-3" />
                          {update.framework}
                        </span>
                        {update.region && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {update.region}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(update.published_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          {getUpdateTypeLabel(update.update_type)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


