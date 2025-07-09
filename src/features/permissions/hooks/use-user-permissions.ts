import { useState, useEffect } from 'react';
import { useUserContext } from '../context/user-context';
import type { Interface } from '../interfaces/types';
import {
  Eye,
  Settings,
  Users,
  BarChart3,
  FileText,
  Shield,
} from 'lucide-react';
import { api } from '@/services/api';
import { menuOptions } from '@/lib/menuOptions';

// Módulos predeterminados (siempre activos y bloqueados)
const defaultInterfaces: Omit<Interface, 'hasAccess'>[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Panel principal y analíticas',
    category: 'General',
    icon: BarChart3,
  },
  {
    id: 'crear-solicitud',
    name: 'Crear Solicitud',
    description: 'Crear una nueva solicitud de viaje o gasto',
    category: 'General',
    icon: FileText,
  },
  {
    id: 'comprobar-solicitud',
    name: 'Comprobar Solicitud',
    description: 'Comprobar y validar solicitudes existentes',
    category: 'General',
    icon: Eye,
  },
];

// Módulos configurables (pueden ser activados/desactivados)
const moduleInterfaces: Omit<Interface, 'hasAccess'>[] = [
  {
    id: 'TravelExpense-Checks',
    name: 'Comprobaciones de Viáticos',
    description: 'Gestión y revisión de comprobaciones de viáticos',
    category: 'Viáticos',
    icon: FileText,
  },
  {
    id: 'user-management',
    name:
      menuOptions.find(opt => opt.id === 'user-management')?.label ||
      'Gestión de Usuarios',
    description: 'Administración de usuarios y roles',
    category: 'Administración',
    icon: Users,
  },
  {
    id: 'accounting-clearance',
    name:
      menuOptions.find(opt => opt.id === 'accounting-clearance')?.label ||
      'Rendición Contable',
    description: 'Rendición y comprobación contable',
    category: 'Contabilidad',
    icon: FileText,
  },
  {
    id: 'accounting-authorization',
    name:
      menuOptions.find(opt => opt.id === 'accounting-authorization')?.label ||
      'Autorización Contable',
    description: 'Autorización de gastos y movimientos contables',
    category: 'Contabilidad',
    icon: Settings,
  },
  {
    id: 'authorization',
    name:
      menuOptions.find(opt => opt.id === 'authorization')?.label ||
      'Autorizaciones',
    description: 'Gestión de autorizaciones generales',
    category: 'General',
    icon: Shield,
  },
  {
    id: 'verification-of-travelexpenses',
    name: 'Verificación de Comprobaciones',
    description: 'Verificación de comprobaciones de viáticos',
    category: 'Viáticos',
    icon: Eye,
  },
  {
    id: 'travel-request',
    name:
      menuOptions.find(opt => opt.id === 'travel-request')?.label ||
      'Solicitudes',
    description: 'Gestión y creación de solicitudes',
    category: 'General',
    icon: FileText,
  },
  {
    id: 'collaborators-w-card',
    name:
      menuOptions.find(opt => opt.id === 'collaborators-w-card')?.label ||
      'Colaboradores con Tarjeta',
    description: 'Gestión de colaboradores con tarjeta',
    category: 'Colaboradores',
    icon: Users,
  },
];

const baseInterfaces: Omit<Interface, 'hasAccess'>[] = [
  ...defaultInterfaces,
  ...moduleInterfaces,
];

const PERMISOS_PREDETERMINADOS = defaultInterfaces.map(i => i.id);

// Filtrar módulos únicos por id, manteniendo el label original de este archivo
const uniqueModulesMap = new Map();
for (const m of moduleInterfaces) {
  if (!uniqueModulesMap.has(m.id)) {
    uniqueModulesMap.set(m.id, m);
  }
}
const uniqueModules = Array.from(uniqueModulesMap.values());

// Agrupación de módulos configurables por categoría, solo con módulos únicos
export const MODULES_BY_CATEGORY = [
  {
    categoria: 'Viáticos',
    modulos: uniqueModules.filter(m => m.category === 'Viáticos'),
  },
  {
    categoria: 'Contabilidad',
    modulos: uniqueModules.filter(m => m.category === 'Contabilidad'),
  },
  {
    categoria: 'General',
    modulos: uniqueModules.filter(m => m.category === 'General'),
  },
  {
    categoria: 'Administración',
    modulos: uniqueModules.filter(m => m.category === 'Administración'),
  },
  {
    categoria: 'Colaboradores',
    modulos: uniqueModules.filter(m => m.category === 'Colaboradores'),
  },
];

export function useUserPermissions() {
  const { selectedUser } = useUserContext();
  const [interfaces, setInterfaces] = useState<Interface[]>([]);

  useEffect(() => {
    if (selectedUser) {
      (async () => {
        // Obtener permisos del backend
        const res = await api.get(`/permissions/user/${selectedUser.id}`);
        const permisos: { viewName: string }[] = res.data;
        // Mapear permisos a interfaces
        const userInterfaces = baseInterfaces.map(interface_item => ({
          ...interface_item,
          hasAccess:
            PERMISOS_PREDETERMINADOS.includes(interface_item.id) ||
            permisos.some(p => p.viewName === interface_item.id),
        }));
        setInterfaces(userInterfaces);
      })();
    } else {
      setInterfaces([]);
    }
  }, [selectedUser]);

  const grantPermission = async (id: string) => {
    if (!selectedUser) return;
    await api.post('/permissions', {
      userId: selectedUser.id,
      viewName: id,
    });
    setInterfaces(prev =>
      prev.map(item => (item.id === id ? { ...item, hasAccess: true } : item)),
    );
  };

  const revokePermission = async (id: string) => {
    if (!selectedUser) return;
    if (PERMISOS_PREDETERMINADOS.includes(id)) return; // No permitir quitar los predeterminados
    // Buscar el permiso en el backend
    const res = await api.get(`/permissions/user/${selectedUser.id}`);
    const permisos: { id: number; viewName: string }[] = res.data;
    const permiso = permisos.find(p => p.viewName === id);
    if (permiso) {
      await api.delete(`/permissions/${permiso.id}`);
    }
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
    PERMISOS_PREDETERMINADOS,
  };
}
