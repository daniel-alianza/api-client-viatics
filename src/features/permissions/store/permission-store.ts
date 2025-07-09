import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Interface } from '../interfaces/types';

interface PermissionStore {
  interfaces: Interface[];
  grantPermission: (id: string) => void;
  revokePermission: (id: string) => void;
  bulkGrantPermissions: (ids: string[]) => void;
  resetPermissions: () => void;
}

export const usePermissionStore = create<PermissionStore>()(
  persist(
    set => ({
      interfaces: [],
      grantPermission: id =>
        set(state => ({
          interfaces: state.interfaces.map(item =>
            item.id === id ? { ...item, hasAccess: true } : item,
          ),
        })),
      revokePermission: id =>
        set(state => ({
          interfaces: state.interfaces.map(item =>
            item.id === id ? { ...item, hasAccess: false } : item,
          ),
        })),
      bulkGrantPermissions: ids =>
        set(state => ({
          interfaces: state.interfaces.map(item =>
            ids.includes(item.id) ? { ...item, hasAccess: true } : item,
          ),
        })),
      resetPermissions: () =>
        set(state => ({
          interfaces: state.interfaces.map(item => ({
            ...item,
            hasAccess: false,
          })),
        })),
    }),
    {
      name: 'permission-storage',
    },
  ),
);
