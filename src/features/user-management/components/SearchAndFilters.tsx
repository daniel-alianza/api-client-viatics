import type React from 'react';
import { useUserContext } from '../context/UserContext';
import { Search, Filter, Users } from 'lucide-react';

const SearchAndFilters: React.FC = () => {
  const { searchTerm, setSearchTerm, filterRole, setFilterRole, users } =
    useUserContext();

  return (
    <div className='bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-gradient-to-br from-[#F34602] to-[#02082C] rounded-lg flex items-center justify-center'>
              <Users className='w-5 h-5 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Gestión de Usuarios
              </h1>
              <p className='text-gray-600 text-sm'>
                {users.length} usuarios registrados
              </p>
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F34602]' />
            <input
              type='text'
              placeholder='Buscar usuarios...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300 w-full sm:w-64'
            />
          </div>

          <div className='relative'>
            <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F34602]' />
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className='pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-300 appearance-none bg-white w-full sm:w-56'
            >
              <option value=''>Todos los roles</option>
              <option value='admin'>Administrador</option>
              <option value='moderator'>Moderador</option>
              <option value='user'>Usuario</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
