import React, { useMemo } from 'react';
import {
  Shield,
  Eye,
  Database,
  Lock,
  FileCheck,
  Scale,
  Users,
  Key,
  Fingerprint,
  Globe,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface FloatingIcon {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
  duration: number;
  size: number;
  x: number;
  y: number;
  opacity: number;
}

// Move icons array outside component to prevent recreation on every render
const PRIVACY_ICONS: Omit<FloatingIcon, 'id'>[] = [
  { icon: Shield, delay: 0, duration: 20, size: 24, x: 10, y: 20, opacity: 0.15 },
  { icon: Eye, delay: 2, duration: 18, size: 28, x: 85, y: 15, opacity: 0.12 },
  { icon: Database, delay: 4, duration: 22, size: 26, x: 20, y: 60, opacity: 0.18 },
  { icon: Lock, delay: 1, duration: 19, size: 24, x: 70, y: 50, opacity: 0.14 },
  { icon: FileCheck, delay: 3, duration: 21, size: 25, x: 50, y: 30, opacity: 0.16 },
  { icon: Scale, delay: 5, duration: 17, size: 23, x: 30, y: 75, opacity: 0.13 },
  { icon: Users, delay: 2.5, duration: 20, size: 27, x: 90, y: 70, opacity: 0.15 },
  { icon: Key, delay: 1.5, duration: 18, size: 24, x: 5, y: 45, opacity: 0.12 },
  { icon: Fingerprint, delay: 4.5, duration: 23, size: 26, x: 60, y: 10, opacity: 0.17 },
  { icon: Globe, delay: 3.5, duration: 19, size: 25, x: 15, y: 85, opacity: 0.14 },
  { icon: AlertCircle, delay: 0.5, duration: 21, size: 24, x: 75, y: 40, opacity: 0.13 },
  { icon: CheckCircle2, delay: 2.2, duration: 20, size: 26, x: 40, y: 65, opacity: 0.15 },
];

const FloatingPrivacyIcons: React.FC = React.memo(() => {
  // Memoize icons with stable IDs to prevent unnecessary re-renders
  const icons = useMemo<FloatingIcon[]>(() => {
    return PRIVACY_ICONS.map((icon, index) => ({
      ...icon,
      // Create stable ID using icon component name and position
      id: `privacy-icon-${index}-${icon.x}-${icon.y}`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {icons.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className="absolute floating-icon"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              opacity: item.opacity,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
            }}
          >
            <IconComponent
              className="text-primary"
              size={item.size}
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          </div>
        );
      })}
    </div>
  );
});

FloatingPrivacyIcons.displayName = 'FloatingPrivacyIcons';

export default FloatingPrivacyIcons;

