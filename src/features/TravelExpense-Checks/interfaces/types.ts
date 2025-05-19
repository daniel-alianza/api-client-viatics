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
  documentType: 'ticket' | 'invoice';
  files: File[];
}

export interface PendingExpense {
  id: string;
  description: string;
  date: string;
  amount: number;
}

export type DocumentType = 'ticket' | 'invoice';
export type FileType = 'xml' | 'pdf';
