import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/features/authorization/lib/utils';
import { FinancialInfoProps, ExpenseDetail } from '../interfaces/expense';

export const FinancialInfo = ({ expense }: FinancialInfoProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }}
  >
    <h3 className='mb-2 text-lg font-semibold text-[#02082C]'>
      Financial Information
    </h3>
    <motion.div
      className='rounded-md bg-[#02082C]/5 p-4 hover:shadow-md transition-shadow duration-300'
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {expense.details?.length > 0 ? (
        <>
          <div className='grid grid-cols-2 gap-3'>
            {expense.details.map((detail: ExpenseDetail, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
              >
                <p className='text-sm text-gray-500'>{detail.concept}</p>
                <p className='font-medium'>{formatCurrency(detail.amount)}</p>
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
);
