import { apiFetch } from './api';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';

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

interface Card {
  id: number;
  cardNumber: string;
  isActive: boolean;
  assignedAt: string;
  userId: number;
}

/**
 * Servicio para gestionar colaboradores
 */
export const collaboratorService = {
  /**
   * Obtiene todos los colaboradores
   * @returns Lista de colaboradores
   */
  getCollaborators: async (): Promise<Collaborator[]> => {
    try {
      return await apiFetch<Collaborator[]>('/users');
    } catch (error) {
      console.error('Error al obtener colaboradores:', error);
      throw error;
    }
  },

  /**
   * Obtiene colaboradores sin tarjeta asignada
   * @returns Lista de colaboradores sin tarjeta
   */
  getCollaboratorsWithoutCard: async (): Promise<Collaborator[]> => {
    try {
      const collaborators = await apiFetch<Collaborator[]>('/users');
      return collaborators.filter(collaborator => !collaborator.hasCard);
    } catch (error) {
      console.error('Error al obtener colaboradores sin tarjeta:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo colaborador
   * @param collaborator - Datos del colaborador a crear
   * @returns Colaborador creado
   */
  createCollaborator: async (
    collaborator: Omit<Collaborator, 'id'>,
  ): Promise<Collaborator> => {
    try {
      return await apiFetch<Collaborator>('/users', {
        method: 'POST',
        body: JSON.stringify(collaborator),
      });
    } catch (error) {
      console.error('Error al crear colaborador:', error);
      throw error;
    }
  },

  /**
   * Actualiza un colaborador existente
   * @param id - ID del colaborador
   * @param collaborator - Datos actualizados del colaborador
   * @returns Colaborador actualizado
   */
  updateCollaborator: async (
    id: string,
    collaborator: Partial<Collaborator>,
  ): Promise<Collaborator> => {
    try {
      return await apiFetch<Collaborator>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(collaborator),
      });
    } catch (error) {
      console.error('Error al actualizar colaborador:', error);
      throw error;
    }
  },

  /**
   * Asigna una tarjeta a un colaborador
   * @param id - ID del colaborador
   * @param cardNumber - Número de tarjeta a asignar
   * @throws {CardError} Si la tarjeta ya está registrada
   * @returns Colaborador actualizado
   */
  assignCard: async (id: string, cardNumber: string): Promise<Collaborator> => {
    try {
      return await apiFetch<Collaborator>(`/users/${id}/cards`, {
        method: 'POST',
        body: JSON.stringify({ cardNumber }),
      });
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

  /**
   * Elimina un colaborador
   * @param id - ID del colaborador a eliminar
   * @returns Resultado de la operación
   */
  deleteCollaborator: async (id: string): Promise<void> => {
    try {
      await apiFetch<void>(`/users/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error al eliminar colaborador:', error);
      throw error;
    }
  },

  /**
   * Elimina una tarjeta específica
   * @param cardId - ID de la tarjeta a eliminar
   * @throws {CardNotFoundException} Si la tarjeta no existe
   * @returns void
   */
  removeCard: async (cardId: string): Promise<void> => {
    try {
      await apiFetch<void>(`/users/cards/${cardId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrada')) {
        throw new CardNotFoundException();
      }
      console.error('Error al eliminar tarjeta:', error);
      throw error;
    }
  },

  /**
   * Actualiza una tarjeta específica
   * @param cardId - ID de la tarjeta a actualizar
   * @param cardData - Datos de la tarjeta a actualizar
   * @throws {CardError} Si el número de tarjeta ya está en uso
   * @throws {CardNotFoundException} Si la tarjeta no existe
   * @returns Tarjeta actualizada
   */
  updateCard: async (
    cardId: string,
    cardData: { cardNumber?: string; isActive?: boolean },
  ): Promise<Card> => {
    try {
      return await apiFetch<Card>(`/users/cards/${cardId}`, {
        method: 'PATCH',
        body: JSON.stringify(cardData),
      });
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
