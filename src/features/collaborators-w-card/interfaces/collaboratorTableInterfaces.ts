import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import type { Company } from '@/interfaces/infoInterface';

export interface AssignCardState {
  isAssigning: boolean;
  selectedCollaborator: string;
  cardNumber: string;
  companyId: string;
  isSubmitting: boolean;
  assignCardError: string;
}

export interface AssignCardHandlers {
  handleAssignCard: () => Promise<void>;
  cancelAssign: () => void;
  setCardNumber: (value: string) => void;
  setCompanyId: (value: string) => void;
  setSelectedCollaborator: (value: string) => void;
  setIsAssigning: (value: boolean) => void;
  setAssignCardError: (value: string) => void;
}

export interface CollaboratorTableLogic {
  assignCardState: AssignCardState;
  assignCardHandlers: AssignCardHandlers;
  editingCollaborator: Collaborator | null;
  setEditingCollaborator: (c: Collaborator | null) => void;
  deletingCollaborator: Collaborator | null;
  setDeletingCollaborator: (c: Collaborator | null) => void;
  showDownloadModal: boolean;
  setShowDownloadModal: (value: boolean) => void;
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  companies: Company[];
  filteredCollaborators: Collaborator[];
}
