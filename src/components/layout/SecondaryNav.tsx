import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SecondaryNavProps {
  items: {
    name: string;
    path: string;
  }[];
  title: string;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ items, title }) => {
  const location = useLocation();

  return (
    <div className="bg-muted/30 dark:bg-muted/10 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3">
          <h2 className="text-lg font-medium text-foreground">{title}</h2>
          <nav className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors min-w-max whitespace-nowrap",
                  location.pathname === item.path
                    ? "bg-primary text-white dark:bg-dark-primary dark:text-white"
                    : "text-foreground hover:bg-muted dark:text-dark-text dark:hover:bg-dark-support/50"
                )}
                aria-current={location.pathname === item.path ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;