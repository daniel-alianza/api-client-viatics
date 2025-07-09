import { motion } from 'framer-motion';
import { TripPurposeProps } from '../interfaces/expense';

export const TripPurpose = ({ expense }: TripPurposeProps) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }}
  >
    <h3 className='mb-2 text-lg font-semibold text-[#02082C]'>
      Propósito del viaje
    </h3>
    <motion.div
      className='rounded-md bg-[#02082C]/5 p-4 hover:shadow-md transition-shadow duration-300'
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className='mb-3'>
        <p className='text-sm text-gray-500'>Motivo del viaje</p>
        <p className='font-medium'>{expense.reason}</p>
      </div>
      <div>
        <p className='text-sm text-gray-500'>Objetivos del viaje</p>
        <p className='font-medium'>{expense.objectives}</p>
      </div>
    </motion.div>
  </motion.div>
);
