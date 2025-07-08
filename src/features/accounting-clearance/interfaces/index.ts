import { Comprobacion } from '@/interfaces/comprobacionesInterface';

export interface AccountingClearanceState {
  comprobaciones: Comprobacion[];
  isLoading: boolean;
  error: string | null;
}
