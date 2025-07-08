import type React from 'react';
import { useUserContext } from '../context/UserContext';
import UserCard from './UserCard';
import LoadingSpinner from './LoadingSpinner';
import { Users } from 'lucide-react';

const UserList: React.FC = () => {
  const { users, isLoading, searchTerm, filterRole } = useUserContext();

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role.name === filterRole;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (filteredUsers.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100'>
        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Users className='w-8 h-8 text-gray-400' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          {searchTerm || filterRole
            ? 'No se encontraron usuarios'
            : 'No hay usuarios registrados'}
        </h3>
        <p className='text-gray-600'>
          {searchTerm || filterRole
            ? 'Intenta ajustar los filtros de búsqueda'
            : 'Comienza agregando tu primer usuario'}
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {filteredUsers.map((user, index) => (
        <div
          key={user.id}
          className='animate-in slide-in-from-bottom-4 duration-300'
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
};

export default UserList;
