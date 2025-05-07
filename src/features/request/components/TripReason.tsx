import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';

interface TripReasonProps {
  travelReason: string;
  setTravelReason: (reason: string) => void;
  disabled?: boolean;
}

export default function TripReason({
  travelReason,
  setTravelReason,
  disabled = false,
}: TripReasonProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 mb-2'>
        <Briefcase className='h-5 w-5 text-[#F34602]' />
        <Label
          htmlFor='reason'
          className='text-lg font-medium'
          style={{ color: '#02082C' }}
        >
          Motivo del Viaje
        </Label>
      </div>
      <Textarea
        id='reason'
        placeholder='Describe detalladamente el proposito de tu viaje...'
        className={`min-h-[100px] transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md resize-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        value={travelReason}
        onChange={e => !disabled && setTravelReason(e.target.value)}
        maxLength={40}
        disabled={disabled}
      />
      {travelReason.length >= 40 && (
        <div className='flex items-center gap-2 text-red-500 text-sm mt-2'>
          <span className='inline-flex items-center'>
            Has alcanzado el límite máximo de 40 caracteres
          </span>
        </div>
      )}
    </div>
  );
}
