import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ThumbsUp, X } from 'lucide-react';
import { ExpenseModal } from '@/features/authorization/components/expense-modal';
import { useExpenses } from '@/features/authorization/hooks/use-expenses';
import { formatCurrency, formatDate } from '@/features/authorization/lib/utils';
import type {
  Expense,
  ExpenseStatus,
} from '@/features/authorization/interfaces/expense';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface ExpenseTableProps {
  searchQuery: string;
  statusFilter: string;
}

export function ExpenseTable({ searchQuery, statusFilter }: ExpenseTableProps) {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const { expenses, approveExpense } = useExpenses();
  const [alertState, setAlertState] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    title: '',
    message: '',
    type: 'success',
  });

  const filteredExpenses = expenses.filter(expense => {
    // Filter by status
    if (statusFilter !== 'all') {
      const expenseStatus = expense.status;

      switch (statusFilter) {
        case 'Pending':
          return expenseStatus === 'Pendiente';
        case 'Approved':
          return expenseStatus === 'Aprobada';
        case 'Rejected':
          return expenseStatus === 'Rechazada';
        default:
          return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        expense.userId.toLowerCase().includes(query) ||
        expense.requestor.toLowerCase().includes(query) ||
        expense.userName.toLowerCase().includes(query) ||
        expense.company.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case 'Aprobada':
        return (
          <Badge className='bg-green-500 hover:bg-green-600 transition-colors'>
            Aprobada
          </Badge>
        );
      case 'Rechazada':
        return (
          <Badge className='bg-red-500 hover:bg-red-600 transition-colors'>
            Rechazada
          </Badge>
        );
      case 'Pendiente':
        return (
          <Badge className='bg-amber-500 hover:bg-amber-600 transition-colors'>
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge className='bg-gray-500 hover:bg-gray-600 transition-colors'>
            {status}
          </Badge>
        );
    }
  };

  const handleAction = async (expenseId: string, approved: boolean) => {
    const result = await approveExpense(expenseId, approved);
    setAlertState({
      show: true,
      title: result.success ? 'Éxito' : 'Error',
      message: result.message,
      type: result.success ? 'success' : 'error',
    });
  };

  // Función para renderizar los botones de acción según el estado
  const renderActionButtons = (expense: Expense) => {
    const normalizedStatus = expense.status.toLowerCase();

    // Botón para ver detalles (siempre visible)
    const viewButton = (
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setSelectedExpense(expense.id)}
        className='text-[#02082C] hover:bg-[#F34602]/10 hover:text-[#F34602] transition-all duration-200 hover:scale-110'
      >
        <Eye className='h-4 w-4' />
        <span className='sr-only'>View Details</span>
      </Button>
    );

    // Si está pendiente, mostrar botones de aprobar y rechazar
    if (normalizedStatus === 'pending' || normalizedStatus === 'pendiente') {
      return (
        <div className='flex space-x-2'>
          {viewButton}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleAction(expense.id, true)}
            className='text-[#02082C] hover:bg-green-100 hover:text-green-600 transition-all duration-200 hover:scale-110'
          >
            <ThumbsUp className='h-4 w-4' />
            <span className='sr-only'>Approve</span>
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleAction(expense.id, false)}
            className='text-[#02082C] hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-110'
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Reject</span>
          </Button>
        </div>
      );
    }

    // Si está aprobada o rechazada, solo mostrar el botón de ver detalles
    return <div className='flex space-x-2'>{viewButton}</div>;
  };

  return (
    <>
      <div className='rounded-md border bg-white shadow-md hover:shadow-lg transition-shadow duration-300'>
        <Table>
          <TableHeader className='bg-[#02082C]/10'>
            <TableRow>
              <TableHead className='font-medium text-[#02082C]'>
                User ID
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Requestor
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                User Name
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Company
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Departure
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Return
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Amount
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Status
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='h-24 text-center'>
                    No expense requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense, index) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className='hover:bg-[#F34602]/5 transition-colors duration-200 data-[state=selected]:bg-[#F34602]/10'
                  >
                    <TableCell className='font-medium'>
                      {expense.userId}
                    </TableCell>
                    <TableCell>{expense.requestor}</TableCell>
                    <TableCell>{expense.userName}</TableCell>
                    <TableCell>{expense.company}</TableCell>
                    <TableCell>{formatDate(expense.departureDate)}</TableCell>
                    <TableCell>{formatDate(expense.returnDate)}</TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell>{renderActionButtons(expense)}</TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {selectedExpense && (
        <ExpenseModal
          expenseId={selectedExpense}
          onClose={() => setSelectedExpense(null)}
        />
      )}

      <AlertDialog
        open={alertState.show}
        onOpenChange={() => setAlertState(prev => ({ ...prev, show: false }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={
                alertState.type === 'success'
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {alertState.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertState.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className={
                alertState.type === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
              onClick={() => setAlertState(prev => ({ ...prev, show: false }))}
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
