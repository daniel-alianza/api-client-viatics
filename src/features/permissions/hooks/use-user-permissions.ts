import { useState, useEffect } from 'react';
import { useUserContext } from '../context/user-context';
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

const baseInterfaces: Omit<Interface, 'hasAccess'>[] = [
  {
    id: '1',
    name: 'Dashboard',
    description: 'Main overview and analytics dashboard',
    category: 'Core',
    icon: BarChart3,
  },
  {
    id: '2',
    name: 'User Management',
    description: 'Manage users and their permissions',
    category: 'Admin',
    icon: Users,
  },
  {
    id: '3',
    name: 'Settings',
    description: 'System configuration and preferences',
    category: 'Core',
    icon: Settings,
  },
  {
    id: '4',
    name: 'Database Admin',
    description: 'Direct database management interface',
    category: 'Admin',
    icon: Database,
  },
  {
    id: '5',
    name: 'Security Center',
    description: 'Security monitoring and threat detection',
    category: 'Security',
    icon: Shield,
  },
  {
    id: '6',
    name: 'API Management',
    description: 'Manage API endpoints and integrations',
    category: 'Developer',
    icon: Zap,
  },
  {
    id: '7',
    name: 'Reports',
    description: 'Generate and view detailed reports',
    category: 'Analytics',
    icon: FileText,
  },
  {
    id: '8',
    name: 'Monitoring',
    description: 'System health and performance monitoring',
    category: 'Operations',
    icon: Eye,
  },
];

// Mock user permissions - in real app this would come from API
const userPermissions: Record<string, string[]> = {
  '1': ['1', '2', '3', '4', '5', '6', '7', '8'], // Admin - all access
  '2': ['1', '2', '3', '7'], // Manager - limited access
  '3': ['1', '3', '6'], // Developer - basic access
  '4': ['1', '7'], // Analyst - minimal access
  '5': ['1', '3'], // Developer - basic access
};

export function useUserPermissions() {
  const { selectedUser } = useUserContext();
  const [interfaces, setInterfaces] = useState<Interface[]>([]);

  useEffect(() => {
    if (selectedUser) {
      const userAccessibleIds = userPermissions[selectedUser.id] || [];
      const userInterfaces = baseInterfaces.map(interface_item => ({
        ...interface_item,
        hasAccess: userAccessibleIds.includes(interface_item.id),
      }));
      setInterfaces(userInterfaces);
    }
  }, [selectedUser]);

  const grantPermission = (id: string) => {
    if (!selectedUser) return;

    setInterfaces(prev =>
      prev.map(item => (item.id === id ? { ...item, hasAccess: true } : item)),
    );

    // Update the mock data (in real app, this would be an API call)
    if (!userPermissions[selectedUser.id]) {
      userPermissions[selectedUser.id] = [];
    }
    if (!userPermissions[selectedUser.id].includes(id)) {
      userPermissions[selectedUser.id].push(id);
    }
  };

  const revokePermission = (id: string) => {
    if (!selectedUser) return;

    setInterfaces(prev =>
      prev.map(item => (item.id === id ? { ...item, hasAccess: false } : item)),
    );

    // Update the mock data (in real app, this would be an API call)
    if (userPermissions[selectedUser.id]) {
      userPermissions[selectedUser.id] = userPermissions[
        selectedUser.id
      ].filter(permId => permId !== id);
    }
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
