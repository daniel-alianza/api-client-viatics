import { Label } from '@/components/ui/label';
import { Target, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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
  // Convertir el string a array de objetivos
  const [objectives, setObjectives] = useState<string[]>(() => {
    const arr = travelObjectives
      ? travelObjectives.split('\n').filter(obj => obj.trim() !== '')
      : [];
    return arr.length >= 3 ? arr : Array(3).fill('');
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mantener sincronizado el estado externo
  useEffect(() => {
    setTravelObjectives(
      objectives
        .map((obj, idx) => (obj.trim() ? `${idx + 1}.- ${obj}` : ''))
        .filter(obj => obj !== '')
        .join('\n'),
    );
  }, [objectives, setTravelObjectives]);

  const handleChange = (idx: number, value: string) => {
    // Eliminar el prefijo si el usuario lo borra
    const prefix = `${idx + 1}.- `;
    let cleanValue = value.startsWith(prefix)
      ? value.slice(prefix.length)
      : value;
    // No permitir saltos de línea en el input
    cleanValue = cleanValue.replace(/\n/g, '');
    const newObjectives = [...objectives];
    newObjectives[idx] = cleanValue;
    setObjectives(newObjectives);
  };

  const handleAddObjective = () => {
    if (objectives.length < 5) {
      setObjectives([...objectives, '']);
      setTimeout(() => {
        inputRefs.current[objectives.length]?.focus();
      }, 0);
    }
  };

  const handleRemoveObjective = (idx: number) => {
    if (objectives.length > 3) {
      const newObjectives = objectives.filter((_, i) => i !== idx);
      setObjectives(newObjectives);
      setTimeout(() => {
        inputRefs.current[Math.max(0, idx - 1)]?.focus();
      }, 0);
    }
  };

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
      <div className='space-y-2'>
        {objectives.map((obj, idx) => (
          <div key={idx} className='flex items-center gap-2'>
            <span className='min-w-[2.5rem] text-gray-700 font-semibold'>{`${
              idx + 1
            }.-`}</span>
            <input
              ref={el => {
                inputRefs.current[idx] = el;
              }}
              type='text'
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] transition-all duration-200 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder={`Escribe el objetivo ${idx + 1}...`}
              value={obj}
              onChange={e => !disabled && handleChange(idx, e.target.value)}
              maxLength={60}
              disabled={disabled}
              autoComplete='off'
            />
            {objectives.length > 3 && !disabled && idx >= 3 && (
              <button
                type='button'
                className='text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors duration-200'
                onClick={() => handleRemoveObjective(idx)}
                aria-label='Eliminar objetivo'
              >
                ×
              </button>
            )}
            {idx === objectives.length - 1 &&
              objectives.length < 5 &&
              !disabled && (
                <button
                  type='button'
                  className='text-[#F34602] hover:text-[#02082C] px-2 py-1 rounded transition-colors duration-200 flex items-center'
                  onClick={handleAddObjective}
                  aria-label='Agregar objetivo'
                >
                  <Plus className='w-5 h-5' />
                </button>
              )}
          </div>
        ))}
        <div className='text-xs text-gray-500 mt-1'>
          Mínimo 3 y máximo 5 objetivos. Usa el botón <b>+</b> para agregar otro
          objetivo. Puedes eliminar con la X (mínimo 3).
        </div>
      </div>
    </div>
  );
}
