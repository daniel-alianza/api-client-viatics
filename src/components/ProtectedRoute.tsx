import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Permisos predeterminados que siempre permiten acceso
  const PERMISOS_PREDETERMINADOS = ['new-expense', 'verification'];

  // Si es el super admin, acceso total (antes de cualquier validación)
  if (user && user.email === 'admin@alianzaelectrica.com') {
    return <>{children}</>;
  }

  useEffect(() => {
    if (requiredPermission && user) {
      // Si el permiso es predeterminado, dejar pasar
      if (PERMISOS_PREDETERMINADOS.includes(requiredPermission)) {
        setHasPermission(true);
        return;
      }
      api
        .get(`/permissions/user/${user.id}`)
        .then(res => {
          const permisos = res.data.map((p: any) => p.viewName);
          setHasPermission(permisos.includes(requiredPermission));
        })
        .catch(() => setHasPermission(false));
    } else {
      setHasPermission(true);
    }
  }, [requiredPermission, user]);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.roleId)) {
    return <Navigate to='/dashboard' replace />;
  }

  if (requiredPermission && hasPermission === false) {
    return <Navigate to='/dashboard' replace />;
  }

  if (hasPermission === null && requiredPermission) {
    // Aún cargando permisos
    return null;
  }

  return <>{children}</>;
};
