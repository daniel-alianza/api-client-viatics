import { motion } from 'framer-motion';
import { ApplicantInfoProps } from '../interfaces/expense';

export const ApplicantInfo = ({ expense, variants }: ApplicantInfoProps) => (
  <motion.div variants={variants}>
    <h3 className='mb-2 text-lg font-semibold text-[#02082C]'>
      Información del solicitante
    </h3>
    <motion.div
      className='rounded-md bg-[#02082C]/5 p-4 hover:shadow-md transition-shadow duration-300'
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <p className='text-sm text-gray-500'>Nombre</p>
          <p className='font-medium'>{expense.userName}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Compañía</p>
          <p className='font-medium'>{expense.company}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Sucursal</p>
          <p className='font-medium'>{expense.branch}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Área</p>
          <p className='font-medium'>{expense.area}</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
