import { useState } from 'react';
import {
  TravelExpenses,
  TravelExpenseFormData,
} from '@/features/request/interfaces/solicitud.types';

export function useTravelExpenseForm() {
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
    const validateDate = (date: Date | undefined) => {
      try {
        if (!date) return undefined;
        const timestamp = date.getTime();
        if (isNaN(timestamp)) return undefined;
        return date.toISOString();
      } catch (error) {
        console.error('Error al validar la fecha:', error);
        return undefined;
      }
    };

    return {
      departureDate: validateDate(departureDate),
      returnDate: validateDate(returnDate),
      distributionDate: validateDate(distributionDate),
      travelReason: travelReason.trim(),
      travelObjectives: (travelObjectives || '').trim(),
      expenses: Object.fromEntries(
        Object.entries(expenses).map(([key, value]) => [key, Number(value) || 0])
      ),
    };
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
  };
}
