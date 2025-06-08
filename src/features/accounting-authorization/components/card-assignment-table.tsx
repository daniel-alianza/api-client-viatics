import { useState, useCallback, useEffect } from 'react';
import { useApprovedExpenses } from '@/features/accounting-authorization/hooks/use-approved-expenses';
import { useCardAssignments } from '@/features/accounting-authorization/hooks/use-card-assignments';
import { useCardReassignment } from '@/features/accounting-authorization/hooks/use-card-reassignment';
import { AlertCircle, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/features/authorization/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ReassignmentDialog } from './reassignment-dialog';
import { getCompanies, Company } from '@/services/info-moduleService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function CardAssignmentTable() {
  const { approvedExpenses, loading, error } = useApprovedExpenses();
  const {
    editingAmounts,
    editingSigns,
    getCardNumber,
    getCardLimit,
    handleAmountChange,
    handleSignChange,
  } = useCardAssignments(approvedExpenses);
  const [editingStatus, setEditingStatus] = useState<{
    [key: number]: '0' | '1' | '2' | '3';
  }>({});
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const {
    isProcessing,
    isDialogOpen,
    dialogData,
    openDialog,
    closeDialog,
    updateDialogData,
    handleDialogSubmit,
  } = useCardReassignment();

  useEffect(() => {
    getCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]));
  }, []);

  const handleStatusChange = (id: number, value: '0' | '1' | '2' | '3') => {
    setEditingStatus(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReassignment = useCallback(() => {
    // Validar que todos los registros tengan signo y monto
    const invalidRecords = approvedExpenses.some(expense => {
      const amount = editingAmounts[expense.id];
      const sign = editingSigns[expense.id];
      // Verificar que el monto exista y sea mayor que 0
      const isAmountValid =
        amount !== undefined && amount !== null && amount > 0;
      // Verificar que el signo exista y sea válido
      const isSignValid = sign === '+' || sign === '-';
      return !isAmountValid || !isSignValid;
    });

    if (invalidRecords) {
      alert(
        'Todos los registros deben tener un signo válido (+/-) y un monto mayor a 0',
      );
      return;
    }

    // Abrir el diálogo para ingresar número de grupo y cliente
    openDialog();
  }, [approvedExpenses, editingSigns, editingAmounts, openDialog]);

  const handleDialogConfirm = useCallback(async () => {
    try {
      // Actualizar los montos y generar el archivo
      const updatedExpenses = approvedExpenses.map(expense => ({
        ...expense,
        cardNumber: getCardNumber(expense),
        sign: editingSigns[expense.id] || '+',
        amountToAdjust: editingAmounts[expense.id] || 0,
        status: 'DISPERSADA' as const,
        statusChange: editingStatus[expense.id] || '0',
      }));

      await handleDialogSubmit(updatedExpenses);
    } catch (error) {
      console.error('Error al procesar la reasignación:', error);
      alert('Error al procesar la reasignación');
    }
  }, [
    approvedExpenses,
    editingSigns,
    editingAmounts,
    editingStatus,
    handleDialogSubmit,
    getCardNumber,
  ]);

  const formatMoney = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '$0.00';
    return `$${amount.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filtrar viáticos aprobados por compañía (robusto)
  const filteredExpenses =
    selectedCompany !== 'all'
      ? approvedExpenses.filter(
          e =>
            e.companyId?.toString() === selectedCompany ||
            e.company?.id?.toString() === selectedCompany ||
            e.user?.companyId?.toString() === selectedCompany,
        )
      : approvedExpenses;

  return (
    <>
      <Card className='overflow-hidden shadow-lg border-none transition-all duration-200'>
        <div className='overflow-x-auto'>
          <div className='flex justify-between items-center p-4'>
            <div className='flex gap-2 items-center'>
              <h1 className='text-2xl font-bold text-[#F34602]'>
                Solicitudes de Viáticos Aprobadas
              </h1>
              <Select
                value={selectedCompany}
                onValueChange={setSelectedCompany}
                disabled={companies.length === 0}
              >
                <SelectTrigger className='border-[#F34602] text-[#F34602] min-w-[180px] ml-4'>
                  <SelectValue placeholder='Filtrar por compañía' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas las compañías</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={handleReassignment}
                      disabled={
                        loading ||
                        approvedExpenses.length === 0 ||
                        selectedCompany === 'all'
                      }
                      className='bg-[#F34602] text-white hover:bg-[#d13e02] flex gap-2'
                    >
                      <Download className='h-4 w-4' />
                      Descargar Reasignación
                    </Button>
                  </div>
                </TooltipTrigger>
                {selectedCompany === 'all' && (
                  <TooltipContent>
                    <p>
                      Selecciona una empresa para descargar el archivo de
                      reasignación
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          {error && (
            <Alert variant='destructive' className='mx-4 mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
              {loading ? (
                <tr>
                  <td colSpan={9} className='py-8 text-center'>
                    Cargando datos...
                  </td>
                </tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <tr
                    key={`${expense.id}-${index}`}
                    className={`border-b border-gray-200 transition-colors duration-200 ${
                      hoveredRow === index
                        ? 'bg-gray-100'
                        : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50'
                    }`}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className='py-3 px-4'>{expense.userId}</td>
                    <td className='py-3 px-4'>{getCardNumber(expense)}</td>
                    <td className='py-3 px-4'>
                      {expense.description || expense.travelReason || 'N/A'}
                    </td>
                    <td className='py-3 px-4 font-medium text-[#F34602]'>
                      {formatMoney(
                        expense.requestedAmount || expense.totalAmount,
                      )}
                    </td>
                    <td className='py-3 px-4 font-medium text-[#F34602]'>
                      {formatMoney(getCardLimit(expense))}
                    </td>
                    <td className='py-3 px-4'>
                      <Select
                        value={editingSigns[expense.id] || '+'}
                        onValueChange={value =>
                          handleSignChange(expense.id, value)
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
                        value={editingAmounts[expense.id] || ''}
                        onChange={e =>
                          handleAmountChange(expense.id, e.target.value)
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
                        value={editingStatus[expense.id] || '0'}
                        onValueChange={value =>
                          handleStatusChange(
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
                  <td colSpan={9} className='py-8 text-center'>
                    No hay solicitudes de viáticos aprobadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ReassignmentDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleDialogConfirm}
        data={dialogData}
        onDataChange={updateDialogData}
        isProcessing={isProcessing}
        selectedCompany={selectedCompany}
        companies={companies}
      />
    </>
  );
}
