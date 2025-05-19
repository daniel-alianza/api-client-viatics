import { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format, isBefore } from 'date-fns';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRequestErrorModal } from '@/features/request/hooks/useRequestErrorModal';

interface TravelDatesProps {
  departureDate?: string | Date;
  setDepartureDate: (date: Date | undefined) => void;
  returnDate?: string | Date;
  setReturnDate: (date: Date | undefined) => void;
  distributionDate?: string | Date;
  setDistributionDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

interface DateButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  date?: string | Date;
  label: string;
  disabled?: boolean;
}

const DateButton = forwardRef<HTMLButtonElement, DateButtonProps>(
  ({ date, label, disabled, ...props }, ref) => (
    <Button
      asChild
      variant='outline'
      className={cn(
        'w-full justify-start text-left font-normal border-slate-300 hover:bg-slate-100 hover:text-[#F34602] transition-colors rounded-md',
        !date && 'text-muted-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      disabled={disabled}
    >
      <button ref={ref} {...props}>
        <CalendarIcon className='mr-2 h-4 w-4' />
        {date ? format(new Date(date), 'yyyy-MM-dd') : label}
      </button>
    </Button>
  ),
);

DateButton.displayName = 'DateButton';

const TravelDates = forwardRef<HTMLDivElement, TravelDatesProps>(
  (
    {
      departureDate,
      setDepartureDate,
      returnDate,
      setReturnDate,
      distributionDate,
      setDistributionDate,
      disabled = false,
    },
    ref,
  ) => {
    const [openDeparture, setOpenDeparture] = useState(false);
    const [openReturn, setOpenReturn] = useState(false);
    const [openDistribution, setOpenDistribution] = useState(false);
    const { showErrorModal } = useRequestErrorModal();

    const handleDepartureDateChange = (date: Date | undefined) => {
      if (!date || disabled) {
        setDepartureDate(undefined);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isBefore(date, today)) {
        showErrorModal(
          'Error de Validación',
          'La fecha de salida no puede ser anterior a la fecha actual',
        );
        return;
      }

      setDepartureDate(date);
      setOpenDeparture(false);
    };

    const handleDistributionDateChange = (date: Date | undefined) => {
      if (!date || disabled) {
        setDistributionDate(undefined);
        return;
      }

      setDistributionDate(date);
      setOpenDistribution(false);
    };

    const isDistributionDateValid = () => {
      if (!departureDate || !distributionDate) return true;
      return true;
    };

    return (
      <div ref={ref} className='space-y-6'>
        <div className='flex items-center gap-2 mb-4'>
          <CalendarIcon className='h-5 w-5 text-[#F34602]' />
          <h3 className='text-lg font-medium' style={{ color: '#02082C' }}>
            Fechas del Viaje
          </h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='departureDate'
              className='text-sm font-medium text-slate-700'
            >
              Fecha de Salida
            </Label>
            <Popover open={openDeparture} onOpenChange={setOpenDeparture}>
              <PopoverTrigger asChild>
                <DateButton
                  date={departureDate}
                  label='Selecciona la Fecha'
                  id='departureDate'
                  disabled={disabled}
                />
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0 border-[#F34602]/20'>
                <Calendar
                  mode='single'
                  selected={departureDate ? new Date(departureDate) : undefined}
                  onSelect={handleDepartureDateChange}
                  initialFocus
                  className='rounded-md'
                  disabled={date => {
                    if (disabled) return true;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return isBefore(date, today);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='returnDate'
              className='text-sm font-medium text-slate-700'
            >
              Fecha de Regreso
            </Label>
            <Popover open={openReturn} onOpenChange={setOpenReturn}>
              <PopoverTrigger asChild>
                <DateButton
                  date={returnDate}
                  label='Selecciona la Fecha'
                  id='returnDate'
                  disabled={disabled}
                />
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0 border-[#F34602]/20'>
                <Calendar
                  mode='single'
                  selected={returnDate ? new Date(returnDate) : undefined}
                  onSelect={date => {
                    if (!disabled) {
                      setReturnDate(date || undefined);
                      setOpenReturn(false);
                    }
                  }}
                  initialFocus
                  className='rounded-md'
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='distributionDate'
              className='text-sm font-medium text-slate-700'
            >
              Fecha de Dispersión
            </Label>
            <Popover open={openDistribution} onOpenChange={setOpenDistribution}>
              <PopoverTrigger asChild>
                <DateButton
                  date={distributionDate}
                  label='Selecciona la Fecha'
                  id='distributionDate'
                  disabled={disabled}
                />
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0 border-[#F34602]/20'>
                <Calendar
                  mode='single'
                  selected={
                    distributionDate ? new Date(distributionDate) : undefined
                  }
                  onSelect={handleDistributionDateChange}
                  initialFocus
                  className='rounded-md'
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
            {!isDistributionDateValid() && (
              <Alert variant='destructive' className='mt-2'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Por favor seleccione una fecha de distribución válida
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    );
  },
);

TravelDates.displayName = 'TravelDates';

export default TravelDates;
