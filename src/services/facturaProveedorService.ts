import { api } from './api';
import { FacturaProveedorRequest } from '../interfaces/facturaprovInterface';

export const generarFacturaProveedor = async (
  data: FacturaProveedorRequest,
) => {
  try {
    const response = await api.post(
      '/generate-fact-prov/factura-proveedor',
      data,
    );
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        success: false,
        message: 'Error desconocido al generar la factura de proveedor.',
      }
    );
  }
};
