import { api } from './api';

export interface TaxCode {
  id: string;
  code: string;
  description: string;
  rate: number;
  Code: string;
}

interface TaxCodeResponse {
  success: boolean;
  message: string;
  data: string[];
}

/**
 * Obtiene los códigos de impuestos según la empresa
 * @param company Nombre de la empresa
 * @returns Lista de códigos de impuestos
 */
export const getTaxCodes = async (company: string): Promise<TaxCode[]> => {
  try {
    const response = await api.get<TaxCodeResponse>(
      `/sales-taxcode?empresa=${company}`,
    );

    // La API devuelve {success: true, message: '...', data: [...]}
    // Necesitamos acceder a response.data.data
    const taxCodesData = response.data.data || [];

    // Convertir los strings a objetos TaxCode
    const taxCodes: TaxCode[] = taxCodesData.map(
      (code: string, index: number) => ({
        id: index.toString(),
        code: code,
        description: code,
        rate: 0,
        Code: code,
      }),
    );

    return taxCodes;
  } catch (error) {
    console.error(
      '[TaxcodeService] Error al obtener los códigos de impuestos:',
      error,
    );
    throw error;
  }
};
