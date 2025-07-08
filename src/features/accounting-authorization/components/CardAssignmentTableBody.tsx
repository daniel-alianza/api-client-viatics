import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/features/authorization/lib/utils';

interface CardAssignmentTableBodyProps {
  logic: ReturnType<
    typeof import('../hooks/useCardAssignmentLogic').useCardAssignmentLogic
  >;
}

export function CardAssignmentTableBody({
  logic,
}: CardAssignmentTableBodyProps) {
  return (
    <table className='w-full'>
      <thead>
        <tr className='bg-[#F34602] text-white'>
          <th className='py-3 px-4 text-left'>ID Usuario</th>
          <th className='py-3 px-4 text-left'>Número de Tarjeta</th>
          <th className='py-3 px-4 text-left'>Descripción</th>
          <th className='py-3 px-4 text-left'>Viáticos Solicitados</th>
          <th className='py-3 px-4 text-left'>Límite Actual</th>
          <th className='py-3 px-4 text-left'>Signo</th>
          <th className='py-3 px-4 text-left'>Monto a Ajustar</th>
          <th className='py-3 px-4 text-left'>Fecha de Inicio</th>
          <th className='py-3 px-4 text-left'>Fecha de Fin</th>
          <th className='py-3 px-4 text-left'>Cambio de Estatus</th>
        </tr>
      </thead>
      <tbody>
        {logic.loading ? (
          <tr>
            <td colSpan={10} className='py-8 text-center'>
              Cargando datos...
            </td>
          </tr>
        ) : logic.filteredExpenses.length > 0 ? (
          logic.filteredExpenses.map((expense, index) => (
            <tr
              key={`${expense.id}-${index}`}
              className={`border-b border-gray-200 transition-colors duration-200 ${
                logic.hoveredRow === index
                  ? 'bg-gray-100'
                  : index % 2 === 0
                  ? 'bg-white'
                  : 'bg-gray-50'
              }`}
              onMouseEnter={() => logic.setHoveredRow(index)}
              onMouseLeave={() => logic.setHoveredRow(null)}
            >
              <td className='py-3 px-4'>{expense.userId}</td>
              <td className='py-3 px-4'>{logic.getCardNumber(expense)}</td>
              <td className='py-3 px-4'>
                {expense.description || expense.travelReason || 'N/A'}
              </td>
              <td className='py-3 px-4 font-medium text-[#F34602]'>
                {logic.formatMoney(
                  expense.requestedAmount || expense.totalAmount,
                )}
              </td>
              <td className='py-3 px-4 font-medium text-[#F34602]'>
                {logic.formatMoney(logic.getCardLimit(expense))}
              </td>
              <td className='py-3 px-4'>
                <Select
                  value={logic.editingSigns[expense.id] || '+'}
                  onValueChange={value =>
                    logic.handleSignChange(expense.id, value)
                  }
                >
                  <SelectTrigger className='w-[70px]'>
                    <SelectValue placeholder='+' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='+'>+</SelectItem>
                    <SelectItem value='-'>-</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className='py-3 px-4'>
                <Input
                  type='number'
                  value={logic.editingAmounts[expense.id] || ''}
                  onChange={e =>
                    logic.handleAmountChange(expense.id, e.target.value)
                  }
                  className='w-[100px]'
                  min='0'
                  step='0.01'
                  placeholder='0.00'
                />
              </td>
              <td className='py-3 px-4'>
                {formatDate(
                  expense.startDate || expense.disbursementDate || 'N/A',
                )}
              </td>
              <td className='py-3 px-4'>
                {expense.endDate || expense.returnDate
                  ? formatDate(expense.endDate || expense.returnDate)
                  : '-'}
              </td>
              <td className='py-3 px-4'>
                <Select
                  value={logic.editingStatus[expense.id] || '0'}
                  onValueChange={value =>
                    logic.handleStatusChange(
                      expense.id,
                      value as '0' | '1' | '2' | '3',
                    )
                  }
                >
                  <SelectTrigger className='w-[120px]'>
                    <SelectValue placeholder='Sin cambio' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='0'>Sin cambio</SelectItem>
                    <SelectItem value='1'>Activo</SelectItem>
                    <SelectItem value='2'>Inactivo</SelectItem>
                    <SelectItem value='3'>Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={10} className='py-8 text-center'>
              No hay solicitudes de viáticos aprobadas.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
