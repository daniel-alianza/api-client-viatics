export interface ExpenseVerification {
  requestNumber: string;
  company: string;
  bank: string;
  transactionNumber: string;
  date: string;
  card: string;
  initialExpense: number;
  description: string;
  totalToVerify: number;
  documentType: 'ticket' | 'factura';
  files: File[];
}

export interface PendingExpense {
  id: string;
  description: string;
  date: string;
  amount: number;
}

export type DocumentType = 'ticket' | 'factura';
export type FileType = 'xml' | 'pdf';

export interface Document {
  id: number;
  type: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  comprobacionId: number;
  description: string | null;
}

export interface Comprobacion {
  id: number;
  viaticoId: string;
  sequence: string;
  dueDate: Date;
  memo: string;
  debitAmount: number;
  acctName: string;
  ref: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  expenseRequestId: number | null;
  comprobanteType: string;
  responsable: string | null;
  motivo: string | null;
  descripcion: string | null;
  importe: number | null;
  approverId: number | null;
  approverComment: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  expenseRequest: {
    id: number;
    totalAmount: number;
    status: string;
    travelReason: string;
  } | null;
  documents: Document[];
}

export interface ComprobacionesResponse {
  status: string;
  message: string;
  data: Comprobacion[];
  timestamp: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}
