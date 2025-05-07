import { useToast } from './use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${
            toast.variant === 'destructive'
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-green-50 border-green-200 text-green-600'
          } rounded-lg border p-4 shadow-lg animate-slideIn flex items-start gap-2`}
        >
          {toast.variant === 'destructive' ? (
            <AlertCircle className='h-5 w-5' />
          ) : (
            <CheckCircle2 className='h-5 w-5' />
          )}
          <div>
            <h4 className='font-medium'>{toast.title}</h4>
            {toast.description && (
              <p className='text-sm mt-1'>{toast.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
