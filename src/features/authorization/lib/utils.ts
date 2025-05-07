import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  amount: number | string | undefined | null,
): string => {
  if (amount === undefined || amount === null) return '$0.00';

  // Convertir a número si es string
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  // Verificar si es un número válido
  if (isNaN(numericAmount)) return '$0.00';

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(numericAmount);
};

export const formatDate = (
  dateString: string | Date | undefined | null,
): string => {
  if (!dateString) return 'N/A';

  try {
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};
