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
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { collaboratorService } from '@/services/collaboratorService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCompanies } from '@/services/info-moduleService';
import type { Company } from '@/interfaces/infoInterface';
import { toast } from 'sonner';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import type { Card } from '@/features/collaborators-w-card/interfaces/types';

interface EditCardModalProps {
  collaborator: Collaborator;
  onClose: () => void;
}

export default function EditCardModal({
  collaborator,
  onClose,
}: EditCardModalProps) {
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [cards, setCards] = useState(collaborator.cards);

  // Obtener todas las tarjetas del colaborador
  const selectedCard = cards.find(
    (card: Card) => card.id.toString() === selectedCardId,
  );

  // Inicializar selección al abrir modal
  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].id.toString());
    }
  }, [cards, selectedCardId]);

  // Actualizar campos al cambiar tarjeta seleccionada
  useEffect(() => {
    if (selectedCard) {
      setCardNumber(selectedCard.cardNumber);
      setCompanyId(
        (selectedCard as any).companyId?.toString() ||
          collaborator.companyId?.toString() ||
          '',
      );
    }
  }, [selectedCardId, cards]);

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]));
  }, []);

  // Helper para saber si el colaborador ya tiene una tarjeta activa con una compañía
  const hasActiveCardInCompany = (companyId: string) => {
    return cards.some(
      (card: any) =>
        card.isActive &&
        (card.companyId?.toString() || collaborator.companyId?.toString()) ===
          companyId,
    );
  };

  // Helper para obtener el nombre de la compañía de una tarjeta
  const getCompanyName = (card: any) => {
    if (card.company && card.company.name) return card.company.name;
    if (card.companyId && companies.length > 0) {
      const c = companies.find(
        c => c.id.toString() === card.companyId.toString(),
      );
      return c ? c.name : '';
    }
    if (collaborator.companyId && companies.length > 0) {
      const c = companies.find(
        c => c.id.toString() === collaborator.companyId?.toString(),
      );
      return c ? c.name : '';
    }
    return '';
  };

  const handleSave = async () => {
    if (!cardNumber.trim() || !companyId) {
      setError('El número de tarjeta y la compañía no pueden estar vacíos');
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      if (selectedCard) {
        const originalNumber = selectedCard.cardNumber;
        const originalCompanyId =
          (selectedCard as any).companyId?.toString() ||
          collaborator.companyId?.toString() ||
          '';
        let cambio = [];
        if (originalNumber !== cardNumber) cambio.push('número');
        if (originalCompanyId !== companyId) cambio.push('compañía');
        if (cambio.length > 0) {
          await collaboratorService.updateCard(selectedCard.id.toString(), {
            cardNumber: cardNumber,
            companyId: Number(companyId),
            isActive: selectedCard.isActive,
          });
          // Actualizar el estado local de las tarjetas
          const updatedCards = cards.map((card: Card) =>
            card.id === selectedCard.id
              ? { ...card, cardNumber, companyId: Number(companyId) }
              : card,
          );
          setCards(updatedCards);
          setCardNumber(cardNumber);
          setCompanyId(companyId);
          setSelectedCardId(selectedCard.id.toString());
          toast.success(
            `Se actualizó el ${cambio.join(' y ')} de la tarjeta con éxito.`,
          );
        } else {
          toast.info('No se realizaron cambios en la tarjeta.');
        }
      }
    } catch (err: any) {
      let mensaje = 'Error al actualizar la tarjeta';
      if (err instanceof Error) {
        mensaje = err.message;
      } else if (err?.response?.data?.message) {
        mensaje = err.response.data.message;
      }
      // Traducción de errores comunes
      if (mensaje.includes('property companyId should not exist')) {
        mensaje =
          'No se puede actualizar la compañía de la tarjeta. Contacta al administrador para habilitar esta función.';
      }
      if (mensaje.includes('should not exist')) {
        mensaje =
          'No se puede actualizar el campo solicitado. Contacta al administrador.';
      }
      if (
        mensaje.includes('cardNumber') &&
        mensaje.includes('ya está en uso')
      ) {
        mensaje =
          'El número de tarjeta ya está registrado en otra compañía o usuario.';
      }
      setError(mensaje);
      toast.error(mensaje);
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
            Editar Tarjeta
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
          <div className='space-y-2'>
            <Label htmlFor='cardSelect'>Seleccionar Tarjeta</Label>
            <Select value={selectedCardId} onValueChange={setSelectedCardId}>
              <SelectTrigger
                id='cardSelect'
                className='border-gray-300 focus:border-[#F34602] focus:ring-[#F34602]'
              >
                <SelectValue placeholder='Selecciona una tarjeta' />
              </SelectTrigger>
              <SelectContent>
                {cards.map(card => (
                  <SelectItem key={card.id} value={card.id.toString()}>
                    {card.cardNumber} - {getCompanyName(card)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
          <div className='space-y-2'>
            <Label htmlFor='companySelect'>Compañía</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger
                id='companySelect'
                className='border-gray-300 focus:border-[#F34602] focus:ring-[#F34602]'
              >
                <SelectValue placeholder='Selecciona una compañía' />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => {
                  const yaAsignada = hasActiveCardInCompany(
                    company.id.toString(),
                  );
                  return (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name} {yaAsignada ? '(ya asignada)' : ''}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
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
            Actualizar Tarjeta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
