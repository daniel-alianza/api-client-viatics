import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useExpenses } from '@/features/authorization/hooks/use-expenses';
import { formatCurrency, formatDate } from '@/features/authorization/lib/utils';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface ExpenseModalProps {
  expenseId: string;
  onClose: () => void;
}

export const ExpenseModal = forwardRef<HTMLDivElement, ExpenseModalProps>(
  ({ expenseId, onClose }, ref) => {
    const { getExpenseById } = useExpenses();
    const expense = getExpenseById(expenseId);

    if (!expense) return null;

    const tripDuration = Math.ceil(
      (new Date(expense.returnDate).getTime() -
        new Date(expense.departureDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const containerVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.3,
          staggerChildren: 0.1,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
      <Dialog open={!!expenseId} onOpenChange={() => onClose()}>
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
              {expense.status === 'Approved' && (
                <Badge className='ml-2 bg-green-500 hover:bg-green-600 transition-colors text-white px-3 py-1'>
                  Approved
                </Badge>
              )}
              {expense.status === 'Rejected' && (
                <Badge className='ml-2 bg-red-500 hover:bg-red-600 transition-colors text-white px-3 py-1'>
                  Rejected
                </Badge>
              )}
              {expense.status === 'Pending' && (
                <Badge className='ml-2 bg-amber-500 hover:bg-amber-600 transition-colors text-white px-3 py-1'>
                  Pending
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <motion.div
            className='grid gap-6'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* Applicant Information */}
            <motion.div variants={itemVariants}>
              <h3 className='mb-2 text-lg font-semibold text-[#02082C]'>
                Applicant Information
              </h3>
              <motion.div
                className='rounded-md bg-[#02082C]/5 p-4 hover:shadow-md transition-shadow duration-300'
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <p className='text-sm text-gray-500'>Name</p>
                    <p className='font-medium'>{expense.userName}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Company</p>
                    <p className='font-medium'>{expense.company}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Branch</p>
                    <p className='font-medium'>{expense.branch}</p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Area</p>
                    <p className='font-medium'>{expense.area}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Trip Information */}
            <motion.div variants={itemVariants}>
              <h3 className='mb-2 text-lg font-semibold text-[#02082C]'>
                Trip Information
              </h3>
              <motion.div
                className='rounded-md bg-[#02082C]/5 p-4 hover:shadow-md transition-shadow duration-300'
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className='grid grid-cols-3 gap-3'>
                  <div>
                    <p className='text-sm text-gray-500'>Departure Date</p>
                    <p className='font-medium'>
                      {formatDate(expense.departureDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Return Date</p>
                    <p className='font-medium'>
                      {formatDate(expense.returnDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Duration</p>
                    <p className='font-medium'>{tripDuration} days</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Financial Information */}
            <motion.div variants={itemVariants}>
              <h3 className='mb-2 text-lg font-semibold text-[#02082C]'>
                Financial Information
              </h3>
              <motion.div
                className='rounded-md bg-[#02082C]/5 p-4 hover:shadow-md transition-shadow duration-300'
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                {expense.details && expense.details.length > 0 ? (
                  <>
                    <div className='grid grid-cols-2 gap-3'>
                      {expense.details.map((detail, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index, duration: 0.3 }}
                        >
                          <p className='text-sm text-gray-500'>
                            {detail.concept}
                          </p>
                          <p className='font-medium'>
                            {formatCurrency(detail.amount)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    <Separator className='my-3' />
                    <motion.div
                      className='flex justify-between'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <p className='font-semibold'>Total</p>
                      <p className='font-bold text-[#F34602]'>
                        {formatCurrency(expense.totalAmount)}
                      </p>
                    </motion.div>
                  </>
                ) : (
                  <div className='text-center py-4'>
                    <p className='text-gray-500'>
                      No hay detalles financieros disponibles
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Trip Purpose */}
            <motion.div variants={itemVariants}>
              <h3 className='mb-2 text-lg font-semibold text-[#02082C]'>
                Trip Purpose
              </h3>
              <motion.div
                className='rounded-md bg-[#02082C]/5 p-4 hover:shadow-md transition-shadow duration-300'
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className='mb-3'>
                  <p className='text-sm text-gray-500'>Reason for Trip</p>
                  <p className='font-medium'>{expense.reason}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Trip Objectives</p>
                  <p className='font-medium'>{expense.objectives}</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  },
);
