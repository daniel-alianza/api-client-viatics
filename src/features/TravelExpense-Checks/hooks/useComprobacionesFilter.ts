import { useMemo } from 'react';
import type { Comprobacion } from '../interfaces/types';

interface UseComprobacionesFilterReturn {
  pendingComprobaciones: Comprobacion[];
  rejectedComprobaciones: Comprobacion[];
  verifiedComprobaciones: Comprobacion[];
  totalComprobaciones: number;
  pendingCount: number;
  rejectedCount: number;
  verifiedCount: number;
}

export const useComprobacionesFilter = (
  comprobaciones: Comprobacion[],
): UseComprobacionesFilterReturn => {
  const filteredComprobaciones = useMemo(() => {
    const pending = comprobaciones.filter(comp => comp.status === 'pendiente');
    const rejected = comprobaciones.filter(comp => comp.status === 'rechazada');
    const verified = comprobaciones.filter(comp => comp.status === 'aprobada');

    return {
      pendingComprobaciones: pending,
      rejectedComprobaciones: rejected,
      verifiedComprobaciones: verified,
      totalComprobaciones: comprobaciones.length,
      pendingCount: pending.length,
      rejectedCount: rejected.length,
      verifiedCount: verified.length,
    };
  }, [comprobaciones]);

  return filteredComprobaciones;
};
