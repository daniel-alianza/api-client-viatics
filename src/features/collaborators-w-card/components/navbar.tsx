import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className='w-full bg-white shadow-sm flex items-center px-8 py-6'>
      <div
        className='relative w-12 h-12 cursor-pointer group flex-shrink-0'
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
        Portal Grupo FG
      </h1>
    </header>
  );
}

export default Navbar;
