import { api } from './api';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import { Card } from '@/interfaces/cardInterface';

// Tipos de error personalizados
class CardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CardError';
  }
}

class CardNotFoundException extends Error {
  constructor() {
    super('Tarjeta no encontrada');
    this.name = 'CardNotFoundException';
  }
}

export const collaboratorService = {
  getCollaborators: async (): Promise<Collaborator[]> => {
    try {
      const { data } = await api.get<Collaborator[]>('/users');
      return data;
    } catch (error) {
      console.error('Error al obtener colaboradores:', error);
      throw error;
    }
  },

  getCollaboratorsWithoutCard: async (): Promise<Collaborator[]> => {
    try {
      const { data } = await api.get<Collaborator[]>('/users');
      return data.filter(collaborator => !collaborator.hasCard);
    } catch (error) {
      console.error('Error al obtener colaboradores sin tarjeta:', error);
      throw error;
    }
  },

  createCollaborator: async (
    collaborator: Omit<Collaborator, 'id'>,
  ): Promise<Collaborator> => {
    try {
      const { data } = await api.post<Collaborator>('/users', collaborator);
      return data;
    } catch (error) {
      console.error('Error al crear colaborador:', error);
      throw error;
    }
  },

  updateCollaborator: async (
    id: string,
    collaborator: Partial<Collaborator>,
  ): Promise<Collaborator> => {
    try {
      const { data } = await api.patch<Collaborator>(
        `/users/${id}`,
        collaborator,
      );
      return data;
    } catch (error) {
      console.error('Error al actualizar colaborador:', error);
      throw error;
    }
  },

  assignCard: async (
    id: string,
    cardNumber: string,
    companyId?: string,
  ): Promise<Collaborator> => {
    try {
      const payload: any = { cardNumber };
      if (companyId) payload.companyId = Number(companyId);
      const { data } = await api.post<Collaborator>(
        `/users/${id}/cards`,
        payload,
      );
      return data;
    } catch (error: any) {
      // Manejar errores específicos con mensajes amigables
      if (error.response?.status === 409) {
        throw new CardError('Esta tarjeta ya está registrada en el sistema');
      }
      if (error.response?.status === 400) {
        const message =
          error.response?.data?.message ||
          'Datos inválidos para asignar la tarjeta';
        throw new CardError(message);
      }
      if (error.response?.status === 404) {
        throw new CardError('El colaborador no fue encontrado');
      }
      if (error.response?.status === 422) {
        throw new CardError('El número de tarjeta no es válido');
      }

      // Para otros errores, usar el mensaje del servidor si está disponible
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new CardError(serverMessage);
      }

      // Mensaje genérico para errores no manejados
      console.error('Error al asignar tarjeta:', error);
      throw new CardError(
        'Error al asignar la tarjeta. Por favor, inténtalo de nuevo.',
      );
    }
  },

  deleteCollaborator: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error al eliminar colaborador:', error);
      throw error;
    }
  },

  removeCard: async (cardId: string): Promise<void> => {
    try {
      await api.delete(`/users/cards/${cardId}`);
    } catch (error: any) {
      // Manejar errores específicos con mensajes amigables
      if (error.response?.status === 404) {
        throw new CardNotFoundException();
      }
      if (error.response?.status === 400) {
        const message =
          error.response?.data?.message || 'No se puede eliminar la tarjeta';
        throw new CardError(message);
      }

      // Para otros errores, usar el mensaje del servidor si está disponible
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new CardError(serverMessage);
      }

      // Mensaje genérico para errores no manejados
      console.error('Error al eliminar tarjeta:', error);
      throw new CardError(
        'Error al eliminar la tarjeta. Por favor, inténtalo de nuevo.',
      );
    }
  },

  updateCard: async (
    cardId: string,
    cardData: { cardNumber?: string; isActive?: boolean; companyId?: number },
  ): Promise<Card> => {
    try {
      const { data } = await api.patch<Card>(
        `/users/cards/${cardId}`,
        cardData,
      );
      return data;
    } catch (error: any) {
      // Manejar errores específicos con mensajes amigables
      if (error.response?.status === 409) {
        throw new CardError('Este número de tarjeta ya está en uso');
      }
      if (error.response?.status === 404) {
        throw new CardNotFoundException();
      }
      if (error.response?.status === 400) {
        const message =
          error.response?.data?.message ||
          'Datos inválidos para actualizar la tarjeta';
        throw new CardError(message);
      }

      // Para otros errores, usar el mensaje del servidor si está disponible
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new CardError(serverMessage);
      }

      // Mensaje genérico para errores no manejados
      console.error('Error al actualizar tarjeta:', error);
      throw new CardError(
        'Error al actualizar la tarjeta. Por favor, inténtalo de nuevo.',
      );
    }
  },
};
