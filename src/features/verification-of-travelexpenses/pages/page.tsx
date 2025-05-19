import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainContent from '../components/MainContent';
function Page() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-white overflow-hidden'>
      {/* Decorative background elements */}
      <div className='fixed top-0 right-0 w-[600px] h-[600px] bg-[#F34602]/5 rounded-full -mr-[300px] -mt-[300px] blur-3xl' />
      <div className='fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#02082C]/5 rounded-full -ml-[200px] -mb-[200px] blur-3xl' />

      {/* Header */}
      <header className='relative z-10 px-8 py-6 flex justify-between items-center bg-white shadow-sm'>
        <div className='flex items-center'>
          <div
            className='relative w-12 h-12 cursor-pointer group'
            onClick={() => navigate('/dashboard')}
          >
            <div className='absolute inset-0 flex items-center justify-center'>
              <ArrowLeft
                className='h-8 w-8 text-[#02082C] transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1'
                strokeWidth={2}
              />
            </div>
          </div>
          <h1 className='ml-3 text-2xl font-bold text-[#02082C]'>
            Portal Grupo FG{' '}
          </h1>
        </div>
      </header>

      {/* Main content para incluir la tabla de verificacion de gastos de viaje */}
      <MainContent />
    </div>
  );
}

export default Page;
