import type { ReassignmentDialogData } from '../hooks/use-card-reassignment';

export interface ReassignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  data: ReassignmentDialogData;
  onDataChange: (data: Partial<ReassignmentDialogData>) => void;
  isProcessing: boolean;
  selectedCompany: string;
  companies: { id: string; name: string }[];
}
