import { useState, useCallback } from 'react';
import type { CardAssignment } from '../interfaces/card-assignment';
import type {
  CardReassignment,
  ReassignmentControlRow,
  ReassignmentFileName,
} from '../interfaces/card-reassignment';
import { format } from 'date-fns';
import { useDailyConsecutive } from './use-daily-consecutive';
import { updateCardAndExpense } from '@/services/accountingService';

export interface ReassignmentDialogData {
  groupNumber: string;
  clientNumber: string;
}

export function useCardReassignment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<ReassignmentDialogData>({
    groupNumber: '',
    clientNumber: '',
  });
  const { consecutive, incrementConsecutive } = useDailyConsecutive();

  const generateFileName = useCallback(
    (groupNumber: string): string => {
      const today = new Date();
      const fileNameData: ReassignmentFileName = {
        type: 'R',
        month: format(today, 'MM'),
        day: format(today, 'dd'),
        consecutive,
        groupNumber: groupNumber.padStart(9, '0'),
        extension: '.csv',
      };

      return `${fileNameData.type}${fileNameData.month}${fileNameData.day}${fileNameData.consecutive}${fileNameData.groupNumber}${fileNameData.extension}`;
    },
    [consecutive],
  );

  const formatDate = useCallback((date: string | undefined): string => {
    if (!date) return '';
    try {
      return format(new Date(date), 'yyyyMMdd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }, []);

  const prepareReassignmentData = useCallback(
    (
      expense: CardAssignment,
      sign: '+' | '-',
      adjustAmount: number,
    ): CardReassignment => {
      const cardNumber = expense.cardNumber || '';

      return {
        cardNumber: cardNumber.replace(/[^\d]/g, ''),
        description: (expense.description || expense.travelReason || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
        sign: sign,
        amount: adjustAmount,
        startDate: formatDate(new Date().toISOString()),
        endDate: formatDate(expense.endDate || expense.returnDate),
      };
    },
    [formatDate],
  );

  const generateControlRow = useCallback(
    (
      data: CardReassignment[],
      clientNumber: string,
      groupNumber: string,
    ): ReassignmentControlRow => {
      return {
        clientNumber: clientNumber.padStart(10, '0'),
        groupNumber: groupNumber,
        sendDate: format(new Date(), 'yyyyMMdd'),
        totalAmount: data.reduce((sum, item) => sum + item.amount, 0),
        recordCount: data.length,
      };
    },
    [],
  );

  const generateCSV = useCallback(
    (data: CardReassignment[], controlRow: ReassignmentControlRow): string => {
      const headers = [
        'Numero de tarjeta',
        'Descripcion',
        'Signo',
        'Monto',
        'Fecha de Inicio',
        'Fecha de Fin',
        'Cambio de Estatus',
      ].join(',');

      const rows = data.map(row =>
        [
          row.cardNumber.replace(/\s/g, ''),
          row.description.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
          row.sign,
          row.amount,
          row.startDate,
          row.endDate,
          '',
        ].join(','),
      );

      const controlRowStr = [
        controlRow.clientNumber,
        controlRow.groupNumber,
        controlRow.sendDate,
        controlRow.totalAmount,
        controlRow.recordCount,
        '',
        '',
      ].join(',');

      return `${headers}\n${rows.join('\n')}\n${controlRowStr}`;
    },
    [],
  );

  const handleDialogSubmit = useCallback(
    async (expenses: CardAssignment[]) => {
      if (!dialogData.groupNumber || !dialogData.clientNumber) {
        throw new Error('Número de grupo y cliente son requeridos');
      }

      try {
        setIsProcessing(true);

        const reassignmentData = expenses.map(expense =>
          prepareReassignmentData(
            expense,
            expense.sign as '+' | '-',
            expense.amountToAdjust,
          ),
        );

        // Actualizar la base de datos para cada gasto
        await Promise.all(
          expenses.map(async expense => {
            const sign = expense.sign as '+' | '-';
            const amount = expense.amountToAdjust || 0;
            const currentLimit = expense.limit || 0;

            // Calcular el nuevo límite basado en el signo
            const newLimit =
              sign === '+' ? currentLimit + amount : currentLimit - amount;

            // Actualizar la tarjeta y el gasto en la base de datos
            await updateCardAndExpense(
              expense.userId,
              expense.cardNumber,
              newLimit,
              expense.id,
            );
          }),
        );

        const controlRow = generateControlRow(
          reassignmentData,
          dialogData.clientNumber,
          dialogData.groupNumber,
        );
        const csvContent = generateCSV(reassignmentData, controlRow);
        const fileName = generateFileName(dialogData.groupNumber);

        // Crear y descargar el archivo
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Incrementar el consecutivo después de una descarga exitosa
        incrementConsecutive();

        // Cerrar el diálogo
        setIsDialogOpen(false);
        setDialogData({ groupNumber: '', clientNumber: '' });
      } catch (error) {
        console.error('Error al generar el archivo de reasignación:', error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      dialogData,
      generateFileName,
      prepareReassignmentData,
      generateControlRow,
      generateCSV,
      incrementConsecutive,
    ],
  );

  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setDialogData({ groupNumber: '', clientNumber: '' });
  }, []);

  const updateDialogData = useCallback(
    (data: Partial<ReassignmentDialogData>) => {
      setDialogData(prev => ({ ...prev, ...data }));
    },
    [],
  );

  return {
    isProcessing,
    isDialogOpen,
    dialogData,
    openDialog,
    closeDialog,
    updateDialogData,
    handleDialogSubmit,
  };
}
