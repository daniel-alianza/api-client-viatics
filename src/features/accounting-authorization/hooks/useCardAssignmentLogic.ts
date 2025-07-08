import { useCallback, useEffect, useState } from 'react';
import { useApprovedExpenses } from '@/features/accounting-authorization/hooks/use-approved-expenses';
import { useCardAssignments } from '@/features/accounting-authorization/hooks/use-card-assignments';
import { useCardReassignment } from '@/features/accounting-authorization/hooks/use-card-reassignment';
import { getCompanies } from '@/services/info-moduleService';
import { Company } from '@/interfaces/infoInterface';
import { EditingStatus } from '../interfaces/cardAssignmentInterfaces';
import { toast } from 'sonner';

export function useCardAssignmentLogic() {
  const { approvedExpenses, loading, error } = useApprovedExpenses();
  const {
    editingAmounts,
    editingSigns,
    getCardNumber,
    getCardLimit,
    handleAmountChange,
    handleSignChange,
  } = useCardAssignments(approvedExpenses);

  const [editingStatus, setEditingStatus] = useState<EditingStatus>({});
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    isProcessing,
    isDialogOpen,
    dialogData,
    openDialog,
    closeDialog,
    updateDialogData,
    handleDialogSubmit,
  } = useCardReassignment();

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]));
  }, []);

  const handleStatusChange = (id: number, value: '0' | '1' | '2' | '3') => {
    setEditingStatus(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReassignment = useCallback(() => {
    // console.log('editingAmounts:', editingAmounts);
    // console.log('editingSigns:', editingSigns);

    const invalidRecords = approvedExpenses.filter(expense => {
      const amount = editingAmounts[expense.id] || 0;
      const sign = editingSigns[expense.id] || '+';
      console.log(`Expense ${expense.id}: amount=${amount}, sign=${sign}`);
      return !(amount > 0 && (sign === '+' || sign === '-'));
    });

    if (invalidRecords.length > 0) {
      const invalidIds = invalidRecords.map(expense => expense.id).join(', ');
      toast.error(
        `Los siguientes registros necesitan un monto mayor a 0: ${invalidIds}`,
      );
      return;
    }

    openDialog();
  }, [approvedExpenses, editingSigns, editingAmounts, openDialog]);

  const handleDialogConfirm = useCallback(async () => {
    try {
      const updatedExpenses = approvedExpenses.map(expense => ({
        ...expense,
        cardNumber: getCardNumber(expense),
        sign: editingSigns[expense.id] || '+',
        amountToAdjust: editingAmounts[expense.id] || 0,
        status: 'DISPERSADA' as const,
        statusChange: editingStatus[expense.id] || '0',
      }));

      await handleDialogSubmit(updatedExpenses);
      setSuccessMessage('Reasignación procesada correctamente');

      // Limpiar el mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error al procesar la reasignación:', error);
      toast.error('Error al procesar la reasignación');
    }
  }, [
    approvedExpenses,
    editingSigns,
    editingAmounts,
    editingStatus,
    handleDialogSubmit,
    getCardNumber,
  ]);

  const filteredExpenses =
    selectedCompany !== 'all'
      ? approvedExpenses.filter(e =>
          [e.companyId, e.company?.id, e.user?.companyId]
            .map(id => id?.toString())
            .includes(selectedCompany),
        )
      : approvedExpenses;

  const formatMoney = (amount?: number) => {
    if (!amount) return '$0.00';
    return `$${amount.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return {
    approvedExpenses,
    loading,
    error,
    editingAmounts,
    editingSigns,
    getCardNumber,
    getCardLimit,
    handleAmountChange,
    handleSignChange,
    editingStatus,
    hoveredRow,
    companies,
    selectedCompany,
    isProcessing,
    isDialogOpen,
    dialogData,
    openDialog,
    closeDialog,
    updateDialogData,
    handleDialogConfirm,
    handleReassignment,
    setHoveredRow,
    setSelectedCompany,
    handleStatusChange,
    filteredExpenses,
    formatMoney,
    successMessage,
  };
}
