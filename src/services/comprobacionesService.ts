import { api } from './api';
import {
  UploadFacturaData,
  UploadTicketData,
} from '@/interfaces/comprobacionesInterface';

export async function uploadComprobacion(
  data: UploadFacturaData | UploadTicketData,
) {
  const formData = new FormData();

  const comprobacionId = Number(data.comprobacionId);
  if (isNaN(comprobacionId)) {
    throw new Error('El ID de comprobación debe ser un número válido');
  }

  formData.append('comprobacionId', comprobacionId.toString());
  formData.append('type', data.type);

  if (
    'sequence' in data &&
    data.sequence !== undefined &&
    data.sequence !== null
  ) {
    formData.append('sequence', String(data.sequence));
  }
  if ('AccountName' in data && data.AccountName) {
    formData.append('movimientoAcctName', String(data.AccountName));
  }
  if ('DebitAmount' in data && data.DebitAmount !== undefined) {
    formData.append('movimientoDebAmount', String(data.DebitAmount));
  }
  if ('DueDate' in data && data.DueDate) {
    formData.append('movimientoDueDate', String(data.DueDate));
  }
  if ('Reference' in data && data.Reference) {
    formData.append('movimientoRef', String(data.Reference));
  }
  if ('Memo' in data && data.Memo) {
    formData.append('movimientoMemo', String(data.Memo));
  }

  if (data.type === 'factura') {
    if (!data.pdf && !data.xml) {
      throw new Error(
        'Se requiere al menos un archivo (PDF o XML) para facturas',
      );
    }

    if (data.pdf && !data.pdf.type.includes('pdf')) {
      throw new Error('El archivo PDF debe ser de tipo PDF');
    }
    if (data.xml && !data.xml.type.includes('xml')) {
      throw new Error('El archivo XML debe ser de tipo XML');
    }

    if (data.pdf) formData.append('files', data.pdf);
    if (data.xml) formData.append('files', data.xml);

    if (data.description) {
      formData.append('description', data.description);
    }
  } else if (data.type === 'ticket') {
    if (!data.file) {
      throw new Error('Se requiere un archivo para el ticket');
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(data.file.type)) {
      throw new Error('El archivo debe ser PDF, JPEG o PNG');
    }

    formData.append('files', data.file);
    formData.append('responsable', data.responsable);
    formData.append('motivo', data.motivo);
    formData.append('descripcion', data.descripcion);
    formData.append('importe', data.importe.toString());
  }

  try {
    const { data: response } = await api.post(
      '/comprobaciones/upload',
      formData,
    );
    return response;
  } catch (error) {
    console.error('Error al subir la comprobación:', error);
    throw error;
  }
}
