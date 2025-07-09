import { useEffect, useState } from 'react';
import { Viatico } from '../interfaces/comprobacionestable.Interface';
import { getExpenseRequests } from '@/services/expenseService';
import { getComprobaciones } from '@/services/comprobacionesService';

export const useViaticos = () => {
  const [viaticos, setViaticos] = useState<Viatico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchViaticos = async () => {
      try {
        // Obtener viáticos dispersados y comprobaciones pendientes de SAP
        const [viaticosData, comprobacionesPendientes] = await Promise.all([
          getExpenseRequests(),
          getComprobaciones(true), // Solo comprobaciones pendientes de SAP
        ]);

        // Filtrar viáticos que tengan comprobaciones pendientes de SAP
        const viaticosConComprobacionesPendientes = viaticosData.filter(
          (v: Viatico) => {
            // Solo incluir viáticos dispersados
            if (v.status.toLowerCase() !== 'dispersada') {
              return false;
            }

            // Verificar si el viático tiene comprobaciones pendientes de SAP
            const tieneComprobacionesPendientes = comprobacionesPendientes.some(
              (comp: any) => comp.viaticoId === v.id,
            );

            return tieneComprobacionesPendientes;
          },
        );

        setViaticos(viaticosConComprobacionesPendientes);
      } catch {
        setError('Error al cargar los viáticos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchViaticos();
  }, []);

  return { viaticos, isLoading, error };
};
