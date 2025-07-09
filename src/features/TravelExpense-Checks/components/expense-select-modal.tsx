import type React from 'react';
import { motion } from 'framer-motion';
import { SelectField } from '@/components/ui/select-field';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/features/TravelExpense-Checks/context/expense-context';
import type { PendingExpense } from '@/features/TravelExpense-Checks/interfaces/types';

interface ExpenseSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (expenseId: string) => void;
}

export const ExpenseSelectModal: React.FC<ExpenseSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const { pendingExpenses, error } = useExpense();

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className='bg-white rounded-lg p-6 w-full max-w-md mx-4'
      >
        <h2 className='text-2xl font-bold mb-4 text-[#02082C]'>
          Seleccionar Viático
        </h2>

        {error ? (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-red-600'>{error}</p>
          </div>
        ) : (
          <div className='mb-6'>
            <SelectField
              id='expenseSelect'
              label='Viáticos Pendientes'
              options={pendingExpenses.map((expense: PendingExpense) => ({
                value: expense.id,
                label: `${expense.description} - ${expense.date}`,
              }))}
              value=''
              onChange={value => onSelect(value)}
              required
            />
          </div>
        )}

        <div className='flex justify-end gap-4'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          {!error && (
            <Button
              variant='secondary'
              onClick={() => onSelect(pendingExpenses[0]?.id || '')}
              disabled={pendingExpenses.length === 0}
            >
              Continuar
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
