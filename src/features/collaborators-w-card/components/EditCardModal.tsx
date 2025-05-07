'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCollaborators } from '@/features/collaborators-w-card/hooks/useCollaborators';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { collaboratorService } from '@/services/collaboratorService';

interface EditCardModalProps {
  collaborator: Collaborator;
  onClose: () => void;
}

export default function EditCardModal({
  collaborator,
  onClose,
}: EditCardModalProps) {
  const { refreshCollaborators } = useCollaborators();
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener la tarjeta activa más reciente
  const activeCard = collaborator.cards
    .filter(card => card.isActive)
    .sort(
      (a, b) =>
        new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
    )[0];

  // Inicializar el número de tarjeta con la tarjeta actual
  useEffect(() => {
    if (activeCard) {
      setCardNumber(activeCard.cardNumber);
    }
  }, [activeCard]);

  const handleSave = async () => {
    if (!cardNumber.trim()) {
      setError('El número de tarjeta no puede estar vacío');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (activeCard) {
        // Si ya tiene una tarjeta, actualizarla
        await collaboratorService.updateCard(activeCard.id.toString(), {
          cardNumber: cardNumber,
          isActive: true,
        });
      } else {
        // Si no tiene tarjeta, asignar una nueva
        await collaboratorService.assignCard(
          collaborator.id.toString(),
          cardNumber,
        );
      }

      // Actualizar la lista de colaboradores
      await refreshCollaborators();
      // Cerrar el modal
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al actualizar la tarjeta');
      }
      console.error('Error updating card:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md animate-scaleIn'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-[#F34602]'>
            <CreditCard className='h-5 w-5' />
            {activeCard ? 'Editar Tarjeta' : 'Asignar Tarjeta'}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <div className='flex items-center gap-2 text-red-600'>
                <AlertCircle className='h-4 w-4' />
                <p>{error}</p>
              </div>
            </div>
          )}
          <div className='space-y-2'>
            <div className='font-medium'>Colaborador</div>
            <div className='text-sm text-gray-500'>
              {collaborator.name} • {collaborator.email}
            </div>
          </div>
          {activeCard && (
            <div className='space-y-2'>
              <div className='font-medium'>Tarjeta Actual</div>
              <div className='text-sm text-gray-500 flex items-center'>
                <CreditCard className='h-4 w-4 mr-1 text-green-600' />
                {activeCard.cardNumber}
              </div>
            </div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='cardNumber'>Número de Tarjeta</Label>
            <Input
              id='cardNumber'
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder='Ingrese número de tarjeta'
              className='border-gray-300 focus:border-[#F34602] focus:ring-[#F34602]'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className='bg-[#F34602] hover:bg-orange-600 transition-all duration-300'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : null}
            {activeCard ? 'Actualizar Tarjeta' : 'Asignar Tarjeta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
