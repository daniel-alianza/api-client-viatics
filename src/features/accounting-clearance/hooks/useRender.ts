import React from 'react';
import { SelectOption } from '../interfaces/comprobacionestable.Interface';

export const useRender = () => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const renderSelect = (
    value: string,
    onChange: (value: string) => void,
    options: SelectOption[],
    placeholder: string,
  ): React.ReactElement => {
    return React.createElement(
      'select',
      {
        value,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value),
        className:
          'w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
      },
      React.createElement('option', { value: '' }, placeholder),
      options.map((option, index) =>
        React.createElement(
          'option',
          {
            key: `${option.value}-${index}`,
            value: option.value,
          },
          option.label,
        ),
      ),
    );
  };

  const renderXmlInfoRow = (
    label: string,
    value: string | number,
    isAlternate: boolean = false,
  ): React.ReactElement => {
    return React.createElement(
      'tr',
      {
        className: isAlternate ? 'bg-gray-50' : '',
      },
      React.createElement(
        'td',
        {
          className:
            'whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 w-1/3',
        },
        label,
      ),
      React.createElement(
        'td',
        {
          className: 'whitespace-nowrap px-3 py-2 text-sm text-gray-500',
        },
        typeof value === 'number' ? formatCurrency(value) : value,
      ),
    );
  };

  return {
    formatCurrency,
    renderSelect,
    renderXmlInfoRow,
  };
};
