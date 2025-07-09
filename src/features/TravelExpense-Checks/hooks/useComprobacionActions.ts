import { useState } from 'react';
import type { Document } from '../interfaces/types';

interface UseComprobacionActionsReturn {
  // Estados del diálogo
  selectedComprobacion: number | null;
  isDialogOpen: boolean;
  isRejecting: boolean;
  comment: string;
  documents: Document[];

  // Funciones de manejo
  handleViewDocuments: (
    comprobacionId: number,
    getComprobacionDocuments: (id: number) => Promise<Document[]>,
  ) => Promise<void>;
  handleApprove: (
    comprobacionId: number,
    approveComprobacion: (id: number, comment?: string) => Promise<void>,
    loadComprobaciones: () => Promise<void>,
  ) => Promise<void>;
  handleReject: (
    comprobacionId: number,
    rejectComprobacion: (id: number, comment: string) => Promise<void>,
    loadComprobaciones: () => Promise<void>,
  ) => Promise<void>;
  closeDialog: () => void;
  setComment: (comment: string) => void;
  setIsRejecting: (isRejecting: boolean) => void;
}

export const useComprobacionActions = (): UseComprobacionActionsReturn => {
  const [selectedComprobacion, setSelectedComprobacion] = useState<
    number | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleViewDocuments = async (
    comprobacionId: number,
    getComprobacionDocuments: (id: number) => Promise<Document[]>,
  ) => {
    try {
      const docs = await getComprobacionDocuments(comprobacionId);
      setDocuments(docs);
      setSelectedComprobacion(comprobacionId);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    }
  };

  const handleApprove = async (
    comprobacionId: number,
    approveComprobacion: (id: number, comment?: string) => Promise<void>,
    loadComprobaciones: () => Promise<void>,
  ) => {
    try {
      await approveComprobacion(comprobacionId, comment);
      setIsDialogOpen(false);
      setComment('');
      // Recargar las comprobaciones después de aprobar
      await loadComprobaciones();
    } catch (error) {
      console.error('Error al aprobar:', error);
    }
  };

  const handleReject = async (
    comprobacionId: number,
    rejectComprobacion: (id: number, comment: string) => Promise<void>,
    loadComprobaciones: () => Promise<void>,
  ) => {
    try {
      await rejectComprobacion(comprobacionId, comment);
      setIsDialogOpen(false);
      setComment('');
      setIsRejecting(false);
      // Recargar las comprobaciones después de rechazar
      await loadComprobaciones();
    } catch (error) {
      console.error('Error al rechazar:', error);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setComment('');
    setIsRejecting(false);
    setSelectedComprobacion(null);
    setDocuments([]);
  };

  return {
    selectedComprobacion,
    isDialogOpen,
    isRejecting,
    comment,
    documents,
    handleViewDocuments,
    handleApprove,
    handleReject,
    closeDialog,
    setComment,
    setIsRejecting,
  };
};
