import type React from 'react';
import type { User } from '../interfaces/User';
import { useUserContext } from '../context/UserContext';
import { Edit, Trash2, UserIcon, Mail, Phone, Building } from 'lucide-react';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { selectUser, setModalOpen, deleteUser } = useUserContext();

  const handleEdit = () => {
    selectUser(user);
    setModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUser(user.id);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-[#F34602] text-white';
      case 'moderator':
        return 'bg-[#02082C] text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group'>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <div className='w-12 h-12 bg-gradient-to-r from-[#F34602] to-[#02082C] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110'>
                <UserIcon className='w-6 h-6 text-white' />
              </div>
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 text-lg group-hover:text-[#F34602] transition-colors duration-300'>
                {user.name}
              </h3>
              <div className='flex items-center space-x-2 mt-1'>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getRoleColor(
                    String(user.role?.name || user.role),
                  )}`}
                >
                  {String(user.role?.name || user.role)}
                </span>
              </div>
            </div>
          </div>
          <div className='flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <button
              onClick={handleEdit}
              className='p-2 text-gray-400 hover:text-[#F34602] hover:bg-[#F34602]/10 rounded-lg transition-all duration-300 hover:rotate-12'
            >
              <Edit className='w-4 h-4' />
            </button>
            <button
              onClick={handleDelete}
              className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:rotate-12'
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        </div>

        <div className='space-y-2 text-sm text-gray-600'>
          <div className='flex items-center space-x-2'>
            <Mail className='w-4 h-4 text-[#F34602]' />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className='flex items-center space-x-2'>
              <Phone className='w-4 h-4 text-[#F34602]' />
              <span>{user.phone}</span>
            </div>
          )}
          {user.department && (
            <div className='flex items-center space-x-2'>
              <Building className='w-4 h-4 text-[#F34602]' />
              <span>{user.department}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
