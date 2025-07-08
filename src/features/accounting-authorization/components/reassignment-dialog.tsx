import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ReassignmentDialogProps } from '../interfaces/DialogpropInterface';
import { useCompanyAutoFill } from '../hooks/useCompanyAutoFill';

export function ReassignmentDialog({
  isOpen,
  onClose,
  onSubmit,
  data,
  onDataChange,
  isProcessing,
  selectedCompany,
  companies,
}: ReassignmentDialogProps) {
  useCompanyAutoFill({ selectedCompany, companies, onDataChange });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reasignación de Tarjeta</DialogTitle>
          <DialogDescription>
            Ingrese el número de grupo y cliente para generar el archivo de
            reasignación.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='groupNumber'>Número de Grupo</Label>
            <Input
              id='groupNumber'
              value={data.groupNumber}
              onChange={e => onDataChange({ groupNumber: e.target.value })}
              placeholder='Ingrese el número de grupo'
              maxLength={9}
              readOnly={selectedCompany !== 'all' && !!data.groupNumber}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='clientNumber'>Número de Cliente</Label>
            <Input
              id='clientNumber'
              value={data.clientNumber}
              onChange={e => onDataChange({ clientNumber: e.target.value })}
              placeholder='Ingrese el número de cliente'
              maxLength={10}
              readOnly={selectedCompany !== 'all' && !!data.clientNumber}
            />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!data.groupNumber || !data.clientNumber || isProcessing}
          >
            {isProcessing ? 'Procesando...' : 'Descargar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
