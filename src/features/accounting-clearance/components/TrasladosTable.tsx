import React from 'react';
import { useRender } from '../hooks/useRender';
import { TrasladosTableProps } from '../interfaces/comprobacionestable.Interface';

export const TrasladosTable: React.FC<TrasladosTableProps> = ({
  conceptos,
  category,
  taxIndicator,
}) => {
  const { formatCurrency } = useRender();

  return (
    <div className='mt-6'>
      <h4 className='text-md font-medium mb-3'>Traslados</h4>
      <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg'>
        <table className='min-w-full divide-y divide-gray-300'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Impuesto
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Impuesto Letra
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Tipo Factor
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Tasa o Cuota
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Importe
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Categoria
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Ind. Imp
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {conceptos.flatMap(
              (concepto: any) =>
                concepto.traslados?.map((traslado: any, index: number) => (
                  <tr key={`${concepto.descripcion}-${index}`}>
                    <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-500'>
                      {traslado.impuesto}
                    </td>
                    <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-500'>
                      IVA
                    </td>
                    <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-500'>
                      {traslado.tipoFactor}
                    </td>
                    <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-500'>
                      {traslado.tasaOCuota}
                    </td>
                    <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-500'>
                      {formatCurrency(traslado.importe)}
                    </td>
                    <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-500'>
                      {category || '-'}
                    </td>
                    <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-500'>
                      {taxIndicator || '-'}
                    </td>
                  </tr>
                )) || [],
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
