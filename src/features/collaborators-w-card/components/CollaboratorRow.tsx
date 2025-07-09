import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { CollaboratorRowProps } from '@/features/collaborators-w-card/interfaces/RowpropInterface';
import { useCollaboratorCard } from '../hooks/useCollaboratorCard';
import type { Company } from '@/interfaces/infoInterface';

export default function CollaboratorRow({
  collaborator,
  onEdit,
  onRefresh,
  companies = [],
}: CollaboratorRowProps & { companies?: Company[] }) {
  const { activeCard, department, isDeleting, handleDeleteCard } =
    useCollaboratorCard(collaborator, onRefresh);
  const companyName =
    companies.find(c => c.id.toString() === collaborator.companyId?.toString())
      ?.name || 'Sin compañía';

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
      <TableCell>{companyName}</TableCell>
      <TableCell className='text-right'>
        <div className='flex justify-end gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={onEdit}
            disabled={!activeCard}
            className='text-[#0A1A4D] border-[#0A1A4D] hover:bg-[#0A1A4D] hover:text-white transition-all duration-300 cursor-pointer'
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
              className='text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer'
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
