import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AlertMessageProps {
  type: 'error' | 'success';
  title: string;
  description?: string;
  className?: string;
}

export function AlertMessage({
  type,
  title,
  description,
  className,
}: AlertMessageProps) {
  if (type === 'error') {
    return (
      <Alert variant='destructive' className={className}>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </Alert>
    );
  }

  return (
    <Alert
      className={`border-green-200 bg-green-50 text-green-800 ${className}`}
    >
      <CheckCircle className='h-4 w-4 text-green-600' />
      <AlertTitle className='text-green-800'>{title}</AlertTitle>
      {description && (
        <AlertDescription className='text-green-700'>
          {description}
        </AlertDescription>
      )}
    </Alert>
  );
}
