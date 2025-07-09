import { motion } from 'framer-motion';
import { Eye, CheckCircle } from 'lucide-react';
import { useCompTable } from '../hooks/useCompTable';
import { Currency } from '../hooks/useCurrency';
import { ViaticoModal } from './ViaticoModal';

export const ComprobacionesTable = () => {
  const {
    viaticos,
    isLoading,
    error,
    selected,
    collaborator,
    modalOpen,
    openModal,
    handleRedirect,
    closeModal,
  } = useCompTable();

  if (isLoading)
    return (
      <div className='h-64 flex justify-center items-center'>
        <div className='animate-spin h-12 w-12 border-t-2 border-b-2 border-[#F34602] rounded-full'></div>
      </div>
    );

  if (error)
    return (
      <div className='bg-red-50 border text-red-700 px-4 py-3 rounded'>
        {error}
      </div>
    );

  if (!viaticos.length)
    return (
      <div className='bg-yellow-50 border text-yellow-700 px-4 py-3 rounded'>
        No hay viáticos dispersados.
      </div>
    );

  return (
    <>
      <motion.div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-[#02082C] text-white text-xs uppercase tracking-wider'>
              <tr>
                {[
                  'Solicitante',
                  'Compañía',
                  'Motivo',
                  'Cantidad',
                  'Acciones',
                ].map(h => (
                  <th key={h} className='px-6 py-4 text-left'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {viaticos.map(v => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='hover:bg-gray-50'
                >
                  <td className='px-6 py-4'>{v.requestor}</td>
                  <td className='px-6 py-4'>{v.company}</td>
                  <td className='px-6 py-4 truncate max-w-xs' title={v.reason}>
                    {v.reason}
                  </td>
                  <td className='px-6 py-4'>{Currency(v.totalAmount)}</td>
                  <td className='px-6 py-4 text-center'>
                    <div className='flex justify-center gap-2'>
                      <button
                        onClick={() => openModal(v)}
                        title='Visualizar viático'
                        className='p-2 rounded-full hover:bg-[#02082C]/10'
                      >
                        <Eye className='w-5 h-5 text-[#F34602]' />
                      </button>
                      <button
                        onClick={() => handleRedirect(v.id)}
                        title='Verificar movimientos'
                        className='px-3 py-2 rounded-lg hover:bg-[#02082C]/10 text-green-600 text-sm font-medium flex items-center gap-2'
                      >
                        <CheckCircle className='w-5 h-5' />
                        Revisar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {modalOpen && selected && (
        <ViaticoModal
          viatico={selected}
          collaborator={collaborator}
          onClose={closeModal}
        />
      )}
    </>
  );
};
