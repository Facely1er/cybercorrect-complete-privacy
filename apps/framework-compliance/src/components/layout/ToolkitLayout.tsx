import React from 'react';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from '../ui/Breadcrumbs';

const ToolkitLayout: React.FC = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs className="mb-6" />
        <Outlet />
      </div>
    </div>
  );
};

export default ToolkitLayout;