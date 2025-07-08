import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUserContext } from '../context/user-context';
import { User } from 'lucide-react';

export function UserSelector() {
  const { users, selectedUser, setSelectedUser } = useUserContext();

  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-white';
      case 'manager':
        return 'bg-orange-100 text-orange-800';
      case 'developer':
        return 'bg-blue-100 text-blue-800';
      case 'analyst':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBgColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return { backgroundColor: '#02082C' };
      case 'manager':
        return {};
      case 'developer':
        return {};
      case 'analyst':
        return {};
      default:
        return {};
    }
  };

  return (
    <Card className='mb-6 bg-white/70 backdrop-blur-sm border-gray-200/50 shadow-lg'>
      <CardContent className='p-6'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <User className='w-5 h-5 text-gray-700' />
            <label className='text-gray-800 font-medium'>
              Seleccionar usuario:
            </label>
          </div>

          <div className='flex-1 max-w-md'>
            <Select
              value={selectedUser?.id || ''}
              onValueChange={handleUserSelect}
            >
              <SelectTrigger className='bg-white/80 border-gray-300/60 text-gray-800 shadow-sm backdrop-blur-sm'>
                <SelectValue placeholder='Elige un usuario para gestionar permisos' />
              </SelectTrigger>
              <SelectContent className='bg-white/95 border-gray-200/60 shadow-lg backdrop-blur-sm'>
                {users.map(user => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    className='text-gray-800 hover:bg-gray-50/80'
                  >
                    <div className='flex items-center space-x-3'>
                      <Avatar className='w-6 h-6'>
                        <AvatarFallback className='text-xs bg-gray-100 text-gray-700'>
                          {user.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{user.name}</span>
                        <span className='text-xs text-gray-500'>
                          {user.email}
                        </span>
                      </div>
                      <Badge
                        className={getRoleColor(user.role)}
                        style={getRoleBgColor(user.role)}
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUser && (
            <div className='flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50'>
              <Avatar>
                <AvatarFallback
                  style={{ backgroundColor: '#F34602', color: 'white' }}
                >
                  {selectedUser.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='text-gray-800 font-medium'>{selectedUser.name}</p>
                <p className='text-gray-600 text-sm'>{selectedUser.role}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
