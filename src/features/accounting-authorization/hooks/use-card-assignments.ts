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
  }>(() => {
    // Inicializar los montos con 0
    const initialAmounts: { [key: number]: number } = {};
    approvedExpenses.forEach(expense => {
      initialAmounts[expense.id] = 0;
    });
    return initialAmounts;
  });

  const [editingSigns, setEditingSigns] = useState<{ [key: number]: string }>(
    () => {
      // Inicializar los signos con '+'
      const initialSigns: { [key: number]: string } = {};
      approvedExpenses.forEach(expense => {
        initialSigns[expense.id] = '+';
      });
      return initialSigns;
    },
  );

  const [cardNumbers, setCardNumbers] = useState<CardNumberCache>({});
  const [cardLimits, setCardLimits] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchCardData = async () => {
      const newCardNumbers: CardNumberCache = {};
      const newCardLimits: { [key: number]: number } = {};

      for (const expense of approvedExpenses) {
        if (!cardNumbers[expense.userId]) {
          const card = await getUserCard(expense.userId);
          if (card) {
            newCardNumbers[expense.userId] = card.cardNumber;
            newCardLimits[expense.userId] = card.limite;
          }
        }
      }

      setCardNumbers(prev => ({ ...prev, ...newCardNumbers }));
      setCardLimits(prev => ({ ...prev, ...newCardLimits }));
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
    // Permitir valores vacíos temporalmente mientras el usuario escribe
    const numericValue = value === '' ? 0 : parseFloat(value);

    // Solo actualizar si es un número válido o un campo vacío
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
