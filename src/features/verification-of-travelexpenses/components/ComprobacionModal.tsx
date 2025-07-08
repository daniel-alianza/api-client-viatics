import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { ComprobacionModalProps } from '../interfaces/modalpropcompInterface';

// Componente para el modal de error
const ErrorModal = ({
  isOpen,
  message,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[60]'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className='bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl'
      >
        <div className='flex items-center gap-3 mb-4'>
          <div className='flex-shrink-0'>
            <AlertCircle className='h-6 w-6 text-red-500' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Error de validación
          </h3>
        </div>

        <p className='text-gray-600 mb-6'>{message}</p>

        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors'
          >
            Entendido
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function ComprobacionModal({
  open,
  onClose,
  onSubmit,
  movimiento,
  noSolicitud,
  sociedad,
  isLoading = false,
}: ComprobacionModalProps) {
  const [tipo, setTipo] = useState('factura');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [responsable, setResponsable] = useState('');
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [importe, setImporte] = useState('');
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });

  const formatCompanyName = (company: string) => {
    switch (company) {
      case 'SBO_FGE':
        return 'FG Electrical';
      case 'SBO_Alianza':
        return 'Alianza Electrica';
      case 'SBO_MANUFACTURING':
        return 'Manufacturing';
      default:
        return company;
    }
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTicketFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipo === 'factura') {
      if (!pdfFile && !xmlFile) {
        setErrorModal({
          isOpen: true,
          message: 'Por favor, sube al menos un archivo (PDF o XML)',
        });
        return;
      }
      onSubmit({
        type: 'factura',
        files: { pdf: pdfFile || undefined, xml: xmlFile || undefined },
        description: descripcion,
      });
    } else {
      if (!ticketFile) {
        setErrorModal({
          isOpen: true,
          message: 'Por favor, sube el archivo del ticket',
        });
        return;
      }
      if (!responsable || !motivo || !descripcion || !importe) {
        setErrorModal({
          isOpen: true,
          message: 'Todos los campos son requeridos para tickets',
        });
        return;
      }
      onSubmit({
        type: 'ticket',
        files: { file: ticketFile },
        responsable,
        motivo,
        descripcion,
        importe: Number(importe),
      });
    }
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPdfFile(null);
    setXmlFile(null);
    setTicketFile(null);
    setTipo('factura');
    setResponsable('');
    setMotivo('');
    setDescripcion('');
    setImporte('');
  };

  if (!open) return null;

  return (
    <>
      <div className='fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`bg-white rounded-lg p-6 w-full mx-4 shadow-xl ${
            tipo === 'ticket' ? 'max-w-lg' : 'max-w-2xl'
          }`}
        >
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-[#02082C]'>
              Agregar comprobación
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`text-gray-500 transition-colors ${
                isLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:text-gray-700'
              }`}
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          <div
            className={`grid gap-4 mb-6 ${
              tipo === 'ticket' ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                No. Solicitud
              </label>
              <input
                type='text'
                value={noSolicitud}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Sociedad
              </label>
              <input
                type='text'
                value={formatCompanyName(sociedad)}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Movimiento
              </label>
              <input
                type='text'
                value={movimiento.Sequence}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Fecha
              </label>
              <input
                type='text'
                value={new Date(movimiento.DueDate).toISOString().split('T')[0]}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tarjeta
              </label>
              <input
                type='text'
                value={movimiento.Memo}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Gasto Inicial
              </label>
              <input
                type='text'
                value={Number(movimiento.DebitAmount).toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descripción
              </label>
              <input
                type='text'
                value={movimiento.Reference}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50'
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tipo de comprobante
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F34602] focus:border-[#F34602]'
                value={tipo}
                onChange={e => setTipo(e.target.value)}
              >
                <option value='factura'>Factura</option>
                <option value='vale'>Vale/Ticket</option>
              </select>
            </div>

            {tipo === 'factura' ? (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Archivos de Factura (PDF y/o XML)
                </label>
                <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#F34602] transition-colors'>
                  <div className='space-y-1 text-center'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400'
                      stroke='currentColor'
                      fill='none'
                      viewBox='0 0 48 48'
                      aria-hidden='true'
                    >
                      <path
                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <div className='flex text-sm text-gray-600'>
                      <label
                        htmlFor='file-upload'
                        className='relative cursor-pointer bg-white rounded-md font-medium text-[#F34602] hover:text-[#d63d00] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#F34602]'
                      >
                        <span>Subir archivos</span>
                        <input
                          id='file-upload'
                          name='file-upload'
                          type='file'
                          accept='.pdf,.xml'
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              if (file.name.toLowerCase().endsWith('.pdf')) {
                                setPdfFile(file);
                              } else if (
                                file.name.toLowerCase().endsWith('.xml')
                              ) {
                                setXmlFile(file);
                              }
                            }
                          }}
                          className='sr-only'
                          required
                        />
                      </label>
                      <p className='pl-1'>o arrastrar y soltar</p>
                    </div>
                    <p className='text-xs text-gray-500'>
                      PDF y XML hasta 10MB cada uno
                    </p>
                  </div>
                </div>
                {(pdfFile || xmlFile) && (
                  <div className='mt-2 space-y-2'>
                    {pdfFile && (
                      <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md'>
                        <svg
                          className='h-5 w-5 text-[#F34602]'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                        <span>PDF: {pdfFile.name}</span>
                      </div>
                    )}
                    {xmlFile && (
                      <div className='flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md'>
                        <svg
                          className='h-5 w-5 text-[#F34602]'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                        <span>XML: {xmlFile.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Archivo del Ticket
                  </label>
                  <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#F34602] transition-colors'>
                    <div className='space-y-1 text-center'>
                      <svg
                        className='mx-auto h-12 w-12 text-gray-400'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'
                      >
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <div className='flex text-sm text-gray-600'>
                        <label
                          htmlFor='ticket-upload'
                          className='relative cursor-pointer bg-white rounded-md font-medium text-[#F34602] hover:text-[#d63d00] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#F34602]'
                        >
                          <span>Subir archivo</span>
                          <input
                            id='ticket-upload'
                            name='ticket-upload'
                            type='file'
                            accept='.pdf,.jpg,.jpeg,.png'
                            onChange={handleTicketChange}
                            className='sr-only'
                            required
                          />
                        </label>
                        <p className='pl-1'>o arrastrar y soltar</p>
                      </div>
                      <p className='text-xs text-gray-500'>
                        Imagen, PDF hasta 10MB
                      </p>
                    </div>
                  </div>
                  {ticketFile && (
                    <div className='mt-2 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md'>
                      <svg
                        className='h-5 w-5 text-[#F34602]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                      <span>{ticketFile.name}</span>
                    </div>
                  )}
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Responsable
                    </label>
                    <input
                      type='text'
                      value={responsable}
                      onChange={e => setResponsable(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F34602] focus:border-[#F34602]'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Motivo
                    </label>
                    <input
                      type='text'
                      value={motivo}
                      onChange={e => setMotivo(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F34602] focus:border-[#F34602]'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Descripción
                    </label>
                    <input
                      type='text'
                      value={descripcion}
                      onChange={e => setDescripcion(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F34602] focus:border-[#F34602]'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Importe
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      value={importe}
                      onChange={e => setImporte(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F34602] focus:border-[#F34602]'
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className='flex justify-end gap-4 mt-6'>
              <button
                type='button'
                onClick={onClose}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isLoading
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#F34602] hover:bg-[#F34602]/90'
                }`}
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
    </>
  );
}
