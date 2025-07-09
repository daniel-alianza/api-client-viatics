import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';
import {
  Collaborator,
  Viatico,
} from '../interfaces/comprobacionestable.Interface';

interface Props {
  viatico: Viatico;
  collaborator: Collaborator | null;
  onClose: () => void;
}

export const ViaticoModal = ({ viatico, collaborator, onClose }: Props) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className='bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative border border-gray-100'
    >
      <button
        className='absolute top-4 right-4 text-gray-400 hover:text-[#F34602]'
        onClick={onClose}
        title='Cerrar'
      >
        <X className='w-6 h-6' />
      </button>
      <h3 className='text-2xl font-semibold mb-6 text-[#02082C] border-b border-gray-100 pb-4'>
        Información del Viático
      </h3>
      <div className='grid grid-cols-2 gap-4 text-sm text-gray-700'>
        <div className='p-3 bg-gray-50 rounded-lg'>
          <strong className='text-[#02082C]'>Fecha de Dispersión:</strong>{' '}
          {viatico.disbursementDate
            ? format(new Date(viatico.disbursementDate), 'PPP', { locale: es })
            : '-'}
        </div>
        <div className='p-3 bg-gray-50 rounded-lg'>
          <strong className='text-[#02082C]'>Número de Tarjeta:</strong>{' '}
          {collaborator?.cardNumber || '-'}
        </div>
        <div className='p-3 bg-gray-50 rounded-lg'>
          <strong className='text-[#02082C]'>Fecha de Salida:</strong>{' '}
          {viatico.departureDate
            ? format(new Date(viatico.departureDate), 'PPP', { locale: es })
            : '-'}
        </div>
        <div className='p-3 bg-gray-50 rounded-lg'>
          <strong className='text-[#02082C]'>Fecha de Regreso:</strong>{' '}
          {viatico.returnDate
            ? format(new Date(viatico.returnDate), 'PPP', { locale: es })
            : '-'}
        </div>
      </div>
    </motion.div>
  </div>
);
