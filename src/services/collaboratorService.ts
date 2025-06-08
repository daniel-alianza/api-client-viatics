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

  assignCard: async (id: string, cardNumber: string): Promise<Collaborator> => {
    try {
      const { data } = await api.post<Collaborator>(`/users/${id}/cards`, {
        cardNumber,
      });
      return data;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('ya está registrada')
      ) {
        throw new CardError('Esta tarjeta ya está registrada');
      }
      console.error('Error al asignar tarjeta:', error);
      throw error;
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
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrada')) {
        throw new CardNotFoundException();
      }
      console.error('Error al eliminar tarjeta:', error);
      throw error;
    }
  },

  updateCard: async (
    cardId: string,
    cardData: { cardNumber?: string; isActive?: boolean },
  ): Promise<Card> => {
    try {
      const { data } = await api.patch<Card>(
        `/users/cards/${cardId}`,
        cardData,
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('ya está en uso')) {
          throw new CardError('Este número de tarjeta ya está en uso');
        }
        if (error.message.includes('no encontrada')) {
          throw new CardNotFoundException();
        }
      }
      console.error('Error al actualizar tarjeta:', error);
      throw error;
    }
  },
};
