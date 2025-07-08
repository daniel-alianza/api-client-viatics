import { useUserPermissions } from '../hooks/use-user-permissions';
import { InterfaceCard } from './interface-card';
import { PermissionStats } from './permission-stats';
import { UserSelector } from './user-selector';
import { useUserContext } from '../context/user-context';

export default function PermissionManager() {
  const { selectedUser } = useUserContext();
  const {
    interfaces,
    grantPermission,
    revokePermission,
    getAccessibleCount,
    getLockedCount,
  } = useUserPermissions();

  if (!selectedUser) {
    return (
      <div className='max-w-6xl mx-auto'>
        <UserSelector />
        <div className='text-center mt-8'>
          <div className='bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg p-8 shadow-sm'>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Select a User
            </h3>
            <p className='text-gray-600'>
              Choose a user from the dropdown above to view and manage their
              permissions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      <UserSelector />

      <div className='bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg p-4 mb-6 shadow-sm'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          Managing permissions for:{' '}
          <span style={{ color: '#F34602' }}>{selectedUser.name}</span>
        </h2>
        <p className='text-gray-600 text-sm'>
          {selectedUser.email} • {selectedUser.role}
        </p>
      </div>

      <PermissionStats
        accessible={getAccessibleCount()}
        locked={getLockedCount()}
        total={interfaces.length}
        userName={selectedUser.name}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {interfaces.map(interface_item => (
          <InterfaceCard
            key={interface_item.id}
            interface={interface_item}
            onTogglePermission={(id, hasAccess) =>
              hasAccess ? revokePermission(id) : grantPermission(id)
            }
          />
        ))}
      </div>
    </div>
  );
}
