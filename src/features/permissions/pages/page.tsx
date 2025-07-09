import PermissionManager from '../components/permission-manager';
import { UserProvider } from '../context/user-context';
import { AnimatedBackground } from '../components/animated-background';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <UserProvider>
      <div className='min-h-screen relative bg-gray-50'>
        <AnimatedBackground />

        {/* Header con navbar de regreso */}
        <header className='relative z-10 px-8 py-6 flex items-center bg-white shadow-sm'>
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
              Portal Grupo FG
            </h1>
          </div>
        </header>

        <div className='relative z-10 container mx-auto px-4 py-8'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm'>
              User Permission Manager
            </h1>
            <p className='text-gray-600 drop-shadow-sm'>
              Select a user and manage their interface permissions
            </p>
          </div>
          <PermissionManager />
        </div>
      </div>
    </UserProvider>
  );
}
