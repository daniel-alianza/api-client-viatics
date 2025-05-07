import { useState, useEffect } from 'react';
import { getApprovedExpenses } from '@/services/accountingService';
import type { CardAssignment } from '@/features/accounting-authorization/interfaces/card-assignment';

export function useApprovedExpenses() {
  const [approvedExpenses, setApprovedExpenses] = useState<CardAssignment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedExpenses = async () => {
      try {
        setLoading(true);
        const data = await getApprovedExpenses();
        setApprovedExpenses(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching approved expenses:', err);
        setError('Error al cargar las solicitudes aprobadas');
        setApprovedExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedExpenses();
  }, []);

  return { approvedExpenses, loading, error };
}
