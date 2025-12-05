import React from 'react';
import { usePersona } from '../../hooks/usePersona';
import { useAuth } from '../../hooks/useAuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Home, 
  Shield, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Building,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';

interface PersonaNavigationProps {
  className?: string;
  variant?: 'sidebar' | 'topbar' | 'mobile';
}

export const PersonaNavigation: React.FC<PersonaNavigationProps> = ({ 
  className = '', 
  variant = 'sidebar' 
}) => {
  const { currentPersona, getPersonaNavigationItems } = usePersona();
  useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentPersona) {
    return null;
  }

  const navigationItems = getPersonaNavigationItems();
  const isActive = (path: string) => location.pathname === path;

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
      'Home': Home,
      'Shield': Shield,
      'FileText': FileText,
      'Users': Users,
      'BarChart3': BarChart3,
      'Settings': Settings,
      'HelpCircle': HelpCircle,
      'Briefcase': Briefcase,
      'CheckCircle': CheckCircle,
      'AlertTriangle': AlertTriangle,
      'Building': Building,
      'BookOpen': BookOpen,
      'Target': Target,
      'TrendingUp': TrendingUp
    };
    
    const IconComponent = iconMap[iconName] || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const getPersonaBadge = () => {
    const colorMap: Record<string, string> = {
      'worker': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'job_prospect': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'hr_staff': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'dpo': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    
    return (
      <Badge className={colorMap[currentPersona.id] || 'bg-gray-100 text-gray-800'}>
        {currentPersona.displayName}
      </Badge>
    );
  };

  const renderNavigationItem = (item: { id: string; label: string; path: string; icon: string; badge?: string }) => {
    const IconComponent = getIcon(item.icon);
    const isItemActive = isActive(item.path);
    
    return (
      <Link
        key={item.id}
        to={item.path}
        className={`
          flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
          ${isItemActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }
          ${variant === 'mobile' ? 'text-base py-3' : 'text-sm'}
        `}
      >
        {IconComponent}
        <span className="font-medium">{item.label}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  const renderSidebar = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Persona Header */}
      <div className="px-3">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-lg bg-${currentPersona.color}-100 dark:bg-${currentPersona.color}-900/30`}>
            {getIcon('Shield')}
          </div>
          <div>
            <h2 className="font-semibold">{currentPersona.displayName}</h2>
            <p className="text-xs text-muted-foreground">Privacy Portal</p>
          </div>
        </div>
        {getPersonaBadge()}
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1">
        {navigationItems.map(renderNavigationItem)}
      </nav>

      {/* Quick Actions */}
      <div className="pt-4 border-t">
        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Quick Actions
        </h3>
        <div className="space-y-1">
          {getQuickActions().map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={action.onClick}
            >
              {getIcon(action.icon)}
              <span className="ml-2">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTopbar = () => (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Persona Badge */}
      {getPersonaBadge()}
      
      {/* Navigation Items */}
      <nav className="flex items-center space-x-2">
        {navigationItems.slice(0, 5).map(renderNavigationItem)}
      </nav>
      
      {/* More Menu */}
      {navigationItems.length > 5 && (
        <div className="relative">
          <Button variant="ghost" size="sm">
            More
          </Button>
        </div>
      )}
    </div>
  );

  const renderMobile = () => (
    <div className={`space-y-4 ${className}`}>
      {/* Persona Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg bg-${currentPersona.color}-100 dark:bg-${currentPersona.color}-900/30`}>
            {getIcon('Shield')}
          </div>
          <h2 className="text-lg font-semibold">{currentPersona.displayName}</h2>
        </div>
        {getPersonaBadge()}
      </div>

      {/* Navigation Items */}
      <nav className="space-y-2">
        {navigationItems.map(renderNavigationItem)}
      </nav>
    </div>
  );

  const getQuickActions = () => {
    const baseActions = [
      {
        id: 'help',
        label: 'Get Help',
        icon: 'HelpCircle',
        onClick: () => navigate('/faq')
      }
    ];

    switch (currentPersona.id) {
      case 'worker':
        return [
          ...baseActions,
          {
            id: 'access-data',
            label: 'Access My Data',
            icon: 'Shield',
            onClick: () => navigate('/privacy/data-rights')
          },
          {
            id: 'privacy-settings',
            label: 'Privacy Settings',
            icon: 'Settings',
            onClick: () => navigate('/settings')
          }
        ];
      case 'job_prospect':
        return [
          ...baseActions,
          {
            id: 'application-privacy',
            label: 'Application Privacy',
            icon: 'Briefcase',
            onClick: () => navigate('/data-rights')
          }
        ];
      case 'hr_staff':
        return [
          ...baseActions,
          {
            id: 'pending-requests',
            label: 'Pending Requests',
            icon: 'FileText',
            onClick: () => navigate('/privacy/data-rights')
          },
          {
            id: 'consent-management',
            label: 'Consent Management',
            icon: 'CheckCircle',
            onClick: () => navigate('/privacy/consent')
          }
        ];
      case 'dpo':
        return [
          ...baseActions,
          {
            id: 'analytics',
            label: 'Analytics',
            icon: 'BarChart3',
            onClick: () => navigate('/privacy/analytics')
          },
          {
            id: 'stakeholders',
            label: 'Stakeholders',
            icon: 'Users',
            onClick: () => navigate('/privacy/stakeholders')
          }
        ];
      default:
        return baseActions;
    }
  };

  switch (variant) {
    case 'sidebar':
      return renderSidebar();
    case 'topbar':
      return renderTopbar();
    case 'mobile':
      return renderMobile();
    default:
      return renderSidebar();
  }
};

// Persona-specific breadcrumb component
export const PersonaBreadcrumb: React.FC = () => {
  const { currentPersona } = usePersona();
  const location = useLocation();

  if (!currentPersona) return null;

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    
    let label = segment;
    if (segment === 'persona') label = 'Dashboard';
    if (segment === currentPersona.id) label = currentPersona.displayName;
    if (segment === 'workflow') label = 'Workflow';
    if (segment === 'guidance') label = 'Guidance';
    
    return {
      label,
      path: isLast ? undefined : path,
      isLast
    };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path!} className="hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};