import { Button } from '@/components/ui/button';
import { Download, CreditCard } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  onDownload: () => void;
  onAssignToggle: () => void;
  assignDisabled: boolean;
  showTooltip: boolean;
}

export function HeaderActions({
  onDownload,
  onAssignToggle,
  assignDisabled,
  showTooltip,
}: Props) {
  return (
    <div className='flex gap-2'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                onClick={onDownload}
                variant='outline'
                className='border-[#F34602] text-[#F34602] hover:bg-orange-50 cursor-pointer'
                disabled={assignDisabled}
              >
                <Download className='mr-2 h-4 w-4' />
                Descargar asignación por archivo
              </Button>
            </div>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent>
              <p>Selecciona una empresa para descargar el archivo</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <Button
        onClick={onAssignToggle}
        className='bg-[#F34602] hover:bg-orange-600 transition-all duration-300 cursor-pointer'
      >
        <CreditCard className='mr-2 h-4 w-4' />
        Asignar Tarjeta
      </Button>
    </div>
  );
}
