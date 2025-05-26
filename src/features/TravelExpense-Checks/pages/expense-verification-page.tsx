import React from 'react';
import { ExpenseProvider } from '@/features/TravelExpense-Checks/context/expense-context';
import { useExpense } from '@/features/TravelExpense-Checks/context/expense-context';
import Navbar from '@/features/collaborators-w-card/components/navbar';

const ExpenseVerificationTable: React.FC = () => {
  const { pendingExpenses, error } = useExpense();

  if (error) {
    return <div className='text-center text-red-500 py-8'>{error}</div>;
  }

  if (!pendingExpenses || pendingExpenses.length === 0) {
    return (
      <div className='text-center text-[#F34602] py-8 font-semibold text-lg'>
        Aún no hay comprobaciones por aprobar
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-xl shadow-lg bg-white p-4'>
      <table className='min-w-full divide-y divide-[#F34602] rounded-xl overflow-hidden'>
        <thead className='bg-gradient-to-r from-[#F34602] to-[#ff7e29] text-white'>
          <tr>
            <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-tl-xl'>
              ID
            </th>
            <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider'>
              Descripción
            </th>
            <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider'>
              Fecha
            </th>
            <th className='px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-tr-xl'>
              Monto
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {pendingExpenses.map((expense, idx) => (
            <tr
              key={expense.id}
              className={`transition-colors ${
                idx % 2 === 0 ? 'bg-[#FFF6F2]' : 'bg-white'
              } hover:bg-[#F34602]/10`}
            >
              <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-[#02082C]'>
                {expense.id}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                {expense.description}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                {expense.date}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-[#F34602]'>
                ${expense.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ExpenseVerificationPageContent: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <main className='flex-grow flex items-center justify-center'>
        <div className='container mx-auto px-4 py-10 max-w-3xl'>
          <ExpenseVerificationTable />
        </div>
      </main>
    </div>
  );
};

export const ExpenseVerificationPage: React.FC = () => {
  return (
    <ExpenseProvider>
      <ExpenseVerificationPageContent />
    </ExpenseProvider>
  );
};
