import { useCardAssignmentLogic } from '../hooks/useCardAssignmentLogic';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Download } from 'lucide-react';
import { ReassignmentDialog } from './reassignment-dialog';
import { CardAssignmentTableBody } from './CardAssignmentTableBody';
import { AlertMessage } from './AlertMessage';
import { toast } from 'sonner';

export default function CardAssignmentTable() {
  const logic = useCardAssignmentLogic();

  if (logic.error) {
    toast.error(logic.error);
  }

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
                value={logic.selectedCompany}
                onValueChange={logic.setSelectedCompany}
                disabled={logic.companies.length === 0}
              >
                <SelectTrigger className='border-[#F34602] text-[#F34602] min-w-[180px] ml-4'>
                  <SelectValue placeholder='Filtrar por compañía' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas las compañías</SelectItem>
                  {logic.companies.map(company => (
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
                      onClick={logic.handleReassignment}
                      disabled={
                        logic.loading ||
                        logic.approvedExpenses.length === 0 ||
                        logic.selectedCompany === 'all'
                      }
                      className='bg-[#F34602] text-white hover:bg-[#d13e02] flex gap-2'
                    >
                      <Download className='h-4 w-4' />
                      Descargar Reasignación
                    </Button>
                  </div>
                </TooltipTrigger>
                {logic.selectedCompany === 'all' && (
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

          {logic.error && (
            <div className='p-4'>
              <AlertMessage
                type='error'
                title='Error al cargar los datos'
                description={logic.error}
              />
            </div>
          )}

          {logic.successMessage && (
            <div className='p-4'>
              <AlertMessage
                type='success'
                title='Operación exitosa'
                description={logic.successMessage}
              />
            </div>
          )}

          <CardAssignmentTableBody logic={logic} />
        </div>
      </Card>

      <ReassignmentDialog
        isOpen={logic.isDialogOpen}
        onClose={logic.closeDialog}
        onSubmit={logic.handleDialogConfirm}
        data={logic.dialogData}
        onDataChange={logic.updateDialogData}
        isProcessing={logic.isProcessing}
        selectedCompany={logic.selectedCompany}
        companies={logic.companies}
      />
    </>
  );
}
