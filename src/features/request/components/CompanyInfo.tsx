import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, MapPin, Briefcase, CreditCard } from 'lucide-react';
import { useSolicitudContext } from '../context/SolicitudContext';
import { useEffect } from 'react';

export default function CompanyInfo() {
  const { userRequestData, fetchUserRequestData } = useSolicitudContext();

  useEffect(() => {
    if (!userRequestData) {
      fetchUserRequestData();
    }
  }, [userRequestData]);

  const hasCardNumber =
    userRequestData?.cardNumber && userRequestData.cardNumber !== 'N/A';

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Building className='h-5 w-5 text-[#F34602]' />
        <h3 className='text-lg font-medium' style={{ color: '#02082C' }}>
          Información de su empresa
        </h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
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
              value={userRequestData?.companyName || ''}
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
              value={userRequestData?.branchName || ''}
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
              value={userRequestData?.areaName || ''}
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
              value={userRequestData?.cardNumber || ''}
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
