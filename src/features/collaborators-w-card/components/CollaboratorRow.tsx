import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CreditCard, Loader2 } from 'lucide-react';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import { collaboratorService } from '@/services/collaboratorService';
import { toast } from 'sonner';

interface CollaboratorRowProps {
  collaborator: Collaborator;
  onEdit: () => void;
  onRefresh: () => void;
}

export default function CollaboratorRow({
  collaborator,
  onEdit,
  onRefresh,
}: CollaboratorRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Obtener la tarjeta activa más reciente
  const activeCard = collaborator.cards
    .filter(card => card.isActive)
    .sort(
      (a, b) =>
        new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
    )[0];

  // Obtener el departamento o área del colaborador
  const department = collaborator.area?.name || collaborator.department || '—';

  const handleDeleteCard = async () => {
    if (!activeCard) return;

    try {
      setIsDeleting(true);
      await collaboratorService.removeCard(activeCard.id.toString());

      toast.success('Tarjeta eliminada', {
        description: 'La tarjeta ha sido eliminada exitosamente.',
      });

      // Refrescar la lista de colaboradores
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

  return (
    <TableRow className='hover:bg-orange-50 transition-colors duration-200'>
      <TableCell className='font-medium'>{collaborator.name}</TableCell>
      <TableCell>{collaborator.email}</TableCell>
      <TableCell>{department}</TableCell>
      <TableCell>
        {activeCard ? (
          <span className='flex items-center text-green-600'>
            <CreditCard className='h-4 w-4 mr-1' />
            {activeCard.cardNumber}
          </span>
        ) : (
          <span className='text-amber-600'>Sin tarjeta asignada</span>
        )}
      </TableCell>
      <TableCell className='text-right'>
        <div className='flex justify-end gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={onEdit}
            disabled={!activeCard}
            className='text-[#0A1A4D] border-[#0A1A4D] hover:bg-[#0A1A4D] hover:text-white transition-all duration-300'
          >
            <Edit className='h-4 w-4 mr-1' />
            Editar
          </Button>
          {activeCard && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleDeleteCard}
              disabled={isDeleting}
              className='text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300'
            >
              {isDeleting ? (
                <Loader2 className='h-4 w-4 mr-1 animate-spin' />
              ) : (
                <Trash2 className='h-4 w-4 mr-1' />
              )}
              Eliminar Tarjeta
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
