import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import { collaboratorService } from '@/services/collaboratorService';

interface CollaboratorContextType {
  collaborators: Collaborator[];
  loading: boolean;
  error: string | null;
  addCollaborator: (collaborator: Omit<Collaborator, 'id'>) => Promise<void>;
  updateCollaborator: (
    id: string,
    collaborator: Partial<Collaborator>,
  ) => Promise<void>;
  removeCollaborator: (id: string) => Promise<void>;
  assignCard: (id: string, cardNumber: string) => Promise<void>;
  refreshCollaborators: () => Promise<void>;
}

const CollaboratorContext = createContext<CollaboratorContextType | undefined>(
  undefined,
);

export function CollaboratorProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      setError(null);
      // Obtener solo colaboradores sin tarjeta
      const data = await collaboratorService.getCollaboratorsWithoutCard();
      setCollaborators(data);
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

  return (
    <CollaboratorContext.Provider
      value={{
        collaborators,
        loading,
        error,
        addCollaborator,
        updateCollaborator,
        removeCollaborator,
        assignCard,
        refreshCollaborators,
      }}
    >
      {children}
    </CollaboratorContext.Provider>
  );
}

export function useCollaboratorContext() {
  const context = useContext(CollaboratorContext);
  if (context === undefined) {
    throw new Error(
      'useCollaboratorContext must be used within a CollaboratorProvider',
    );
  }
  return context;
}
