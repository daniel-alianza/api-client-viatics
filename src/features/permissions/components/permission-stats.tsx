import type React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Eye, Lock, Shield } from 'lucide-react';

interface PermissionStatsProps {
  accessible: number;
  locked: number;
  total: number;
  userName?: string;
}

export function PermissionStats({
  accessible,
  locked,
  total,
  userName,
}: PermissionStatsProps) {
  const accessPercentage = (accessible / total) * 100;

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
      <Card className='bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-orange-800'>
            {userName ? `${userName}'s Access` : 'Accessible'}
          </CardTitle>
          <Eye className='h-4 w-4 text-orange-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-orange-900'>{accessible}</div>
          <p className='text-xs text-orange-600'>interfaces available</p>
        </CardContent>
      </Card>

      <Card
        className='bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
        style={{
          background: `linear-gradient(135deg, rgba(2,8,44,0.05) 0%, rgba(2,8,44,0.1) 100%)`,
          borderColor: 'rgba(2,8,44,0.2)',
        }}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle
            className='text-sm font-medium'
            style={{ color: '#02082C' }}
          >
            Restricted
          </CardTitle>
          <Lock className='h-4 w-4' style={{ color: '#02082C' }} />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold' style={{ color: '#02082C' }}>
            {locked}
          </div>
          <p className='text-xs' style={{ color: '#02082C', opacity: 0.7 }}>
            interfaces locked
          </p>
        </CardContent>
      </Card>

      <Card className='bg-gradient-to-br from-orange-50 via-orange-50 to-blue-50 border-orange-200'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-orange-800'>
            Access Level
          </CardTitle>
          <Shield className='h-4 w-4 text-orange-600' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-orange-900'>
            {Math.round(accessPercentage)}%
          </div>
          <Progress
            value={accessPercentage}
            className='mt-2'
            style={
              {
                '--progress-background': '#F34602',
              } as React.CSSProperties
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
