/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import type {
  CardAssignment,
  CardNumberCache,
} from '@/features/accounting-authorization/interfaces/card-assignment';
import { getUserCard } from '@/services/accountingService';

export function useCardAssignments(approvedExpenses: CardAssignment[]) {
  const [editingAmounts, setEditingAmounts] = useState<{
    [key: number]: number;
  }>({});
  const [editingSigns, setEditingSigns] = useState<{
    [key: number]: string;
  }>({});
  const [cardNumbers, setCardNumbers] = useState<{
    [key: number]: string;
  }>({});
  const [cardLimits, setCardLimits] = useState<{
    [key: number]: number;
  }>({});

  useEffect(() => {
    const fetchCardData = async () => {
      const newCardNumbers: CardNumberCache = {};
      const newCardLimits: { [key: number]: number } = {};
      const newEditingSigns: { [key: number]: string } = {};

      for (const expense of approvedExpenses) {
        if (!cardNumbers[expense.userId]) {
          const card = await getUserCard(expense.userId);
          if (card) {
            newCardNumbers[expense.userId] = card.cardNumber;
            newCardLimits[expense.userId] = card.limite;
          }
        }

        // Inicializar signo por defecto si no existe
        if (!editingSigns[expense.id]) {
          newEditingSigns[expense.id] = '+';
        }
      }

      setCardNumbers(prev => ({ ...prev, ...newCardNumbers }));
      setCardLimits(prev => ({ ...prev, ...newCardLimits }));
      setEditingSigns(prev => ({ ...prev, ...newEditingSigns }));
    };

    if (approvedExpenses.length > 0) {
      fetchCardData();
    }
  }, [approvedExpenses]);

  const getCardNumber = (expense: CardAssignment) => {
    return cardNumbers[expense.userId] || 'N/A';
  };

  const getCardLimit = (expense: CardAssignment) => {
    return cardLimits[expense.userId] || 0;
  };

  const handleAmountChange = (id: number, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);

    if (!isNaN(numericValue)) {
      setEditingAmounts(prev => ({
        ...prev,
        [id]: numericValue,
      }));
    }
  };

  const handleSignChange = (id: number, value: string) => {
    setEditingSigns(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  return {
    editingAmounts,
    editingSigns,
    cardNumbers,
    getCardNumber,
    getCardLimit,
    handleAmountChange,
    handleSignChange,
  };
}
