import React, { useState } from 'react';
import { ExpenseProvider } from '@/features/TravelExpense-Checks/context/expense-context';
import { useExpense } from '@/features/TravelExpense-Checks/context/expense-context';
import Navbar from '@/features/collaborators-w-card/components/navbar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputField } from '@/components/ui/input-field';
import type { Document } from '../interfaces/types';
import { X } from 'lucide-react';

const ExpenseVerificationTable: React.FC = () => {
  const {
    comprobaciones,
    error,
    loadComprobaciones,
    approveComprobacion,
    rejectComprobacion,
    getComprobacionDocuments,
  } = useExpense();

  const [selectedComprobacion, setSelectedComprobacion] = useState<
    number | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    loadComprobaciones();
  }, [loadComprobaciones]);

  if (error) {
    return <div className='text-center text-red-500 py-8'>{error}</div>;
  }

  // Filtrar comprobaciones por estado
  const pendingComprobaciones = comprobaciones.filter(
    comp => comp.status === 'pendiente',
  );
  const rejectedComprobaciones = comprobaciones.filter(
    comp => comp.status === 'rechazada',
  );
  const verifiedComprobaciones = comprobaciones.filter(
    comp => comp.status === 'aprobada',
  );

  const handleViewDocuments = async (comprobacionId: number) => {
    try {
      const docs = await getComprobacionDocuments(comprobacionId);
      setDocuments(docs);
      setSelectedComprobacion(comprobacionId);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    }
  };

  const handlePreviewDocument = async (documentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:4000/comprobaciones/documents/${documentId}`,
      );

      if (!response.ok) {
        throw new Error('Error al cargar el documento');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error al cargar la vista previa:', error);
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleApprove = async (comprobacionId: number) => {
    try {
      await approveComprobacion(comprobacionId, comment);
      setIsDialogOpen(false);
      setComment('');
      // Recargar las comprobaciones después de aprobar
      await loadComprobaciones();
    } catch (error) {
      console.error('Error al aprobar:', error);
    }
  };

  const handleReject = async (comprobacionId: number) => {
    try {
      await rejectComprobacion(comprobacionId, comment);
      setIsDialogOpen(false);
      setComment('');
      setIsRejecting(false);
      // Recargar las comprobaciones después de rechazar
      await loadComprobaciones();
    } catch (error) {
      console.error('Error al rechazar:', error);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Comprobaciones de Gastos</h1>

      {/* Tabla de Comprobaciones Pendientes */}
      <div className='mb-8'>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          <div className='px-6 py-4 bg-gradient-to-r from-yellow-600 to-yellow-400'>
            <h2 className='text-xl font-bold text-white flex items-center'>
              <span className='mr-2'>⏳</span>
              Comprobaciones Pendientes
              <span className='ml-3 text-sm font-normal bg-white/20 px-3 py-1 rounded-full'>
                {pendingComprobaciones.length}
              </span>
            </h2>
          </div>
          {!pendingComprobaciones || pendingComprobaciones.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-yellow-500 text-6xl mb-4'>📋</div>
              <p className='text-yellow-600 font-semibold text-lg'>
                No hay comprobaciones pendientes
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Viático ID
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Memo
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Fecha Vencimiento
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Estado
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Tipo
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Monto
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {pendingComprobaciones.map(comprobacion => (
                    <tr
                      key={comprobacion.id}
                      className='hover:bg-gray-50 transition-colors duration-200'
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        #{comprobacion.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {comprobacion.viaticoId}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {comprobacion.memo}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(comprobacion.dueDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            comprobacion.status === 'comprobada' ||
                            comprobacion.status === 'aprobada'
                              ? 'bg-green-100 text-green-800'
                              : comprobacion.status === 'rechazada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {comprobacion.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {comprobacion.comprobanteType}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#F34602]'>
                        ${comprobacion.debitAmount.toFixed(2) || '0.00'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <div className='flex space-x-2'>
                          <Button
                            onClick={() => handleViewDocuments(comprobacion.id)}
                            className='bg-blue-500 hover:bg-blue-600 text-white'
                          >
                            Ver Documentos
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Comprobaciones Rechazadas */}
      <div className='mb-8'>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          <div className='px-6 py-4 bg-gradient-to-r from-red-600 to-red-400'>
            <h2 className='text-xl font-bold text-white flex items-center'>
              <span className='mr-2'>❌</span>
              Comprobaciones Rechazadas
              <span className='ml-3 text-sm font-normal bg-white/20 px-3 py-1 rounded-full'>
                {rejectedComprobaciones.length}
              </span>
            </h2>
          </div>
          {!rejectedComprobaciones || rejectedComprobaciones.length === 0 ? (
            <div className='text-center py-12'>
              <div className='text-red-500 text-6xl mb-4'>📋</div>
              <p className='text-red-600 font-semibold text-lg'>
                No hay comprobaciones rechazadas
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Viático ID
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Memo
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Fecha Vencimiento
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Estado
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Tipo
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Monto
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Comentario
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {rejectedComprobaciones.map(comprobacion => (
                    <tr
                      key={comprobacion.id}
                      className='hover:bg-gray-50 transition-colors duration-200'
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        #{comprobacion.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {comprobacion.viaticoId}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {comprobacion.memo}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(comprobacion.dueDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            comprobacion.status === 'comprobada' ||
                            comprobacion.status === 'aprobada'
                              ? 'bg-green-100 text-green-800'
                              : comprobacion.status === 'rechazada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {comprobacion.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {comprobacion.comprobanteType}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#F34602]'>
                        ${comprobacion.debitAmount.toFixed(2) || '0.00'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {comprobacion.approverComment}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <div className='flex space-x-2'>
                          <Button
                            onClick={() => handleViewDocuments(comprobacion.id)}
                            className='bg-blue-500 hover:bg-blue-600 text-white'
                          >
                            Ver Documentos
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Comprobaciones Verificadas */}
      <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
        <div className='px-6 py-4 bg-gradient-to-r from-green-600 to-green-400'>
          <h2 className='text-xl font-bold text-white flex items-center'>
            <span className='mr-2'>✅</span>
            Comprobaciones Verificadas
            <span className='ml-3 text-sm font-normal bg-white/20 px-3 py-1 rounded-full'>
              {verifiedComprobaciones.length}
            </span>
          </h2>
        </div>
        {!verifiedComprobaciones || verifiedComprobaciones.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-green-500 text-6xl mb-4'>📋</div>
            <p className='text-green-600 font-semibold text-lg'>
              No hay comprobaciones verificadas
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Viático ID
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Memo
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Fecha Vencimiento
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Estado
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Tipo
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Monto
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {verifiedComprobaciones.map(comprobacion => (
                  <tr
                    key={comprobacion.id}
                    className='hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      #{comprobacion.id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {comprobacion.viaticoId}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {comprobacion.memo}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(comprobacion.dueDate).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          comprobacion.status === 'comprobada' ||
                          comprobacion.status === 'aprobada'
                            ? 'bg-green-100 text-green-800'
                            : comprobacion.status === 'rechazada'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {comprobacion.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {comprobacion.comprobanteType}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#F34602]'>
                      ${comprobacion.debitAmount.toFixed(2) || '0.00'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <div className='flex space-x-2'>
                        <Button
                          onClick={() => handleViewDocuments(comprobacion.id)}
                          className='bg-blue-500 hover:bg-blue-600 text-white'
                        >
                          Ver Documentos
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Diálogo para ver documentos */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          if (!open) {
            setIsDialogOpen(false);
            setComment('');
            setIsRejecting(false);
            closePreview();
          }
        }}
      >
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>
              {isRejecting ? 'Rechazar Comprobación' : 'Ver Documentos'}
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            {previewUrl ? (
              <div className='relative w-full h-[600px]'>
                <iframe
                  src={previewUrl}
                  className='w-full h-full border-0'
                  title='Vista previa del documento'
                />
                <button
                  onClick={closePreview}
                  className='absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            ) : (
              <>
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className='flex items-center justify-between p-2 bg-gray-50 rounded'
                  >
                    <span className='text-sm'>{doc.fileName}</span>
                    <div className='space-x-2'>
                      <Button
                        onClick={() => handlePreviewDocument(doc.id)}
                        className='bg-blue-500 hover:bg-blue-600 text-white'
                      >
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}

                {selectedComprobacion && !isRejecting && (
                  <div className='mt-4 space-y-4'>
                    <InputField
                      id='comment'
                      label='Comentario'
                      value={comment}
                      onChange={setComment}
                      placeholder='Ingrese un comentario...'
                    />
                    <div className='flex justify-end space-x-2'>
                      <Button
                        onClick={() => setIsRejecting(true)}
                        className='bg-red-500 hover:bg-red-600 text-white'
                      >
                        Rechazar
                      </Button>
                      <Button
                        onClick={() => handleApprove(selectedComprobacion)}
                        className='bg-green-500 hover:bg-green-600 text-white'
                      >
                        Aprobar
                      </Button>
                    </div>
                  </div>
                )}

                {selectedComprobacion && isRejecting && (
                  <div className='mt-4 space-y-4'>
                    <InputField
                      id='comment'
                      label='Comentario de rechazo'
                      value={comment}
                      onChange={setComment}
                      placeholder='Ingrese el motivo del rechazo...'
                      required
                    />
                    <div className='flex justify-end space-x-2'>
                      <Button
                        onClick={() => setIsRejecting(false)}
                        className='bg-gray-500 hover:bg-gray-600 text-white'
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedComprobacion)}
                        className='bg-red-500 hover:bg-red-600 text-white'
                      >
                        Confirmar Rechazo
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ExpenseVerificationPageContent: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='py-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-10'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Gestión de Comprobaciones
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              Administra y verifica las comprobaciones de gastos
            </p>
          </div>
          <ExpenseVerificationTable />
        </div>
      </main>
    </div>
  );
};

export const ExpenseVerificationPage: React.FC = () => {
  return (
    <ExpenseProvider>
      <ExpenseVerificationPageContent />
    </ExpenseProvider>
  );
};
