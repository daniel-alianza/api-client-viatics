import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useViaticos } from './useViaticos';
import { Viatico } from '../interfaces/comprobacionestable.Interface';
import { Collaborator } from '../interfaces/comprobacionestable.Interface';
import { collaboratorService } from '@/services/collaboratorService';

export const useCompTable = () => {
  const { viaticos, isLoading, error } = useViaticos();
  const [selected, setSelected] = useState<Viatico | null>(null);
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = async (viatico: Viatico) => {
    try {
      const collaborators = await collaboratorService.getCollaborators();
      const found = collaborators.find(c => c.id.toString() === viatico.userId);
      if (found) {
        setCollaborator({
          id: found.id.toString(),
          name: found.name,
          email: found.email,
          cardNumber: found.cards?.[0]?.cardNumber || '-',
        });
      }
    } catch {
      console.error('Error al obtener colaborador');
    } finally {
      setSelected(viatico);
      setModalOpen(true);
    }
  };

  const handleRedirect = (id: string) =>
    navigate(`/accounting-clearance/movimientos/${id}`);

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return {
    viaticos,
    isLoading,
    error,
    selected,
    collaborator,
    modalOpen,
    openModal,
    handleRedirect,
    closeModal,
  };
};
