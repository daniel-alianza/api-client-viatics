import React from 'react';
import { useRender } from '../hooks/useRender';
import { ConceptosTableProps } from '../interfaces/comprobacionestable.Interface';

export const ConceptosTable: React.FC<ConceptosTableProps> = ({
  conceptos,
  category,
  taxIndicator,
}) => {
  const { formatCurrency } = useRender();

  return (
    <div className='mt-6'>
      <h4 className='text-md font-medium mb-3'>Conceptos</h4>
      <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg'>
        <table className='min-w-full divide-y divide-gray-300 table-fixed'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3'>
                Descripción
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Cantidad
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Importe
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                IVA
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Base
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Impuesto
              </th>
              <th className='py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Impuesto Letra
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
            {conceptos.map((concepto: any, index: number) => (
              <tr key={index}>
                <td className='px-3 py-2 text-sm text-gray-500 break-words'>
                  {concepto.descripcion}
                </td>
                <td className='px-3 py-2 text-sm text-gray-500'>
                  {concepto.cantidad}
                </td>
                <td className='px-3 py-2 text-sm text-gray-500'>
                  {formatCurrency(concepto.importe)}
                </td>
                <td className='px-3 py-2 text-sm text-gray-500'>
                  {concepto.traslados?.[0]?.importe
                    ? formatCurrency(concepto.traslados[0].importe)
                    : '0.00'}
                </td>
                <td className='px-3 py-2 text-sm text-gray-500'>
                  {concepto.traslados?.[0]?.base
                    ? formatCurrency(concepto.traslados[0].base)
                    : '0.00'}
                </td>
                <td className='px-3 py-2 text-sm text-gray-500'>
                  {concepto.traslados?.[0]?.impuesto || '-'}
                </td>
                <td className='px-3 py-2 text-sm text-gray-500'>IVA</td>
                <td className='px-3 py-2 text-sm text-gray-500'>
                  {category || '-'}
                </td>
                <td className='px-3 py-2 text-sm text-gray-500'>
                  {taxIndicator || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
