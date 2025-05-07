import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target } from 'lucide-react';

interface TripObjectivesProps {
  travelObjectives: string;
  setTravelObjectives: (objectives: string) => void;
  disabled?: boolean;
}

export default function TripObjectives({
  travelObjectives,
  setTravelObjectives,
  disabled = false,
}: TripObjectivesProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 mb-2'>
        <Target className='h-5 w-5 text-[#F34602]' />
        <Label
          htmlFor='objectives'
          className='text-lg font-medium'
          style={{ color: '#02082C' }}
        >
          Objetivos del Viaje
        </Label>
      </div>
      <Textarea
        id='objectives'
        placeholder='Describe los objetivos específicos de tu viaje...'
        className={`min-h-[100px] transition-all duration-200 border-slate-300 focus:border-[#F34602] focus:ring-[#F34602]/20 rounded-md resize-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        value={travelObjectives}
        onChange={e => !disabled && setTravelObjectives(e.target.value)}
        maxLength={200}
        disabled={disabled}
      />
      {travelObjectives.length >= 200 && (
        <div className='flex items-center gap-2 text-red-500 text-sm mt-2'>
          <span className='inline-flex items-center'>
            Has alcanzado el límite máximo de 200 caracteres
          </span>
        </div>
      )}
    </div>
  );
}
