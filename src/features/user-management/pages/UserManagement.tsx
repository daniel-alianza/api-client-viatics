import type React from 'react';
import { UserProvider } from '../context/UserContext';
import SearchAndFilters from '../components/SearchAndFilters';
import UserList from '../components/UserList';
import UserModal from '../components/UserModal';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastProvider } from '../components/ToastProvider';
import { Toaster } from '../components/toast';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  return (
    <ToastProvider>
      <UserProvider>
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
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
          <div className='container mx-auto px-4 py-8'>
            <SearchAndFilters />
            <UserList />
            <UserModal />
          </div>
          <Toaster />
        </div>
      </UserProvider>
    </ToastProvider>
  );
};

export default UserManagement;
