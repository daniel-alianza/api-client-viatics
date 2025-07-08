import { ComprobacionRow } from './ComprobacionRow';
import { Comprobacion } from '../interfaces/comprobacionestable.Interface';

interface SelectOption {
  value: string;
  label: string;
}

interface OptionsState {
  categoryOptions: SelectOption[];
  taxIndicatorOptions: SelectOption[];
  distributionRuleOptions: SelectOption[];
}

interface Props {
  comprobaciones: Comprobacion[];
  xmlDataMap: Record<string, any>;
  options: OptionsState;
}

export const ComprobacionesTable = ({
  comprobaciones,
  xmlDataMap,
  options,
}: Props) => {
  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-[#02082C]'>
            <tr>
              {[
                'ID Viático',
                'Movimiento',
                'Banco',
                'Fecha',
                'Número de Tarjeta',
                'Gasto Inicial',
                'Descripción',
              ].map(header => (
                <th
                  key={header}
                  className='px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {comprobaciones.map(comp => (
              <ComprobacionRow
                key={comp.id}
                comprobacion={comp}
                xmlData={xmlDataMap[comp.id]}
                options={options}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
