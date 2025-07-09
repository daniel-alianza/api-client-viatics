import { useState } from 'react';
import type { Interface } from '../interfaces/types';
import {
  Eye,
  Settings,
  Database,
  Users,
  BarChart3,
  FileText,
  Shield,
  Zap,
} from 'lucide-react';

const initialInterfaces: Interface[] = [
  {
    id: '1',
    name: 'Dashboard',
    description: 'Main overview and analytics dashboard',
    category: 'Core',
    hasAccess: true,
    icon: BarChart3,
  },
  {
    id: '2',
    name: 'User Management',
    description: 'Manage users and their permissions',
    category: 'Admin',
    hasAccess: true,
    icon: Users,
  },
  {
    id: '3',
    name: 'Settings',
    description: 'System configuration and preferences',
    category: 'Core',
    hasAccess: true,
    icon: Settings,
  },
  {
    id: '4',
    name: 'Database Admin',
    description: 'Direct database management interface',
    category: 'Admin',
    hasAccess: false,
    icon: Database,
  },
  {
    id: '5',
    name: 'Security Center',
    description: 'Security monitoring and threat detection',
    category: 'Security',
    hasAccess: false,
    icon: Shield,
  },
  {
    id: '6',
    name: 'API Management',
    description: 'Manage API endpoints and integrations',
    category: 'Developer',
    hasAccess: false,
    icon: Zap,
  },
  {
    id: '7',
    name: 'Reports',
    description: 'Generate and view detailed reports',
    category: 'Analytics',
    hasAccess: false,
    icon: FileText,
  },
  {
    id: '8',
    name: 'Monitoring',
    description: 'System health and performance monitoring',
    category: 'Operations',
    hasAccess: false,
    icon: Eye,
  },
];

export function usePermissions() {
  const [interfaces, setInterfaces] = useState<Interface[]>(initialInterfaces);

  const grantPermission = (id: string) => {
    setInterfaces(prev =>
      prev.map(item => (item.id === id ? { ...item, hasAccess: true } : item)),
    );
  };

  const revokePermission = (id: string) => {
    setInterfaces(prev =>
      prev.map(item => (item.id === id ? { ...item, hasAccess: false } : item)),
    );
  };

  const getAccessibleCount = () =>
    interfaces.filter(item => item.hasAccess).length;
  const getLockedCount = () =>
    interfaces.filter(item => !item.hasAccess).length;

  return {
    interfaces,
    grantPermission,
    revokePermission,
    getAccessibleCount,
    getLockedCount,
  };
}
