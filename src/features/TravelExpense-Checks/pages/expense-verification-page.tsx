import type React from 'react';
import { ExpenseForm } from '@/features/TravelExpense-Checks/components/expense-form';
import { ExpenseProvider } from '@/features/TravelExpense-Checks/context/expense-context';
import { ExpenseSelectModal } from '@/features/TravelExpense-Checks/components/expense-select-modal';
import { useExpense } from '@/features/TravelExpense-Checks/context/expense-context';
import { useEffect, useState, useCallback } from 'react';

const ExpenseVerificationContent: React.FC = () => {
  const { loadPendingExpenses } = useExpense();
  const [showSelectModal, setShowSelectModal] = useState(true);

  const handleLoadExpenses = useCallback(async () => {
    await loadPendingExpenses();
  }, [loadPendingExpenses]);

  useEffect(() => {
    handleLoadExpenses();
  }, [handleLoadExpenses]);

  const handleExpenseSelect = (expenseId: string) => {
    // Aquí se cargarían los datos del viático seleccionado
    console.log('Selected expense:', expenseId);
    setShowSelectModal(false);
  };

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <main className='flex-grow'>
        <div className='container mx-auto px-4 py-10'>
          <div className='max-w-4xl mx-auto'>
            <div className='mb-8 text-center'>
              <h1 className='text-3xl md:text-4xl font-bold text-[#02082C]'>
                Travel Expense Verification
              </h1>
              <p className='mt-2 text-gray-600'>
                View your travel expense verification details
              </p>
            </div>

            <ExpenseForm />
          </div>
        </div>
      </main>

      <ExpenseSelectModal
        isOpen={showSelectModal}
        onClose={() => setShowSelectModal(false)}
        onSelect={handleExpenseSelect}
      />
    </div>
  );
};

export const ExpenseVerificationPage: React.FC = () => {
  return (
    <ExpenseProvider>
      <ExpenseVerificationContent />
    </ExpenseProvider>
  );
};
