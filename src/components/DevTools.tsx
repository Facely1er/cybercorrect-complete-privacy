import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Settings, Database, Users, FileText, BarChart } from 'lucide-react';

// Development tools for testing and debugging
const DevTools: React.FC = () => {
  const [showDevTools, setShowDevTools] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!showDevTools) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowDevTools(true)}
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        >
          <Settings className="h-4 w-4 mr-1" />
          Dev
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Development Tools</h3>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowDevTools(false)}
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => console.log('Environment:', import.meta.env)}
            >
              <Database className="h-4 w-4 mr-2" />
              Log Environment
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => localStorage.clear()}
            >
              <Users className="h-4 w-4 mr-2" />
              Clear Storage
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.reload()}
            >
              <FileText className="h-4 w-4 mr-2" />
              Force Reload
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => console.log('App State:', { 
                route: window.location.pathname,
                storage: { ...localStorage },
                env: import.meta.env 
              })}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Log App State
            </Button>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            Environment: {import.meta.env.MODE}<br />
            Build: {import.meta.env.DEV ? 'Development' : 'Production'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevTools;