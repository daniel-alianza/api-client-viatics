import { useState, useCallback, useEffect } from 'react';
import { getComprobaciones } from '@/services/comprobacionesService';
import { AccountingClearanceState } from '../interfaces';

export const useAccountingClearance = () => {
  const [state, setState] = useState<AccountingClearanceState>({
    comprobaciones: [],
    isLoading: false,
    error: null,
  });

  const refreshComprobaciones = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await getComprobaciones(true); // Solo comprobaciones pendientes de SAP
      setState(prev => ({
        ...prev,
        comprobaciones: Array.isArray(response) ? response : [],
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Error al cargar las comprobaciones',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    refreshComprobaciones();
  }, [refreshComprobaciones]);

  return {
    ...state,
    refreshComprobaciones,
  };
};
