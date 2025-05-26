import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Movimiento } from '../../../services/movimientosService';
import ComprobacionModal from './ComprobacionModal';
import { motion } from 'framer-motion';

interface MovimientosAccordionProps {
  movimientos: Movimiento[];
  isOpen: boolean;
  onToggle: () => void;
  noSolicitud: string;
  sociedad: string;
}

export default function MovimientosAccordion({
  movimientos,
  isOpen,
  onToggle,
  noSolicitud,
  sociedad,
}: MovimientosAccordionProps) {
  const [modalOpenIndex, setModalOpenIndex] = useState<number | null>(null);

  const handleComprobacion = () => {
    // Por ahora solo cerramos el modal
    setModalOpenIndex(null);
  };

  return (
    <div className='mt-4'>
      <button
        onClick={onToggle}
        className='w-full flex items-center justify-between p-4 bg-[#02082C]/5 rounded-lg hover:bg-[#02082C]/10 transition-colors'
      >
        <span className='font-medium text-[#02082C]'>Movimientos</span>
        {isOpen ? (
          <ChevronUp className='h-5 w-5 text-[#02082C]' />
        ) : (
          <ChevronDown className='h-5 w-5 text-[#02082C]' />
        )}
      </button>

      {isOpen && (
        <div className='mt-2 bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-[#02082C] text-white'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                    Movimiento
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                    Fecha
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                    Descripcion
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                    Tarjeta
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                    Gasto
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'></th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((movimiento, idx) => (
                  <tr
                    key={movimiento.Sequence}
                    className='hover:bg-[#F34602]/5'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C] font-bold'>
                      {movimiento.Sequence}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {new Date(movimiento.DueDate).toISOString().split('T')[0]}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {movimiento.Ref}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                      {movimiento.Memo}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#F34602] font-medium'>
                      {Number(movimiento.DebAmount).toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='group relative px-4 py-2 bg-[#02082C] text-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#F34602] hover:shadow-lg cursor-pointer'
                        onClick={() => setModalOpenIndex(idx)}
                        type='button'
                      >
                        <span className='relative z-10 flex items-center gap-2'>
                          <FileText className='w-4 h-4 transition-transform duration-300 group-hover:rotate-12' />
                          Agregar comprobación
                        </span>
                        <motion.div
                          className='absolute inset-0 bg-[#F34602]'
                          initial={{ x: '-100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                      <ComprobacionModal
                        open={modalOpenIndex === idx}
                        onClose={() => setModalOpenIndex(null)}
                        onSubmit={handleComprobacion}
                        movimiento={{
                          ...movimiento,
                          Sequence: movimiento.Sequence.toString(),
                          DueDate: new Date(movimiento.DueDate).toISOString(),
                        }}
                        noSolicitud={noSolicitud}
                        sociedad={sociedad}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
