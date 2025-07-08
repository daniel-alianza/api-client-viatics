import { useState } from 'react';
import type {
  TravelExpenses,
  TravelExpenseFormData,
} from '@/features/request/interfaces/solicitud.types';

export const useTravelExpenseForm = () => {
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [distributionDate, setDistributionDate] = useState<Date | undefined>();
  const [travelReason, setTravelReason] = useState<string>('');
  const [travelObjectives, setTravelObjectives] = useState<string>('');
  const [expenses, setExpenses] = useState<TravelExpenses>({
    transportation: 0,
    tolls: 0,
    lodging: 0,
    food: 0,
    freight: 0,
    tools: 0,
    shipping: 0,
    miscellaneous: 0,
  });

  const setDepartureDateSafe = (date: Date | undefined) => {
    if (!date) {
      setDepartureDate(undefined);
      return;
    }
    try {
      if (!isNaN(date.getTime())) {
        setDepartureDate(date);
      }
    } catch (error) {
      console.error('Error al procesar la fecha de salida:', error);
      setDepartureDate(undefined);
    }
  };

  const setReturnDateSafe = (date: Date | undefined) => {
    if (!date) {
      setReturnDate(undefined);
      return;
    }
    try {
      if (!isNaN(date.getTime())) {
        setReturnDate(date);
      }
    } catch (error) {
      console.error('Error al procesar la fecha de retorno:', error);
      setReturnDate(undefined);
    }
  };

  const setDistributionDateSafe = (date: Date | undefined) => {
    if (!date) {
      setDistributionDate(undefined);
      return;
    }
    try {
      if (!isNaN(date.getTime())) {
        setDistributionDate(date);
      }
    } catch (error) {
      console.error('Error al procesar la fecha de distribución:', error);
      setDistributionDate(undefined);
    }
  };

  const updateExpense = (key: keyof TravelExpenses, value: string) => {
    setExpenses({
      ...expenses,
      [key]: parseFloat(value) || 0,
    });
  };

  const totalExpenses = Object.values(expenses).reduce(
    (sum, val) => sum + val,
    0,
  );

  const getFormData = (): TravelExpenseFormData => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return {
      userId: user.id || '',
      totalAmount: totalExpenses,
      departureDate: departureDate ? new Date(departureDate) : undefined,
      returnDate: returnDate ? new Date(returnDate) : undefined,
      distributionDate: distributionDate
        ? new Date(distributionDate)
        : undefined,
      travelReason,
      travelObjectives,
      expenses: {
        transportation: expenses.transportation || 0,
        tolls: expenses.tolls || 0,
        lodging: expenses.lodging || 0,
        food: expenses.food || 0,
        freight: expenses.freight || 0,
        tools: expenses.tools || 0,
        shipping: expenses.shipping || 0,
        miscellaneous: expenses.miscellaneous || 0,
      },
    };
  };

  const resetForm = () => {
    setDepartureDate(undefined);
    setReturnDate(undefined);
    setDistributionDate(undefined);
    setTravelReason('');
    setTravelObjectives('');
    setExpenses({
      transportation: 0,
      tolls: 0,
      lodging: 0,
      food: 0,
      freight: 0,
      tools: 0,
      shipping: 0,
      miscellaneous: 0,
    });
  };

  return {
    departureDate,
    setDepartureDate,
    setDepartureDateSafe,
    returnDate,
    setReturnDate,
    setReturnDateSafe,
    distributionDate,
    setDistributionDate,
    setDistributionDateSafe,
    travelReason,
    setTravelReason,
    travelObjectives,
    setTravelObjectives,
    expenses,
    updateExpense,
    totalExpenses,
    getFormData,
    resetForm,
    setExpenses,
  };
};
