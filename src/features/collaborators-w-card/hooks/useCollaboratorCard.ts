import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { collaboratorService } from '@/services/collaboratorService';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';

export function useCollaboratorCard(
  collaborator: Collaborator,
  onRefresh: () => void,
) {
  const [isDeleting, setIsDeleting] = useState(false);

  const activeCard = useMemo(() => {
    return collaborator.cards
      .filter(card => card.isActive)
      .sort(
        (a, b) =>
          new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
      )[0];
  }, [collaborator.cards]);

  const department = useMemo(() => {
    return collaborator.area?.name || collaborator.department || '—';
  }, [collaborator]);

  const handleDeleteCard = async () => {
    if (!activeCard) return;

    try {
      setIsDeleting(true);
      await collaboratorService.removeCard(activeCard.id.toString());

      toast.success('Tarjeta eliminada', {
        description: 'La tarjeta ha sido eliminada exitosamente.',
      });

      onRefresh();
    } catch (error) {
      console.error('Error al eliminar la tarjeta:', error);
      toast.error('Error', {
        description:
          error instanceof Error
            ? error.message
            : 'Error al eliminar la tarjeta',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    activeCard,
    department,
    isDeleting,
    handleDeleteCard,
  };
}
