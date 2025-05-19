import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ComprobacionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    file: File,
    tipo: string,
    data?: {
      responsable: string;
      motivo: string;
      descripcion: string;
      importe: string;
    },
  ) => void;
  movimiento: {
    Sequence: string;
    DueDate: string;
    Ref: string;
    Memo: string;
    DebAmount: number;
  };
  noSolicitud: string;
  sociedad: string;
}

export default function ComprobacionModal({
  open,
  onClose,
  onSubmit,
  movimiento,
  noSolicitud,
  sociedad,
}: ComprobacionModalProps) {
  const [tipo, setTipo] = useState('factura');
  const [file, setFile] = useState<File | null>(null);
  const [responsable, setResponsable] = useState('');
  const [motivo, setMotivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [importe, setImporte] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      if (tipo === 'factura') {
        onSubmit(file, tipo);
      } else {
        onSubmit(file, tipo, {
          responsable,
          motivo,
          descripcion,
          importe,
        });
      }
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFile(null);
    setTipo('factura');
    setResponsable('');
    setMotivo('');
    setDescripcion('');
    setImporte('');
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className='bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl'
      >
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-[#02082C]'>
            Agregar comprobación
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-6'>
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
              value={Number(movimiento.DebAmount).toLocaleString('es-MX', {
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
              value={movimiento.Ref}
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

          {tipo === 'vale' && (
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
                  value={importe}
                  onChange={e => setImporte(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#F34602] focus:border-[#F34602]'
                  required
                  step='0.01'
                />
              </div>
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Archivo {tipo === 'factura' ? '(PDF o XML)' : '(Imagen, PDF)'}
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
                    <span>Subir archivo</span>
                    <input
                      id='file-upload'
                      name='file-upload'
                      type='file'
                      accept={
                        tipo === 'factura'
                          ? '.pdf,.xml'
                          : '.pdf,.jpg,.jpeg,.png'
                      }
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className='sr-only'
                      required
                    />
                  </label>
                  <p className='pl-1'>o arrastrar y soltar</p>
                </div>
                <p className='text-xs text-gray-500'>
                  {tipo === 'factura'
                    ? 'PDF o XML hasta 10MB'
                    : 'Imagen, PDF hasta 10MB'}
                </p>
              </div>
            </div>
            {file && (
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
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <div className='flex justify-end gap-2 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded-md bg-[#F34602] text-white hover:bg-[#d63d00] transition-colors'
              disabled={
                !file ||
                (tipo === 'vale' &&
                  (!responsable || !motivo || !descripcion || !importe))
              }
            >
              Guardar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
