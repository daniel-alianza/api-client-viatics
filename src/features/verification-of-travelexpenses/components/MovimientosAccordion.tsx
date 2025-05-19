import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Movimiento } from '../../../services/movimientosService';
import React from 'react';
import ComprobacionModal from './ComprobacionModal';

interface MovimientosAccordionProps {
  movimientos: Movimiento[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function MovimientosAccordion({
  movimientos,
  isOpen,
  onToggle,
}: MovimientosAccordionProps) {
  const [modalOpenIndex, setModalOpenIndex] = useState<number | null>(null);

  const handleComprobacion = (file: File, tipo: string) => {
    // Aquí puedes manejar el archivo y el tipo
    // Por ahora solo cerramos el modal
    setModalOpenIndex(null);
  };

  return (
    <div className='mt-4'>
      <button
        onClick={onToggle}
        className='w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
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
              <thead className='bg-[#287492] text-white'>
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
              <tbody className='bg-white divide-y divide-gray-200'>
                {movimientos.map((movimiento, idx) => (
                  <tr
                    key={movimiento.Sequence}
                    className='hover:bg-[#F34602]/5'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#287492] font-bold'>
                      {movimiento.Sequence}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#287492]'>
                      {new Date(movimiento.DueDate).toISOString().split('T')[0]}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#287492]'>
                      {movimiento.Ref}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#287492]'>
                      {movimiento.Memo}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-[#287492] font-bold'>
                      {Number(movimiento.DebAmount).toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <button
                        className='px-3 py-1 bg-[#287492] text-white rounded hover:bg-[#1d4e6c] transition'
                        onClick={() => setModalOpenIndex(idx)}
                        type='button'
                      >
                        Agregar comprobación
                      </button>
                      <ComprobacionModal
                        open={modalOpenIndex === idx}
                        onClose={() => setModalOpenIndex(null)}
                        onSubmit={handleComprobacion}
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
