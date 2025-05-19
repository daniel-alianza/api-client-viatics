import React, { useRef, useState } from 'react';

interface ComprobacionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File, tipo: string) => void;
}

export default function ComprobacionModal({
  open,
  onClose,
  onSubmit,
}: ComprobacionModalProps) {
  const [tipo, setTipo] = useState('Factura');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit(file, tipo);
      setFile(null);
      setTipo('Factura');
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg'>
        <h2 className='text-xl font-bold mb-4'>Agregar comprobación</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block mb-1 font-medium'>
              Tipo de comprobante
            </label>
            <select
              className='w-full border rounded px-3 py-2'
              value={tipo}
              onChange={e => setTipo(e.target.value)}
            >
              <option value='Factura'>Factura</option>
              <option value='Ticket'>Ticket</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block mb-1 font-medium'>
              Archivo (PDF o XML)
            </label>
            <input
              type='file'
              accept='.pdf,.xml'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='w-full'
              required
            />
            {file && (
              <p className='text-sm mt-1 text-gray-600'>
                Archivo seleccionado: {file.name}
              </p>
            )}
          </div>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-[#287492] text-white hover:bg-[#1d4e6c]'
              disabled={!file}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
