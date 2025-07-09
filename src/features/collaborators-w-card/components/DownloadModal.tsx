import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Loader2, Clock } from 'lucide-react';
import { downloadAssignmentsCSV } from '@/services/accountingService';
import { toast } from 'sonner';
import type { Collaborator } from '@/features/collaborators-w-card/interfaces/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  companyClientGroupMap,
  normalizeCompanyName,
  companyNameMap,
} from '@/helpers/companyMap';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: Collaborator[];
  selectedCompany: string;
  companies: { id: string; name: string }[];
}

// Función para obtener el tiempo transcurrido
const getTimeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
  return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
};

export default function DownloadModal({
  isOpen,
  onClose,
  collaborators,
  selectedCompany,
  companies,
}: DownloadModalProps) {
  const [clientNumber, setClientNumber] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'recent', 'today', 'week'

  useEffect(() => {
    if (selectedCompany && selectedCompany !== 'all') {
      const companyObj = companies.find(
        c => c.id.toString() === selectedCompany,
      );
      if (companyObj) {
        const normalizedName = normalizeCompanyName(companyObj.name);
        const exactName = companyNameMap[normalizedName];
        if (exactName) {
          const map = companyClientGroupMap[exactName];
          if (map) {
            setClientNumber(map.cliente);
            setGroupNumber(map.grupo);
          }
        }
      }
    } else {
      setClientNumber('');
      setGroupNumber('');
    }
  }, [selectedCompany, companies]);

  const resetForm = () => {
    setClientNumber('');
    setGroupNumber('');
  };

  // Filtrar colaboradores según el filtro de tiempo seleccionado
  const filterCollaboratorsByTime = (collaborators: Collaborator[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return collaborators.filter(collaborator => {
      const activeCard = collaborator.cards
        .filter(card => card.isActive)
        .sort(
          (a, b) =>
            new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
        )[0];

      if (!activeCard) return false;

      const assignedDate = new Date(activeCard.assignedAt);

      switch (timeFilter) {
        case 'recent':
          return now.getTime() - assignedDate.getTime() <= 24 * 60 * 60 * 1000; // Últimas 24 horas
        case 'today':
          return assignedDate >= today;
        case 'week':
          return assignedDate >= weekAgo;
        default:
          return true;
      }
    });
  };

  const filteredCollaborators = filterCollaboratorsByTime(collaborators);

  const handleDownload = async () => {
    if (!clientNumber.trim() || !groupNumber.trim()) {
      toast.error('Error', {
        description: 'Por favor ingrese el número de cliente y grupo',
      });
      return;
    }

    try {
      setIsDownloading(true);

      // Transformar los colaboradores al formato requerido
      const assignments = filteredCollaborators
        .filter(
          collaborator => collaborator.cards && collaborator.cards.length > 0,
        )
        .map(collaborator => {
          const activeCard = collaborator.cards
            .filter(card => card.isActive)
            .sort(
              (a, b) =>
                new Date(b.assignedAt).getTime() -
                new Date(a.assignedAt).getTime(),
            )[0];

          const today = new Date();
          const futureDate = new Date();
          futureDate.setDate(today.getDate() + 7); // Aumentar 7 días desde la fecha actual

          return {
            id: collaborator.id,
            userId: collaborator.id,
            cardNumber: activeCard?.cardNumber || '',
            assignedTo: collaborator.name
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
            alias: (collaborator.area?.name || collaborator.department || 'N/A')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
            description: 'Asignacion de tarjeta',
            limit: 0.01,
            exitDate: today.toISOString(), // Siempre usar la fecha actual como fecha de inicio
            returnDate: futureDate.toISOString(), // Fecha fin será 7 días después
            status: 'ACTIVE',
          };
        });

      await downloadAssignmentsCSV(assignments, clientNumber, groupNumber);

      resetForm();

      toast.success('Archivo descargado', {
        description: 'El archivo se ha descargado exitosamente',
      });

      onClose();
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error
            ? error.message
            : 'Error al descargar el archivo',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogDescription className='sr-only'>
          Formulario para descargar asignaciones de tarjetas. Ingrese el número
          de cliente y grupo para generar el archivo CSV.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-[#F34602]'>
            <Download className='h-5 w-5' />
            Descargar Asignaciones
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label>Filtrar por fecha de asignación</Label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className='border-gray-300 focus:border-[#F34602] focus:ring-[#F34602]'>
                <SelectValue placeholder='Seleccionar período' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las asignaciones</SelectItem>
                <SelectItem value='recent'>Últimas 24 horas</SelectItem>
                <SelectItem value='today'>Hoy</SelectItem>
                <SelectItem value='week'>Última semana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='bg-orange-50 p-4 rounded-lg border border-orange-200'>
            <h3 className='font-medium text-[#F34602] mb-2 flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              Asignaciones seleccionadas ({filteredCollaborators.length})
            </h3>
            <div className='max-h-40 overflow-y-auto space-y-2'>
              {filteredCollaborators.map(collaborator => {
                const activeCard = collaborator.cards
                  .filter(card => card.isActive)
                  .sort(
                    (a, b) =>
                      new Date(b.assignedAt).getTime() -
                      new Date(a.assignedAt).getTime(),
                  )[0];

                return activeCard ? (
                  <div
                    key={collaborator.id}
                    className='text-sm p-2 bg-white rounded border border-orange-100'
                  >
                    <div className='font-medium'>{collaborator.name}</div>
                    <div className='text-gray-600'>
                      Tarjeta: {activeCard.cardNumber}
                    </div>
                    <div className='text-gray-500 text-xs'>
                      Asignada {getTimeAgo(activeCard.assignedAt)}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='clientNumber'>Número de Cliente</Label>
            <Input
              id='clientNumber'
              value={clientNumber}
              onChange={e => setClientNumber(e.target.value)}
              placeholder='Ingrese número de cliente'
              className='border-gray-300 focus:border-[#F34602] focus:ring-[#F34602]'
              readOnly={selectedCompany !== 'all' && !!clientNumber}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='groupNumber'>Número de Grupo</Label>
            <Input
              id='groupNumber'
              value={groupNumber}
              onChange={e => setGroupNumber(e.target.value)}
              placeholder='Ingrese número de grupo'
              className='border-gray-300 focus:border-[#F34602] focus:ring-[#F34602]'
              readOnly={selectedCompany !== 'all' && !!groupNumber}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={handleClose}
            disabled={isDownloading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDownload}
            className='bg-[#F34602] hover:bg-orange-600 transition-all duration-300'
            disabled={
              isDownloading ||
              !clientNumber ||
              !groupNumber ||
              filteredCollaborators.length === 0
            }
          >
            {isDownloading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Download className='mr-2 h-4 w-4' />
            )}
            Descargar ({filteredCollaborators.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
