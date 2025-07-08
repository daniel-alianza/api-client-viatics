import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, AlertCircle } from 'lucide-react';
import type { Movimiento } from '@/interfaces/movementInterface';
import ComprobacionModal from './ComprobacionModal';
import { motion } from 'framer-motion';
import { uploadComprobacion } from '@/services/comprobacionesService';
import { useAuth } from '@/context/AuthContext';

interface MovimientosAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  noSolicitud: string;
  sociedad: string;
  onComprobacionExitosa: () => void;
  movimientos?: Movimiento[];
  isLoading?: boolean;
  error?: string | null;
}

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
            Error al enviar comprobación
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

export default function MovimientosAccordion({
  isOpen,
  onToggle,
  noSolicitud,
  sociedad,
  onComprobacionExitosa,
  movimientos = [],
  isLoading = false,
  error = null,
}: MovimientosAccordionProps) {
  const { user } = useAuth();
  const [modalOpenIndex, setModalOpenIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: '',
  });

  // Función para manejar el toggle del acordeón
  const handleToggle = () => {
    // No permitir cerrar si está cargando o enviando
    if (isLoading || isSubmitting) {
      return;
    }
    onToggle();
  };

  const handleComprobacion = async (data: {
    type: 'factura' | 'ticket';
    files?: { pdf?: File; xml?: File; file?: File };
    description?: string;
    responsable?: string;
    motivo?: string;
    descripcion?: string;
    importe?: number;
  }) => {
    setIsSubmitting(true);
    try {
      const comprobacionId = Number(noSolicitud);
      if (isNaN(comprobacionId)) {
        throw new Error('El número de solicitud no es válido');
      }

      // Obtener el movimiento seleccionado
      const movimiento = movimientos[modalOpenIndex!];
      const movimientoData = {
        Sequence: movimiento.Sequence,
        DueDate: movimiento.DueDate,
        Reference: movimiento.Reference,
        AccountName: movimiento.AccountName,
        DebitAmount: movimiento.DebitAmount,
        Memo: movimiento.Memo,
        sequence: Number(movimiento.Sequence),
      };

      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      if (data.type === 'factura') {
        if (!data.files?.pdf && !data.files?.xml) {
          throw new Error(
            'Se requiere al menos un archivo (PDF o XML) para facturas',
          );
        }
        await uploadComprobacion(
          {
            comprobacionId,
            type: 'factura',
            pdf: data.files.pdf,
            xml: data.files.xml,
            description: data.description,
            ...movimientoData,
          },
          user.id,
        );
      } else {
        if (!data.files?.file) {
          throw new Error('Se requiere un archivo para el ticket');
        }
        if (
          !data.responsable ||
          !data.motivo ||
          !data.descripcion ||
          !data.importe
        ) {
          throw new Error('Todos los campos son requeridos para tickets');
        }
        await uploadComprobacion(
          {
            comprobacionId,
            type: 'ticket',
            file: data.files.file,
            responsable: data.responsable,
            motivo: data.motivo,
            descripcion: data.descripcion,
            importe: data.importe,
            ...movimientoData,
          },
          user.id,
        );
      }
      setModalOpenIndex(null);
      if (onComprobacionExitosa) onComprobacionExitosa();
    } catch (error) {
      setModalOpenIndex(null);
      setErrorModal({
        isOpen: true,
        message:
          error instanceof Error
            ? error.message
            : 'Error desconocido al enviar la comprobación',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='mt-4'>
        <button
          onClick={handleToggle}
          disabled={isLoading || isSubmitting}
          className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
            isLoading || isSubmitting
              ? 'bg-gray-100 cursor-not-allowed'
              : 'bg-[#02082C]/5 hover:bg-[#02082C]/10'
          }`}
        >
          <span className='font-medium text-[#02082C]'>
            Movimientos
            {isLoading && (
              <span className='ml-2 text-sm text-gray-500'>(Cargando...)</span>
            )}
            {isSubmitting && (
              <span className='ml-2 text-sm text-gray-500'>(Enviando...)</span>
            )}
          </span>
          {isOpen ? (
            <ChevronUp
              className={`h-5 w-5 ${
                isLoading || isSubmitting ? 'text-gray-400' : 'text-[#02082C]'
              }`}
            />
          ) : (
            <ChevronDown
              className={`h-5 w-5 ${
                isLoading || isSubmitting ? 'text-gray-400' : 'text-[#02082C]'
              }`}
            />
          )}
        </button>

        {isOpen && (
          <div className='mt-2 bg-white rounded-lg shadow-lg overflow-hidden'>
            {isLoading ? (
              <div className='p-4 text-center text-[#02082C]'>
                <div className='flex items-center justify-center space-x-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#F34602]'></div>
                  <span>Cargando movimientos...</span>
                </div>
              </div>
            ) : error ? (
              <div className='p-4 text-center text-red-500'>{error}</div>
            ) : movimientos.length === 0 ? (
              <div className='p-4 text-center text-[#02082C]'>
                No se encontraron movimientos
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-[#02082C] text-white'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                        Movimiento
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                        Fecha
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                        Descripcion
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                        Tarjeta
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'>
                        Gasto
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-bold uppercase tracking-wider'></th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map((movimiento, idx) => (
                      <tr
                        key={movimiento.Sequence}
                        className='hover:bg-[#F34602]/5'
                      >
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C] font-bold'>
                          {movimiento.Sequence}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                          {
                            new Date(movimiento.DueDate)
                              .toISOString()
                              .split('T')[0]
                          }
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                          {movimiento.Reference}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-[#02082C]/80'>
                          {movimiento.Memo}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-[#F34602] font-medium'>
                          {Number(movimiento.DebitAmount).toLocaleString(
                            'es-MX',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm'>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='group relative px-4 py-2 bg-[#02082C] text-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#F34602] hover:shadow-lg cursor-pointer'
                            onClick={() => setModalOpenIndex(idx)}
                            type='button'
                          >
                            <span className='relative z-10 flex items-center gap-2'>
                              <FileText className='w-4 h-4 transition-transform duration-300 group-hover:rotate-12' />
                              Agregar comprobación
                            </span>
                            <motion.div
                              className='absolute inset-0 bg-[#F34602]'
                              initial={{ x: '-100%' }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                          <ComprobacionModal
                            open={modalOpenIndex === idx}
                            onClose={() => setModalOpenIndex(null)}
                            onSubmit={handleComprobacion}
                            movimiento={{
                              ...movimiento,
                              Sequence: movimiento.Sequence.toString(),
                              DueDate: new Date(
                                movimiento.DueDate,
                              ).toISOString(),
                            }}
                            noSolicitud={noSolicitud}
                            sociedad={sociedad}
                            isLoading={isLoading || isSubmitting}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
    </>
  );
}
