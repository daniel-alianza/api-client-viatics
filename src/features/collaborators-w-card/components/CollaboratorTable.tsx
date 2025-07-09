import { useCollaboratorTableLogic as useCollaboratorTable } from '../hooks/useCollaboratorTableLogic';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Loader2 } from 'lucide-react';

import { AssignCardForm } from './AssignCardForm';
import { CompanyFilter } from './CompanyFilter';
import { HeaderActions } from './HeaderActions';
import CollaboratorRow from './CollaboratorRow';
import EditCardModal from './EditCardModal';
import DeleteConfirmation from './DeleteConfirmation';
import DownloadModal from './DownloadModal';

export default function CollaboratorTable() {
  const {
    loading,
    error,
    filteredCollaborators,
    selectedCompany,
    companies,
    assignCardState,
    assignCardHandlers,
    showDownloadModal,
    setShowDownloadModal,
    editingCollaborator,
    setEditingCollaborator,
    deletingCollaborator,
    setDeletingCollaborator,
    setSelectedCompany,
    refreshCollaborators,
  } = useCollaboratorTable();

  return (
    <div className='space-y-6 animate-fadeIn'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Colaboradores sin Tarjeta
        </h2>
        <HeaderActions
          onDownload={() => setShowDownloadModal(true)}
          onAssignToggle={() => assignCardHandlers.setIsAssigning(true)}
          assignDisabled={
            loading ||
            filteredCollaborators.length === 0 ||
            selectedCompany === 'all'
          }
          showTooltip={selectedCompany === 'all'}
        />
        <CompanyFilter
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          companies={companies}
          disabled={loading}
        />
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center gap-2 text-red-600'>
            <AlertCircle className='h-4 w-4' />
            <h3 className='font-medium'>Error</h3>
          </div>
          <p className='text-red-600 mt-1'>{error}</p>
        </div>
      )}

      <AssignCardForm
        collaborators={filteredCollaborators}
        assignCardState={assignCardState}
        assignCardHandlers={assignCardHandlers}
        companies={companies}
      />

      <div className='border rounded-lg overflow-hidden'>
        <Table>
          <TableHeader className='bg-[#0A1A4D] text-white'>
            <TableRow>
              <TableHead className='text-white font-medium'>Nombre</TableHead>
              <TableHead className='text-white font-medium'>Email</TableHead>
              <TableHead className='text-white font-medium'>
                Departamento
              </TableHead>
              <TableHead className='text-white font-medium'>
                Número de Tarjeta
              </TableHead>
              <TableHead className='text-white font-medium'>Compañía</TableHead>
              <TableHead className='text-white font-medium text-right'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8'>
                  <div className='flex justify-center items-center'>
                    <Loader2 className='h-6 w-6 animate-spin text-[#F34602]' />
                    <span className='ml-2 text-gray-500'>
                      Cargando colaboradores...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCollaborators.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center py-8 text-gray-500'
                >
                  No hay colaboradores.
                </TableCell>
              </TableRow>
            ) : (
              filteredCollaborators.map(collaborator => (
                <CollaboratorRow
                  key={collaborator.id}
                  collaborator={collaborator}
                  onEdit={() => setEditingCollaborator(collaborator)}
                  onRefresh={refreshCollaborators}
                  companies={companies}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingCollaborator && (
        <EditCardModal
          collaborator={editingCollaborator}
          onClose={() => setEditingCollaborator(null)}
        />
      )}

      {deletingCollaborator && (
        <DeleteConfirmation
          collaborator={deletingCollaborator}
          onClose={() => setDeletingCollaborator(null)}
        />
      )}

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        collaborators={filteredCollaborators}
        selectedCompany={selectedCompany}
        companies={companies}
      />
    </div>
  );
}
