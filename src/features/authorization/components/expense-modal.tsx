import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import { useExpenses } from '@/features/authorization/hooks/use-expenses';
import { containerVariants } from '../variants/animationVariants';
import { ExpenseModalProps } from '../interfaces/expensemodalInterface';
import { useTripDuration } from '../hooks/useTripDuration';
import { ApplicantInfo } from './ApplicantInfo';
import { TripInfo } from './TripInfo';
import { FinancialInfo } from './FinancialInfo';
import { TripPurpose } from './TripPurpose';

export const ExpenseModal = forwardRef<HTMLDivElement, ExpenseModalProps>(
  ({ expenseId, onClose }, ref) => {
    const { getExpenseById } = useExpenses();
    const expense = getExpenseById(expenseId);
    const tripDuration = useTripDuration(
      expense?.departureDate || '',
      expense?.returnDate || '',
    );

    if (!expense) return null;

    return (
      <Dialog open={!!expenseId} onOpenChange={onClose}>
        <DialogContent
          className='max-h-[90vh] overflow-y-auto sm:max-w-[600px] shadow-2xl'
          ref={ref}
        >
          <DialogDescription className='sr-only'>
            Detalles de la solicitud de gastos de viaje
          </DialogDescription>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold text-[#F34602]'>
              Travel Expense Request Details
              <Badge
                className={`ml-2 px-3 py-1 text-white transition-colors ${
                  expense.status === 'Approved'
                    ? 'bg-green-500 hover:bg-green-600'
                    : expense.status === 'Rejected'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {expense.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <motion.div
            className='grid gap-6'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <ApplicantInfo expense={expense} variants={containerVariants} />
            <TripInfo expense={expense} tripDuration={tripDuration} />
            <FinancialInfo expense={expense} />
            <TripPurpose expense={expense} />
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  },
);
