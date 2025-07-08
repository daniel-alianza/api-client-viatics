import React from 'react';
import { useRender } from '../hooks/useRender';
import { useUtils } from '../hooks/useUtils';
import { ComprobacionRowHeaderProps } from '../interfaces/comprobacionestable.Interface';

export const ComprobacionRowHeader: React.FC<
  Omit<ComprobacionRowHeaderProps, 'isOpen'>
> = ({ comprobacion, onToggle }) => {
  const { formatCurrency } = useRender();
  const { formatDate, extractCardNumber } = useUtils();

  return (
    <tr className='hover:bg-gray-50 cursor-pointer' onClick={onToggle}>
      <td className='px-6 py-4 text-sm text-gray-900'>
        {comprobacion.viaticoId}
      </td>
      <td className='px-6 py-4 text-sm text-gray-900'>
        {comprobacion.sequence}
      </td>
      <td className='px-6 py-4 text-sm text-gray-900'>
        {comprobacion.acctName}
      </td>
      <td className='px-1 py-4 text-sm text-gray-900'>
        {formatDate(comprobacion.dueDate)}
      </td>
      <td className='px-6 py-4 text-sm text-gray-900'>
        {extractCardNumber(comprobacion.memo)}
      </td>
      <td className='px-6 py-4 text-sm text-gray-900'>
        {formatCurrency(comprobacion.debitAmount)}
      </td>
      <td className='px-6 py-4 text-sm text-gray-900'>
        <div className='max-w-xs truncate' title={comprobacion.ref}>
          {comprobacion.ref}
        </div>
      </td>
    </tr>
  );
};
