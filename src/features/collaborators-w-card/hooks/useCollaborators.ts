import { useState, useEffect } from 'react';
import { collaboratorService } from '@/services/collaboratorService';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await collaboratorService.getCollaboratorsWithoutCard();

      // Mapear los datos para asegurar que el departamento se obtiene del área
      const mappedCollaborators = data.map(collaborator => ({
        ...collaborator,
        department: collaborator.area?.name || collaborator.department || '—',
      }));

      setCollaborators(mappedCollaborators);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar colaboradores',
      );
      console.error('Error fetching collaborators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const addCollaborator = async (collaborator: Omit<Collaborator, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newCollaborator = await collaboratorService.createCollaborator(
        collaborator,
      );
      setCollaborators(prev => [...prev, newCollaborator]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al crear colaborador',
      );
      console.error('Error creating collaborator:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCollaborator = async (
    id: string,
    updatedData: Partial<Collaborator>,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCollaborator = await collaboratorService.updateCollaborator(
        id,
        updatedData,
      );
      setCollaborators(prev =>
        prev.map(collab =>
          collab.id.toString() === id ? updatedCollaborator : collab,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al actualizar colaborador',
      );
      console.error('Error updating collaborator:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await collaboratorService.deleteCollaborator(id);
      setCollaborators(prev =>
        prev.filter(collab => collab.id.toString() !== id),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al eliminar colaborador',
      );
      console.error('Error deleting collaborator:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignCard = async (id: string, cardNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCollaborator = await collaboratorService.assignCard(
        id,
        cardNumber,
      );
      // Si el colaborador ahora tiene tarjeta, lo eliminamos de la lista
      if (updatedCollaborator.hasCard) {
        setCollaborators(prev =>
          prev.filter(collab => collab.id.toString() !== id),
        );
      } else {
        setCollaborators(prev =>
          prev.map(collab =>
            collab.id.toString() === id ? updatedCollaborator : collab,
          ),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar tarjeta');
      console.error('Error assigning card:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshCollaborators = async () => {
    await fetchCollaborators();
  };

  return {
    collaborators,
    loading,
    error,
    addCollaborator,
    updateCollaborator,
    removeCollaborator,
    assignCard,
    refreshCollaborators,
  };
}
