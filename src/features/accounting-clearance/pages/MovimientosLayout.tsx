import { ComprobacionesTable } from '../components/MovementTable';
import { ErrorAlert } from '../components/ErrorAlert';
import { Spinner } from '../components/Spinner';
import { useComprobaciones } from '../hooks/useComprobaciones';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const MovimientosLayout = () => {
  const { comprobaciones, xmlDataMap, options, isLoading, error } =
    useComprobaciones();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className='min-h-screen bg-white overflow-hidden'>
      {/* Fondo decorativo opcional, igual que en page.tsx */}
      <div className='fixed top-0 right-0 w-[600px] h-[600px] bg-[#F34602]/5 rounded-full -mr-[300px] -mt-[300px] blur-3xl' />
      <div className='fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#02082C]/5 rounded-full -ml-[200px] -mb-[200px] blur-3xl' />

      {/* Header con botón de regreso */}
      <header className='relative z-10 px-8 py-6 flex items-center bg-white shadow-sm'>
        <div className='flex items-center'>
          <div
            className='relative w-12 h-12 cursor-pointer group'
            onClick={() => navigate('/accounting-clearance/page')}
          >
            <div className='absolute inset-0 flex items-center justify-center'>
              <ArrowLeft
                className='h-8 w-8 text-[#02082C] transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1'
                strokeWidth={2}
              />
            </div>
          </div>
          <h1 className='ml-3 text-2xl font-bold text-[#02082C]'>
            Portal Grupo FG
          </h1>
        </div>
      </header>

      <main className='container mx-auto p-6'>
        <h1 className='text-2xl font-bold text-[#02082C] mb-6'>
          Comprobaciones de Viáticos
        </h1>
        <ComprobacionesTable
          comprobaciones={comprobaciones}
          xmlDataMap={xmlDataMap}
          options={options}
        />
      </main>
    </div>
  );
};
