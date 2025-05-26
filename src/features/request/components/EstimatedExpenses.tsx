import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Car,
  Home,
  Coffee,
  Package,
  DollarSign,
  Mail,
  HelpCircle,
  MapPin,
  Wrench,
} from 'lucide-react';
import type { TravelExpenses } from '../interfaces/solicitud.types';

interface EstimatedExpensesProps {
  updateExpense: (key: keyof TravelExpenses, value: string) => void;
  totalExpenses: number;
  disabled?: boolean;
}

export default function EstimatedExpenses({
  updateExpense,
  totalExpenses,
  disabled = false,
}: EstimatedExpensesProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2 mb-4'>
        <DollarSign className='h-5 w-5 text-[#F34602]' />
        <h3 className='text-lg font-medium' style={{ color: '#02082C' }}>
          Gastos Estimados
        </h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='space-y-2'>
          <Label
            htmlFor='transportation'
            className='text-sm font-medium text-slate-700'
          >
            Transporte
          </Label>
          <div className='relative'>
            <Input
              id='transportation'
              type='number'
              placeholder='0.00'
              min='0'
              step='0.01'
              onChange={e =>
                !disabled && updateExpense('transportation', e.target.value)
              }
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            />
            <Car className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
              $
            </span>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='tolls' className='text-sm font-medium text-slate-700'>
            Peajes
          </Label>
          <div className='relative'>
            <Input
              id='tolls'
              type='number'
              placeholder='0.00'
              min='0'
              step='0.01'
              onChange={e =>
                !disabled && updateExpense('tolls', e.target.value)
              }
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            />
            <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
              $
            </span>
          </div>
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='lodging'
            className='text-sm font-medium text-slate-700'
          >
            Hospedaje
          </Label>
          <div className='relative'>
            <Input
              id='lodging'
              type='number'
              placeholder='0.00'
              min='0'
              step='0.01'
              onChange={e =>
                !disabled && updateExpense('lodging', e.target.value)
              }
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            />
            <Home className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
              $
            </span>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='food' className='text-sm font-medium text-slate-700'>
            Alimentos
          </Label>
          <div className='relative'>
            <Input
              id='food'
              type='number'
              placeholder='0.00'
              min='0'
              step='0.01'
              onChange={e => !disabled && updateExpense('food', e.target.value)}
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            />
            <Coffee className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
              $
            </span>
          </div>
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='freight'
            className='text-sm font-medium text-slate-700'
          >
            Fletes
          </Label>
          <div className='relative'>
            <Input
              id='freight'
              type='number'
              placeholder='0.00'
              min='0'
              step='0.01'
              onChange={e =>
                !disabled && updateExpense('freight', e.target.value)
              }
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            />
            <Package className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
              $
            </span>
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='tools' className='text-sm font-medium text-slate-700'>
            Herramientas
          </Label>
          <div className='relative'>
            <Input
              id='tools'
              type='number'
              placeholder='0.00'
              min='0'
              step='0.01'
              onChange={e =>
                !disabled && updateExpense('tools', e.target.value)
              }
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            />
            <Wrench className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
              $
            </span>
          </div>
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='shipping'
            className='text-sm font-medium text-slate-700'
          >
            Envíos / Mensajería
          </Label>
          <div className='relative'>
            <Input
              id='shipping'
              type='number'
              placeholder='0.00'
              min='0'
              step='0.01'
              onChange={e =>
                !disabled && updateExpense('shipping', e.target.value)
              }
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            />
            <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
              $
            </span>
          </div>
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='miscellaneous'
            className='text-sm font-medium text-slate-700'
          >
            Misceláneos
          </Label>
          <div className='relative'>
            <Input
              id='miscellaneous'
              type='number'
              placeholder='0.00'
              min='0'
              step='0.01'
              onChange={e =>
                !disabled && updateExpense('miscellaneous', e.target.value)
              }
              className={`pl-10 transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={disabled}
            />
            <HelpCircle className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
              $
            </span>
          </div>
        </div>
      </div>
      <div className='flex justify-end mt-4'>
        <div className='text-right'>
          <p className='text-sm text-slate-600'>Total Estimado</p>
          <p className='text-2xl font-bold text-[#F34602]'>
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
