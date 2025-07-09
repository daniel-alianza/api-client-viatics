import { XCircle, AlertCircle, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'success';
}

interface RequestErrorModalProps {
  modalState: ModalState;
  onClose: () => void;
}

export const RequestErrorModal = ({
  modalState,
  onClose,
}: RequestErrorModalProps) => {
  const getIcon = () => {
    switch (modalState.type) {
      case 'error':
        return <XCircle className='h-6 w-6 text-red-500' />;
      case 'warning':
        return <AlertCircle className='h-6 w-6 text-yellow-500' />;
      case 'success':
        return <CheckCircle className='h-6 w-6 text-green-500' />;
      default:
        return <XCircle className='h-6 w-6 text-red-500' />;
    }
  };

  const getTitleColor = () => {
    switch (modalState.type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-red-500';
    }
  };

  const getButtonColor = () => {
    switch (modalState.type) {
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-red-500 hover:bg-red-600';
    }
  };

  return (
    <AlertDialog open={modalState.isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className='flex items-center gap-2'>
            {getIcon()}
            <AlertDialogTitle className={getTitleColor()}>
              {modalState.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className='mt-2'>
            {modalState.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className={getButtonColor()}>
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
