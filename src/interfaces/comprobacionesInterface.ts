export interface UploadFacturaData {
  comprobacionId: number;
  type: 'factura';
  pdf?: File;
  xml?: File;
  description?: string;
  sequence?: number;
  reference?: string;
  accountName?: string;
  debitAmount?: number;
  memo?: string;
}

export interface UploadTicketData {
  comprobacionId: number;
  type: 'ticket';
  file: File;
  responsable: string;
  motivo: string;
  descripcion: string;
  importe: number;
  sequence?: number;
  reference?: string;
  accountName?: string;
  debitAmount?: number;
  memo?: string;
}
