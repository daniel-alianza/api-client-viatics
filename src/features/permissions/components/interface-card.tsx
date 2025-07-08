import type React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Lock, Unlock } from 'lucide-react';
import type { Interface } from '../interfaces/types';

interface InterfaceCardProps {
  interface: Interface;
  onTogglePermission: (id: string, hasAccess: boolean) => void;
  PERMISOS_PREDETERMINADOS?: string[];
}

export function InterfaceCard({
  interface: interface_item,
  onTogglePermission,
  PERMISOS_PREDETERMINADOS = [
    'dashboard',
    'crear-solicitud',
    'comprobar-solicitud',
  ],
}: InterfaceCardProps) {
  const handleToggle = () => {
    onTogglePermission(interface_item.id, interface_item.hasAccess);
  };

  const isDefault = PERMISOS_PREDETERMINADOS.includes(interface_item.id);

  return (
    <Card
      className={`transition-all duration-300 hover:scale-105 border-2 ${
        interface_item.hasAccess
          ? 'bg-gradient-to-br from-orange-50 to-orange-100'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
      style={{
        borderColor: interface_item.hasAccess ? '#F34602' : 'rgba(2,8,44,0.2)',
      }}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div
              className='p-2 rounded-lg'
              style={{
                backgroundColor: interface_item.hasAccess
                  ? '#F34602'
                  : '#02082C',
                color: 'white',
              }}
            >
              <interface_item.icon className='w-4 h-4' />
            </div>
            <div className='flex items-center space-x-2'>
              {interface_item.hasAccess ? (
                <Unlock className='w-4 h-4 text-orange-600' />
              ) : (
                <Lock className='w-4 h-4' style={{ color: '#02082C' }} />
              )}
            </div>
          </div>
          <Switch
            checked={interface_item.hasAccess}
            onCheckedChange={handleToggle}
            disabled={isDefault}
            style={
              {
                '--switch-thumb': interface_item.hasAccess
                  ? '#F34602'
                  : '#02082C',
              } as React.CSSProperties
            }
          />
        </div>
        <CardTitle
          className={`text-lg ${
            interface_item.hasAccess ? 'text-orange-800' : 'text-gray-800'
          }`}
        >
          {interface_item.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-sm mb-3 ${
            interface_item.hasAccess ? 'text-orange-700' : 'text-gray-600'
          }`}
        >
          {interface_item.description}
        </p>
        <div className='flex items-center justify-between'>
          <Badge
            className={
              interface_item.hasAccess
                ? 'bg-orange-100 text-orange-800'
                : 'text-white'
            }
            style={
              !interface_item.hasAccess ? { backgroundColor: '#02082C' } : {}
            }
          >
            {interface_item.hasAccess ? 'Accesible' : 'Bloqueado'}
          </Badge>
          <span
            className={`text-xs ${
              interface_item.hasAccess ? 'text-orange-600' : 'text-gray-500'
            }`}
          >
            {interface_item.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
