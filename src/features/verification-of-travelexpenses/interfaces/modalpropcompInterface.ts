export interface ComprobacionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: 'factura' | 'ticket';
    files?: { pdf?: File; xml?: File; file?: File };
    description?: string;
    responsable?: string;
    motivo?: string;
    descripcion?: string;
    importe?: number;
  }) => void;
  movimiento: {
    Sequence: string;
    DueDate: string;
    Memo: string;
    DebitAmount: number;
    Reference: string;
  };
  noSolicitud: string;
  sociedad: string;
  isLoading?: boolean;
}
