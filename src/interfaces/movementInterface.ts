export interface Movimiento {
  AccountCode: string;
  Sequence: number;
  AccountName: string;
  Reference: string;
  DueDate: string;
  Memo: string;
  DebitAmount: number;
  CreditAmount: number;
  BankMatch: number;
  DataSource: string;
  UserSignature: number;
  ExternalCode: string | null;
  CardCode: string | null;
  CardName: string | null;
  StatementNumber: string | null;
  InvoiceNumber: string;
  PaymentCreated: string;
  VisualOrder: number;
  DocNumberType: string;
  PaymentReference: string | null;
  InvoiceNumberEx: string;
  BICSwiftCode: string | null;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    'odata.metadata': string;
    value: Movimiento[];
  };
  errors?: string[];
}

export interface GetMovementsParams {
  accountCode: string;
  cardNumber: string;
  startDate: Date;
  endDate: Date;
}
