export interface Viatico {
  id: string;
  requestor: string;
  company: string;
  reason: string;
  totalAmount: number;
  disbursementDate?: string;
  status: string;
  departureDate?: string;
  returnDate?: string;
  userId: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  cardNumber: string;
}

export interface Comprobacion {
  id: string;
  viaticoId: string;
  company: string;
  acctName: string;
  sequence: string;
  dueDate: string;
  memo: string;
  debitAmount: number;
  ref: string;
  categoria: string;
  indicadorImpuesto: string;
  normaReparto: string;
  status: string;
  type?: string;
  files?: any[];
  responsable?: string;
  motivo?: string;
  descripcion?: string;
  importe?: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Props {
  comprobacion: Comprobacion;
}

// Interfaces para los nuevos componentes
export interface XmlInfoTableProps {
  xmlData: any;
}

export interface ConceptosTableProps {
  conceptos: any[];
  category: string;
  taxIndicator: string;
}

export interface TrasladosTableProps {
  conceptos: any[];
  category: string;
  taxIndicator: string;
}

export interface CategorizationControlsProps {
  category: string;
  setCategory: (value: string) => void;
  taxIndicator: string;
  setTaxIndicator: (value: string) => void;
  distributionRule: string;
  setDistributionRule: (value: string) => void;
  categoryOptions: SelectOption[];
  taxIndicatorOptions: SelectOption[];
  distributionRuleOptions: SelectOption[];
}

export interface ActionButtonsProps {
  onDecline: () => void;
  onSend: () => void;
}

// Nuevas interfaces para componentes adicionales
export interface ComprobacionRowHeaderProps {
  comprobacion: Comprobacion;
  onToggle: () => void;
}

export interface CommentFieldProps {
  comment: string;
  setComment: (value: string) => void;
}

export interface XmlContentProps {
  xmlData: any;
  isLoadingXml: boolean;
  category: string;
  taxIndicator: string;
  comprobacionType?: string;
  responsable?: string;
  motivo?: string;
  descripcion?: string;
  importe?: number;
  pdfFile?: any;
  onPreviewPdf?: (file: any) => void;
}

export interface ComprobacionRowDetailsProps {
  category: string;
  setCategory: (value: string) => void;
  taxIndicator: string;
  setTaxIndicator: (value: string) => void;
  distributionRule: string;
  setDistributionRule: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  categoryOptions: SelectOption[];
  taxIndicatorOptions: SelectOption[];
  distributionRuleOptions: SelectOption[];
  xmlData: any;
  isLoadingXml: boolean;
  onDecline: () => void;
  onSend: () => void;
  comprobacionType?: string;
  responsable?: string;
  motivo?: string;
  descripcion?: string;
  importe?: number;
  pdfFile?: any;
  onPreviewPdf?: (file: any) => void;
}
