import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCollaborators } from '@/features/collaborators-w-card/hooks/useCollaborators';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmationProps {
  collaborator: Collaborator;
  onClose: () => void;
}

export default function DeleteConfirmation({
  collaborator,
  onClose,
}: DeleteConfirmationProps) {
  const { removeCollaborator } = useCollaborators();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await removeCollaborator(collaborator.id.toString());
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al eliminar colaborador',
      );
      console.error('Error deleting collaborator:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className='animate-scaleIn'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2 text-red-500'>
            <AlertTriangle className='h-5 w-5' />
            Eliminar Colaborador
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar a {collaborator.name}? Esta
            acción no se puede deshacer.
            {error && <div className='mt-2 text-red-500 text-sm'>{error}</div>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className='bg-red-500 hover:bg-red-600 transition-all duration-300'
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : null}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
