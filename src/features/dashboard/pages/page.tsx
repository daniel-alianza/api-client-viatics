import { useMenu } from '@/features/dashboard/hooks/useMenu';
import MainContent from '@/features/dashboard/components/MainContent';
import { DetailPanel } from '@/features/dashboard/components/ui/DetailPanel';
import { LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const { selectedOption, handleSubOptionClick, closePanel } = useMenu();

  const { setUser, user } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  // Solo mostrar el icono de settings si es admin
  const isAdmin =
    user && (user.roleId === 1 || user.email === 'admin@alianzaelectrica.com');

  const handleSettingsClick = () => {
    setShowDropdown(prev => !prev);
  };

  const handleGestionarUsuarios = () => {
    setShowDropdown(false);
    navigate('/user-management/page');
  };

  const handleGestionarPermisos = () => {
    setShowDropdown(false);
    navigate('/permissions/page');
  };

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <header className='px-8 py-6 flex justify-between items-center bg-white shadow-sm'>
        <div className='flex items-center'>
          <div className='relative w-12 h-12'>
            <div className='absolute inset-0  rounded-lg rotate-45 transform origin-center shadow-lg' />
            <div className='absolute inset-0 flex items-center justify-center text-white font-bold text-xl'>
              <img
                src='./GrupoFG_Logo.png'
                alt='logo'
                width={120}
                height={120}
              />
            </div>
          </div>
          <h1 className='ml-3 text-2xl font-bold text-[#02082C]'>
            Portal Grupo FG{' '}
          </h1>
        </div>

        <div className='flex items-center space-x-6'>
          {isAdmin && (
            <div className='relative' ref={dropdownRef}>
              <motion.button
                className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-[#02082C] hover:bg-gray-300 transition-colors focus:outline-none cursor-pointer'
                onClick={handleSettingsClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label='Configuración'
              >
                <Settings className='w-6 h-6' />
              </motion.button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[999]'
                  >
                    <div className='flex flex-col'>
                      <button
                        className='w-full text-left px-6 py-3 hover:bg-gray-100 text-sm rounded-t-lg cursor-pointer'
                        onClick={() => {
                          handleGestionarPermisos();
                        }}
                      >
                        Gestionar permisos
                      </button>
                      <div className='border-t border-gray-100'></div>
                      <button
                        className='w-full text-left px-6 py-3 hover:bg-gray-100 text-sm rounded-b-lg cursor-pointer'
                        onClick={handleGestionarUsuarios}
                      >
                        Gestionar usuarios
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <motion.button
            className='flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#F34602] text-white hover:bg-[#F34602]/90 transition-colors'
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className='w-5 h-5' />
            <span>Cerrar Sesión</span>
          </motion.button>
        </div>
      </header>

      {/* Main content */}
      <MainContent />

      <DetailPanel
        selectedOption={selectedOption}
        closePanel={closePanel}
        handleSubOptionClick={handleSubOptionClick}
      />
    </div>
  );
}
