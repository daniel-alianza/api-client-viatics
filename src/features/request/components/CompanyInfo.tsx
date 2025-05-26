import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, MapPin, Briefcase, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CompanyInfo() {
  const { user } = useAuth();

  const hasCardNumber = user?.cards?.[0]?.cardNumber;

  return (
    <div className='bg-white rounded-lg p-8'>
      <div className='flex items-center gap-2 mb-8'>
        <Building className='h-6 w-6 text-[#F34602]' />
        <h3 className='text-xl font-medium text-[#02082C]'>
          Información de su empresa
        </h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        <div className='space-y-2'>
          <Label
            htmlFor='company'
            className='text-sm font-medium text-slate-700'
          >
            Empresa
          </Label>
          <div className='relative'>
            <Input
              id='company'
              value={user?.company?.name || 'N/A'}
              readOnly
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                !hasCardNumber ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <Building className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          </div>
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='branch'
            className='text-sm font-medium text-slate-700'
          >
            Sucursal
          </Label>
          <div className='relative'>
            <Input
              id='branch'
              value={user?.branch?.name || 'N/A'}
              readOnly
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                !hasCardNumber ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='area' className='text-sm font-medium text-slate-700'>
            Area
          </Label>
          <div className='relative'>
            <Input
              id='area'
              value={user?.area?.name || 'N/A'}
              readOnly
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                !hasCardNumber ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <Briefcase className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          </div>
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='cardNumber'
            className='text-sm font-medium text-slate-700'
          >
            Numero de Tarjeta
          </Label>
          <div className='relative'>
            <Input
              id='cardNumber'
              value={user?.cards?.[0]?.cardNumber || 'N/A'}
              readOnly
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                !hasCardNumber ? 'border-red-500' : ''
              }`}
            />
            <CreditCard className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          </div>
          {!hasCardNumber && (
            <p className='text-sm text-red-500 mt-1'>
              No se encontró un número de tarjeta válido. Por favor, contacte al
              administrador.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
