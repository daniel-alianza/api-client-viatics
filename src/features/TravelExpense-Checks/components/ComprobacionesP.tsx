import React from 'react';
import { Button } from '@/components/ui/button';
import type { Comprobacion } from '../interfaces/types';

interface ComprobacionesPProps {
  comprobaciones: Comprobacion[];
  count: number;
  onViewDocuments: (comprobacionId: number) => void;
}

export const ComprobacionesP: React.FC<ComprobacionesPProps> = ({
  comprobaciones,
  count,
  onViewDocuments,
}) => {
  return (
    <div className='mb-8'>
      <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
        <div className='px-6 py-4 bg-gradient-to-r from-yellow-600 to-yellow-400'>
          <h2 className='text-xl font-bold text-white flex items-center'>
            <span className='mr-2'>⏳</span>
            Comprobaciones Pendientes
            <span className='ml-3 text-sm font-normal bg-white/20 px-3 py-1 rounded-full'>
              {count}
            </span>
          </h2>
        </div>
        {!comprobaciones || comprobaciones.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-yellow-500 text-6xl mb-4'>📋</div>
            <p className='text-yellow-600 font-semibold text-lg'>
              No hay comprobaciones pendientes
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Viático ID
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Memo
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Fecha Vencimiento
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Estado
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Tipo
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Monto
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {comprobaciones.map(comprobacion => (
                  <tr
                    key={comprobacion.id}
                    className='hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      #{comprobacion.id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {comprobacion.viaticoId}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {comprobacion.memo}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(comprobacion.dueDate).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          comprobacion.status === 'comprobada' ||
                          comprobacion.status === 'aprobada'
                            ? 'bg-green-100 text-green-800'
                            : comprobacion.status === 'rechazada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {comprobacion.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {comprobacion.comprobanteType}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#F34602]'>
                      ${comprobacion.debitAmount.toFixed(2) || '0.00'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <div className='flex space-x-2'>
                        <Button
                          onClick={() => onViewDocuments(comprobacion.id)}
                          className='bg-blue-500 hover:bg-blue-600 text-white'
                        >
                          Ver Documentos
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
