import { motion } from 'framer-motion';
import { formatDate } from '@/features/authorization/lib/utils';
import { TripInfoProps } from '../interfaces/expense';

export const TripInfo = ({ expense, tripDuration }: TripInfoProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }}
  >
    <h3 className='mb-2 text-lg font-semibold text-[#02082C]'>
      Información del viaje
    </h3>
    <motion.div
      className='rounded-md bg-[#02082C]/5 p-4 hover:shadow-md transition-shadow duration-300'
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className='grid grid-cols-3 gap-3'>
        <div>
          <p className='text-sm text-gray-500'>Fecha de salida</p>
          <p className='font-medium'>{formatDate(expense.departureDate)}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Fecha de regreso</p>
          <p className='font-medium'>{formatDate(expense.returnDate)}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Duración</p>
          <p className='font-medium'>{tripDuration} días</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
