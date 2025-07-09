import { api } from './api';

// Servicio para obtener las descripciones de factores (norma de reparto) para Alianza Electrica
export async function getFactorDescriptions() {
  try {
    const { data } = await api.get('/distribution-rules/factor-descriptions', {
      params: { empresa: 'Alianza Electrica' },
    });
    return data;
  } catch (error) {
    console.error('Error al obtener las normas de reparto:', error);
    return [];
  }
}
