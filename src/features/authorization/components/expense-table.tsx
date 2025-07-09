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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ExpenseTableProps {
  searchQuery: string;
  statusFilter: string;
}

export function ExpenseTable({ searchQuery, statusFilter }: ExpenseTableProps) {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const { expenses, approveExpense, refreshExpenses } = useExpenses();
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
  const [commentDialog, setCommentDialog] = useState<{
    open: boolean;
    expenseId: string | null;
    approved: boolean;
  }>({ open: false, expenseId: null, approved: false });
  const [comment, setComment] = useState('');

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
    setCommentDialog({ open: true, expenseId, approved });
    setComment('');
  };

  const handleCommentDialogClose = () => {
    setCommentDialog({ open: false, expenseId: null, approved: false });
    setComment('');
  };

  const handleCommentSubmit = async () => {
    if (!commentDialog.expenseId) return;
    const comentario = comment
      ? comment
      : commentDialog.approved
      ? 'Aprobado'
      : 'Rechazado';
    const result = await approveExpense(
      commentDialog.expenseId,
      commentDialog.approved,
      comentario,
    );
    setAlertState({
      show: true,
      title: result.success ? 'Éxito' : 'Error',
      message: result.message,
      type: commentDialog.approved
        ? result.success
          ? 'success'
          : 'error'
        : 'error',
    });
    await refreshExpenses();
    handleCommentDialogClose();
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
        <span className='sr-only'>Ver detalles</span>
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
            <span className='sr-only'>Aprobar</span>
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleAction(expense.id, false)}
            className='text-[#02082C] hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-110'
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Rechazar</span>
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
                ID Usuario
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Solicitante
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Motivo del viaje
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Compañía
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Salida
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Regreso
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Monto
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Estado
              </TableHead>
              <TableHead className='font-medium text-[#02082C]'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className='h-24 text-center'>
                    No se encontraron solicitudes de gastos.
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
                    <TableCell>{expense.reason}</TableCell>
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

      <Dialog open={commentDialog.open} onOpenChange={handleCommentDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar comentario (opcional)</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <Input
              placeholder='Escribe tu comentario...'
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <p className='text-sm text-gray-500'>
              Si no escribes un comentario, se usará uno predeterminado: "
              {commentDialog.approved ? 'Aprobado' : 'Rechazado'}"
            </p>
            <div className='flex gap-2'>
              <Button
                onClick={handleCommentSubmit}
                className='bg-blue-600 hover:bg-blue-700'
              >
                Enviar
              </Button>
              <Button variant='outline' onClick={handleCommentDialogClose}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
