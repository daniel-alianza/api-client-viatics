import { useEffect, useState } from 'react';
import { useCollaborators } from '@/features/collaborators-w-card/hooks/useCollaborators';
import { getCompanies } from '@/services/info-moduleService';
import { toast } from 'sonner';
import type { CollaboratorTableLogic } from '../interfaces/collaboratorTableInterfaces';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import type { Company } from '@/interfaces/infoInterface';

interface UseCollaboratorTableReturn extends CollaboratorTableLogic {
  loading: boolean;
  error: string | null;
  refreshCollaborators: () => void;
}

export function useCollaboratorTableLogic(): UseCollaboratorTableReturn {
  const { collaborators, loading, error, refreshCollaborators, assignCard } =
    useCollaborators();

  const [editingCollaborator, setEditingCollaborator] =
    useState<Collaborator | null>(null);
  const [deletingCollaborator, setDeletingCollaborator] =
    useState<Collaborator | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [companies, setCompanies] = useState<Company[]>([]);

  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [assignCardError, setAssignCardError] = useState('');

  const filteredCollaborators = (
    selectedCompany !== 'all'
      ? collaborators.filter(c => c.companyId?.toString() === selectedCompany)
      : collaborators
  ).sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]));
  }, []);

  const handleAssignCard = async () => {
    if (!selectedCollaborator || !cardNumber.trim() || !companyId) {
      toast.error('Error', {
        description:
          'Por favor selecciona un colaborador, una compañía e ingresa un número de tarjeta',
      });
      setAssignCardError(
        'Por favor selecciona un colaborador, una compañía e ingresa un número de tarjeta',
      );
      return;
    }

    // Validar máximo 3 tarjetas
    const selected = collaborators.find(
      c => c.id.toString() === selectedCollaborator,
    );
    if (selected && selected.cards && selected.cards.length >= 3) {
      toast.error('Error', {
        description: 'El usuario ya tiene 3 tarjetas asignadas',
      });
      setAssignCardError('El usuario ya tiene 3 tarjetas asignadas');
      return;
    }

    // Validar que no tenga más de una tarjeta por compañía específica
    const selectedCompanyName = companies.find(
      c => c.id.toString() === companyId,
    )?.name;
    const restrictedCompanies = [
      'Alianza Electrica',
      'Fg Electrical',
      'FG Manufacturing',
    ];
    // Nueva validación: buscar si alguna tarjeta activa del colaborador tiene el companyId seleccionado
    let hasCardFromSameCompany = false;
    if (
      selectedCompanyName &&
      restrictedCompanies.includes(selectedCompanyName) &&
      selected
    ) {
      hasCardFromSameCompany = selected.cards.some(
        (card: any) =>
          card.isActive && card.companyId?.toString() === companyId,
      );
    }
    if (hasCardFromSameCompany) {
      toast.error('Error', {
        description: `El usuario ya tiene una tarjeta de ${selectedCompanyName}. No se puede asignar otra tarjeta de la misma compañía.`,
      });
      setAssignCardError(
        `El usuario ya tiene una tarjeta de ${selectedCompanyName}. No se puede asignar otra tarjeta de la misma compañía.`,
      );
      return;
    }

    setAssignCardError('');
    try {
      setIsSubmitting(true);
      await assignCard(selectedCollaborator, cardNumber, companyId);
      toast.success('Tarjeta asignada', {
        description: 'La tarjeta ha sido asignada exitosamente',
      });
      setIsAssigning(false);
      setSelectedCollaborator('');
      setCardNumber('');
      setCompanyId('');
      setAssignCardError('');
      refreshCollaborators();
    } catch (error: any) {
      let mensaje =
        error instanceof Error ? error.message : 'Error al asignar la tarjeta';
      // Si el error es de tarjeta duplicada, buscar el colaborador que la tiene
      if (
        mensaje.includes('ya está registrada') ||
        mensaje.includes('ya está en uso')
      ) {
        const found = collaborators.find(collab =>
          collab.cards.some(card => card.cardNumber === cardNumber),
        );
        if (found) {
          mensaje = `La tarjeta ya está asignada al colaborador: ${found.name}`;
        }
      }
      setAssignCardError(mensaje);
      toast.error('Error', {
        description: mensaje,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelAssign = () => {
    setIsAssigning(false);
    setSelectedCollaborator('');
    setCardNumber('');
    setCompanyId('');
    setAssignCardError('');
  };

  return {
    assignCardState: {
      isAssigning,
      selectedCollaborator,
      cardNumber,
      companyId,
      isSubmitting,
      assignCardError,
    },
    assignCardHandlers: {
      handleAssignCard,
      cancelAssign,
      setCardNumber,
      setCompanyId,
      setSelectedCollaborator,
      setIsAssigning,
      setAssignCardError,
    },
    editingCollaborator,
    setEditingCollaborator,
    deletingCollaborator,
    setDeletingCollaborator,
    showDownloadModal,
    setShowDownloadModal,
    selectedCompany,
    setSelectedCompany,
    companies,
    filteredCollaborators,
    loading,
    error,
    refreshCollaborators,
  };
}
