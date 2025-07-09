import React from 'react';
import { useRender } from '../hooks/useRender';
import { CategorizationControlsProps } from '../interfaces/comprobacionestable.Interface';

export const CategorizationControls: React.FC<CategorizationControlsProps> = ({
  category,
  setCategory,
  taxIndicator,
  setTaxIndicator,
  distributionRule,
  setDistributionRule,
  categoryOptions,
  taxIndicatorOptions,
  distributionRuleOptions,
}) => {
  const { renderSelect } = useRender();

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Categoría
        </label>
        {renderSelect(
          category,
          setCategory,
          categoryOptions,
          'Seleccione categoría',
        )}
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Indicador de Impuestos
        </label>
        {renderSelect(
          taxIndicator,
          setTaxIndicator,
          taxIndicatorOptions,
          'Seleccione indicador de impuestos',
        )}
      </div>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Norma de Reparto
        </label>
        {renderSelect(
          distributionRule,
          setDistributionRule,
          distributionRuleOptions,
          'Seleccione norma de reparto',
        )}
      </div>
    </div>
  );
};
