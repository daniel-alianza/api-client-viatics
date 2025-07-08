import { createContext, useContext, type ReactNode } from 'react';
import { usePermissions } from '../hooks/use-permissions';
import type { Interface } from '../interfaces/types';

interface PermissionContextType {
  interfaces: Interface[];
  grantPermission: (id: string) => void;
  revokePermission: (id: string) => void;
  getAccessibleCount: () => number;
  getLockedCount: () => number;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined,
);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const permissions = usePermissions();

  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error(
      'usePermissionContext must be used within a PermissionProvider',
    );
  }
  return context;
}
