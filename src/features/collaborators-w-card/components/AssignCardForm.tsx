import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import type {
  AssignCardState,
  AssignCardHandlers,
} from '../interfaces/collaboratorTableInterfaces';

interface Props {
  collaborators: Collaborator[];
  assignCardState: AssignCardState;
  assignCardHandlers: AssignCardHandlers;
  companies: { id: string | number; name: string }[];
}

export function AssignCardForm({
  collaborators,
  assignCardState,
  assignCardHandlers,
  companies,
}: Props) {
  const {
    isAssigning,
    selectedCollaborator,
    cardNumber,
    companyId,
    isSubmitting,
  } = assignCardState;
  const {
    handleAssignCard,
    cancelAssign,
    setCardNumber,
    setCompanyId,
    setSelectedCollaborator,
  } = assignCardHandlers;

  const availableCollaborators = collaborators.filter(
    collab => collab.cards.filter(card => card.isActive).length < 3,
  );

  if (!isAssigning) return null;

  const selected = availableCollaborators.find(
    c => c.id.toString() === selectedCollaborator,
  );
  const maxCards = selected && selected.cards && selected.cards.length >= 3;

  // Validar si ya tiene tarjeta de la compañía seleccionada
  const selectedCompanyName = companies.find(
    c => c.id.toString() === companyId,
  )?.name;
  const restrictedCompanies = [
    'Alianza Electrica',
    'Fg Electrical',
    'FG Manufacturing',
  ];
  const hasCardFromSameCompany = !!(
    selectedCompanyName &&
    restrictedCompanies.includes(selectedCompanyName) &&
    selected &&
    selected.cards.some(
      (card: any) => card.isActive && card.companyId?.toString() === companyId,
    )
  );

  return (
    <div className='bg-orange-50 p-4 rounded-lg border border-orange-200 animate-slideDown'>
      <h3 className='font-medium text-[#F34602] mb-3'>
        Asignar Tarjeta a Colaborador
      </h3>
      <div className='space-y-4'>
        <Select
          value={selectedCollaborator}
          onValueChange={setSelectedCollaborator}
        >
          <SelectTrigger className='border-orange-200 focus:border-[#F34602] focus:ring-[#F34602] cursor-pointer'>
            <SelectValue placeholder='Seleccionar colaborador' />
          </SelectTrigger>
          <SelectContent>
            {availableCollaborators.map(collab => (
              <SelectItem key={collab.id} value={collab.id.toString()}>
                {collab.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selected && (
          <>
            <Input
              placeholder='Email'
              value={selected.email}
              disabled
              className='border-orange-200 bg-orange-50'
            />
            <Input
              placeholder='Número de Tarjeta'
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              className='border-orange-200 focus:border-[#F34602] focus:ring-[#F34602]'
            />
            <Select
              value={companyId || ''}
              onValueChange={setCompanyId}
              required
            >
              <SelectTrigger className='border-orange-200 focus:border-[#F34602] focus:ring-[#F34602] cursor-pointer'>
                <SelectValue placeholder='Seleccionar compañía' />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {maxCards && (
              <div className='text-red-600 text-sm'>
                El usuario ya tiene 3 tarjetas asignadas.
              </div>
            )}
            {hasCardFromSameCompany && (
              <div className='text-red-600 text-sm'>
                El usuario ya tiene una tarjeta de {selectedCompanyName}. No se
                puede asignar otra tarjeta de la misma compañía.
              </div>
            )}
            {assignCardState.assignCardError && (
              <div className='text-red-600 text-sm'>
                {assignCardState.assignCardError}
              </div>
            )}
          </>
        )}
      </div>
      <div className='flex justify-end gap-2 mt-4'>
        <Button
          variant='outline'
          onClick={cancelAssign}
          className='cursor-pointer'
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAssignCard}
          className='bg-[#F34602] hover:bg-orange-600 transition-all duration-300 cursor-pointer'
          disabled={
            isSubmitting ||
            !selectedCollaborator ||
            !cardNumber ||
            !companyId ||
            (selected && selected.cards && selected.cards.length >= 3) ||
            hasCardFromSameCompany
          }
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
  );
}
