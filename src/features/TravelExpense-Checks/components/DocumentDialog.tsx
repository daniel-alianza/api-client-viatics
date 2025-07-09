import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputField } from '@/components/ui/input-field';
import type { DocumentDialogProps } from '../interfaces/types';
import { X } from 'lucide-react';
import { XmlInfoTable } from '@/features/accounting-clearance/components/XmlInfoTable';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export const DocumentDialog: React.FC<DocumentDialogProps> = ({
  isOpen,
  onClose,
  isRejecting,
  selectedComprobacion,
  comment,
  documents,
  previewUrl,
  showXmlInfo,
  isLoadingXmlInfo,
  xmlInfo,
  isPdfFile,
  onPreviewDocument,
  onClosePreview,
  onCommentChange,
  onSetRejecting,
  onApprove,
  onReject,
}) => {
  // Estado para el modal de alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  // Funciones para manejar la aprobación/rechazo con modal
  const handleApproveWithAlert = async (comprobacionId: number) => {
    try {
      await onApprove(comprobacionId);
      setAlertType('success');
      setAlertTitle('¡Comprobación aprobada!');
      setAlertDescription('La solicitud fue aprobada exitosamente.');
      setAlertOpen(true);
    } catch (error) {
      setAlertType('error');
      setAlertTitle('Error al aprobar');
      setAlertDescription('Ocurrió un error al aprobar la solicitud.');
      setAlertOpen(true);
    }
  };

  const handleRejectWithAlert = async (comprobacionId: number) => {
    try {
      await onReject(comprobacionId);
      setAlertType('error');
      setAlertTitle('¡Comprobación rechazada!');
      setAlertDescription('La solicitud fue rechazada exitosamente.');
      setAlertOpen(true);
    } catch (error) {
      setAlertType('error');
      setAlertTitle('Error al rechazar');
      setAlertDescription('Ocurrió un error al rechazar la solicitud.');
      setAlertOpen(true);
    }
  };

  // Cerrar automáticamente el modal después de 3 segundos si es éxito
  React.useEffect(() => {
    if (alertOpen && alertType === 'success') {
      const timer = setTimeout(() => setAlertOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertOpen, alertType]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-7xl'>
        <DialogHeader>
          <DialogTitle>
            {isRejecting ? 'Rechazar Comprobación' : 'Ver Documentos'}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {previewUrl ? (
            <div className='relative w-full h-[600px]'>
              {isPdfFile ? (
                <object
                  data={previewUrl}
                  type='application/pdf'
                  className='w-full h-full border-0'
                >
                  <p className='text-center py-8'>
                    Tu navegador no puede mostrar PDFs.
                    <a
                      href={previewUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline ml-2'
                    >
                      Haz clic aquí para descargar
                    </a>
                  </p>
                </object>
              ) : (
                <iframe
                  src={previewUrl}
                  className='w-full h-full border-0'
                  title='Vista previa del documento'
                  sandbox='allow-same-origin allow-scripts allow-forms'
                />
              )}
              <button
                onClick={onClosePreview}
                className='absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ) : showXmlInfo ? (
            <div className='relative w-full'>
              <button
                onClick={onClosePreview}
                className='absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg z-10'
              >
                <X className='h-4 w-4' />
              </button>
              {isLoadingXmlInfo ? (
                <div className='text-center py-8'>
                  <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                  <p className='mt-2 text-gray-600'>
                    Cargando información del XML...
                  </p>
                </div>
              ) : xmlInfo ? (
                <div className='w-full max-w-md mx-auto my-6'>
                  <XmlInfoTable xmlData={xmlInfo} />
                </div>
              ) : (
                <div className='text-center py-8'>
                  <p className='text-gray-600'>
                    No se pudo cargar la información del XML
                  </p>
                </div>
              )}
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
                      onClick={() => {
                        if (doc.type === 'factura_xml') {
                          if (selectedComprobacion !== null) {
                            onPreviewDocument(
                              selectedComprobacion,
                              doc.fileName,
                            );
                          }
                        } else {
                          onPreviewDocument(doc.id, doc.fileName);
                        }
                      }}
                      disabled={
                        doc.type === 'factura_xml' &&
                        selectedComprobacion === null
                      }
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
                    onChange={onCommentChange}
                    placeholder='Ingrese un comentario...'
                  />
                  <div className='flex justify-end space-x-2'>
                    <Button
                      onClick={() => onSetRejecting(true)}
                      className='bg-red-500 hover:bg-red-600 text-white'
                    >
                      Rechazar
                    </Button>
                    <Button
                      onClick={() =>
                        handleApproveWithAlert(selectedComprobacion)
                      }
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
                    onChange={onCommentChange}
                    placeholder='Ingrese el motivo del rechazo...'
                    required
                  />
                  <div className='flex justify-end space-x-2'>
                    <Button
                      onClick={() => onSetRejecting(false)}
                      className='bg-gray-500 hover:bg-gray-600 text-white'
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() =>
                        handleRejectWithAlert(selectedComprobacion)
                      }
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

      {/* Modal de alerta visual */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={
                alertType === 'success' ? 'text-green-600' : 'text-red-600'
              }
            >
              {alertTitle}
            </AlertDialogTitle>
            <AlertDialogDescription
              className={
                alertType === 'success' ? 'text-green-500' : 'text-red-500'
              }
            >
              {alertDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className={
                alertType === 'success'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
              }
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
