import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import type { Company } from '@/interfaces/infoInterface';

export interface CollaboratorRowProps {
  collaborator: Collaborator;
  onEdit: () => void;
  onRefresh: () => void;
  companies?: Company[];
}
