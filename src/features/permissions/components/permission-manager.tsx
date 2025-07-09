import {
  useUserPermissions,
  MODULES_BY_CATEGORY,
} from '../hooks/use-user-permissions';
import { InterfaceCard } from './interface-card';
import { PermissionStats } from './permission-stats';
import { UserSelector } from './user-selector';
import { useUserContext } from '../context/user-context';

function isRoleObject(role: any): role is { name: string } {
  return (
    typeof role === 'object' &&
    role !== null &&
    'name' in role &&
    typeof (role as any).name === 'string'
  );
}

export default function PermissionManager() {
  const { selectedUser } = useUserContext();
  const {
    interfaces,
    grantPermission,
    revokePermission,
    getAccessibleCount,
    getLockedCount,
    PERMISOS_PREDETERMINADOS,
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

  // Manejo seguro del nombre y rol
  const userName =
    typeof selectedUser.name === 'string' ? selectedUser.name : 'Sin nombre';
  const userEmail =
    typeof selectedUser.email === 'string' ? selectedUser.email : '';
  let userRole = 'Desconocido';
  if (typeof selectedUser.role === 'string') {
    userRole = selectedUser.role;
  } else if (isRoleObject(selectedUser.role)) {
    const roleObj = selectedUser.role as { name: string };
    userRole = roleObj.name;
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      <UserSelector />

      <div className='bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg p-4 mb-6 shadow-sm'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          Managing permissions for:{' '}
          <span style={{ color: '#F34602' }}>{userName}</span>
        </h2>
        <p className='text-gray-600 text-sm'>
          {userEmail} • {userRole}
        </p>
      </div>

      <PermissionStats
        accessible={getAccessibleCount()}
        locked={getLockedCount()}
        total={interfaces.length}
        userName={userName}
      />

      {/* Accesos predeterminados */}
      <div className='mb-8'>
        <h3 className='text-lg font-bold text-gray-700 mb-2'>
          Accesos predeterminados
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {interfaces
            .filter(i => PERMISOS_PREDETERMINADOS.includes(i.id))
            .map(interface_item => (
              <InterfaceCard
                key={interface_item.id}
                interface={interface_item}
                onTogglePermission={() => {}}
                PERMISOS_PREDETERMINADOS={PERMISOS_PREDETERMINADOS}
              />
            ))}
        </div>
      </div>

      {/* Accesos configurables por categoría */}
      {MODULES_BY_CATEGORY.map(grupo => (
        <div key={grupo.categoria} className='mb-8'>
          <h3 className='text-lg font-bold text-gray-700 mb-2'>
            {grupo.categoria}
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {grupo.modulos.map(modulo => {
              const interface_item = interfaces.find(i => i.id === modulo.id);
              if (!interface_item) return null;
              return (
                <InterfaceCard
                  key={interface_item.id}
                  interface={interface_item}
                  onTogglePermission={(id, hasAccess) =>
                    hasAccess ? revokePermission(id) : grantPermission(id)
                  }
                  PERMISOS_PREDETERMINADOS={PERMISOS_PREDETERMINADOS}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
