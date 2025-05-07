import { useState } from 'react';
import { useCollaborators } from '@/features/collaborators-w-card/hooks/useCollaborators';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  RefreshCw,
  AlertCircle,
  Loader2,
  Download,
  CreditCard,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CollaboratorRow from './CollaboratorRow';
import EditCardModal from './EditCardModal';
import DeleteConfirmation from './DeleteConfirmation';
import DownloadModal from './DownloadModal';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import { collaboratorService } from '@/services/collaboratorService';
import { toast } from 'sonner';

export default function CollaboratorTable() {
  const { collaborators, loading, error, refreshCollaborators } =
    useCollaborators();

  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('');
  const [cardNumber, setCardNumber] = useState('');
  const [editingCollaborator, setEditingCollaborator] =
    useState<Collaborator | null>(null);
  const [deletingCollaborator, setDeletingCollaborator] =
    useState<Collaborator | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const handleAssignCard = async () => {
    if (!selectedCollaborator || !cardNumber.trim()) {
      toast.error('Error', {
        description:
          'Por favor selecciona un colaborador e ingresa un número de tarjeta',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await collaboratorService.assignCard(selectedCollaborator, cardNumber);

      toast.success('Tarjeta asignada', {
        description: 'La tarjeta ha sido asignada exitosamente',
      });

      setIsAssigning(false);
      setSelectedCollaborator('');
      setCardNumber('');
      refreshCollaborators();
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error
            ? error.message
            : 'Error al asignar la tarjeta',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Colaboradores sin Tarjeta
        </h2>
        <div className='flex gap-2'>
          <Button
            onClick={() => setShowDownloadModal(true)}
            variant='outline'
            className='border-[#F34602] text-[#F34602] hover:bg-orange-50'
            disabled={loading || collaborators.length === 0}
          >
            <Download className='mr-2 h-4 w-4' />
            Descargar asignación por archivo
          </Button>
          <Button
            onClick={refreshCollaborators}
            variant='outline'
            className='border-[#F34602] text-[#F34602] hover:bg-orange-50'
            disabled={loading}
          >
            {loading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <RefreshCw className='mr-2 h-4 w-4' />
            )}
            Actualizar
          </Button>
          <Button
            onClick={() => setIsAssigning(!isAssigning)}
            className='bg-[#F34602] hover:bg-orange-600 transition-all duration-300'
          >
            <CreditCard className='mr-2 h-4 w-4' />
            Asignar Tarjeta
          </Button>
        </div>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center gap-2 text-red-600'>
            <AlertCircle className='h-4 w-4' />
            <h3 className='font-medium'>Error</h3>
          </div>
          <p className='text-red-600 mt-1'>{error}</p>
        </div>
      )}

      {isAssigning && (
        <div className='bg-orange-50 p-4 rounded-lg border border-orange-200 animate-slideDown'>
          <h3 className='font-medium text-[#F34602] mb-3'>
            Asignar Tarjeta a Colaborador
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
            <Select
              value={selectedCollaborator}
              onValueChange={setSelectedCollaborator}
            >
              <SelectTrigger className='border-orange-200 focus:border-[#F34602] focus:ring-[#F34602]'>
                <SelectValue placeholder='Seleccionar colaborador' />
              </SelectTrigger>
              <SelectContent>
                {collaborators
                  .filter(collab => !collab.cards.some(card => card.isActive))
                  .map(collab => (
                    <SelectItem key={collab.id} value={collab.id.toString()}>
                      {collab.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedCollaborator && (
              <>
                <Input
                  placeholder='Email'
                  value={
                    collaborators
                      .filter(c => !c.cards.some(card => card.isActive))
                      .find(c => c.id.toString() === selectedCollaborator)
                      ?.email || ''
                  }
                  disabled
                  className='border-orange-200 bg-orange-50'
                />
                <Input
                  placeholder='Número de Tarjeta'
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className='border-orange-200 focus:border-[#F34602] focus:ring-[#F34602]'
                />
              </>
            )}
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => {
                setIsAssigning(false);
                setSelectedCollaborator('');
                setCardNumber('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignCard}
              className='bg-[#F34602] hover:bg-orange-600 transition-all duration-300'
              disabled={isSubmitting || !selectedCollaborator || !cardNumber}
            >
              {isSubmitting ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <CreditCard className='mr-2 h-4 w-4' />
              )}
              Asignar Tarjeta
            </Button>
          </div>
        </div>
      )}

      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader className='bg-[#0A1A4D] text-white'>
            <TableRow>
              <TableHead className='text-white font-medium'>Nombre</TableHead>
              <TableHead className='text-white font-medium'>Email</TableHead>
              <TableHead className='text-white font-medium'>
                Departamento
              </TableHead>
              <TableHead className='text-white font-medium'>
                Número de Tarjeta
              </TableHead>
              <TableHead className='text-white font-medium text-right'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8'>
                  <div className='flex justify-center items-center'>
                    <Loader2 className='h-6 w-6 animate-spin text-[#F34602]' />
                    <span className='ml-2 text-gray-500'>
                      Cargando colaboradores...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : collaborators.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center py-8 text-gray-500'
                >
                  No hay colaboradores.
                </TableCell>
              </TableRow>
            ) : (
              collaborators.map(collaborator => (
                <CollaboratorRow
                  key={collaborator.id}
                  collaborator={collaborator}
                  onEdit={() => setEditingCollaborator(collaborator)}
                  onRefresh={refreshCollaborators}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingCollaborator && (
        <EditCardModal
          collaborator={editingCollaborator}
          onClose={() => setEditingCollaborator(null)}
        />
      )}

      {deletingCollaborator && (
        <DeleteConfirmation
          collaborator={deletingCollaborator}
          onClose={() => setDeletingCollaborator(null)}
        />
      )}

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        collaborators={collaborators}
      />
    </div>
  );
}
