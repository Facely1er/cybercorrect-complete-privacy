export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'risk_manager' | 'auditor' | 'viewer';
  avatar?: string;
};