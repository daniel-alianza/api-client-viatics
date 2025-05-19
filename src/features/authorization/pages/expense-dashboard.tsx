import { useState } from 'react';
import { ExpenseTable } from '@/features/authorization/components/expense-table';
import { ExpenseFilter } from '@/features/authorization/components/expense-filter';
import { ExpenseSearch } from '@/features/authorization/components/expense-search';
import { ExpenseProvider } from '@/features/authorization/context/expense-context';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ExpenseDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  return (
    <ExpenseProvider>
      <div className='flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100'>
        <header className='relative z-10 px-8 py-6 flex justify-between items-center bg-white shadow-sm'>
          <div className='flex items-center'>
            <div
              className='relative w-12 h-12 cursor-pointer group'
              onClick={() => navigate('/dashboard')}
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <ArrowLeft
                  className='h-8 w-8 text-[#02082C] transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1'
                  strokeWidth={2}
                />
              </div>
            </div>
            <h1 className='ml-3 text-2xl font-bold text-[#02082C]'>
              Portal Grupo FG{' '}
            </h1>
          </div>
        </header>
        <main className='flex-1 p-6'>
          <div className='container mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='mb-8 rounded-lg bg-gradient-to-r from-[#F34602] to-[#F34602]/80 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300'
            >
              <h2 className='mb-4 text-2xl font-bold text-white'>
                Travel Expense Requests
              </h2>
              <div className='grid gap-4 md:grid-cols-2'>
                <ExpenseSearch onSearch={setSearchQuery} />
                <ExpenseFilter onFilterChange={setStatusFilter} />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ExpenseTable
                searchQuery={searchQuery}
                statusFilter={statusFilter}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </ExpenseProvider>
  );
}
