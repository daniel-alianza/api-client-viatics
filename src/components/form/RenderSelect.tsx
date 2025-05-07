import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { forwardRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
};

interface RenderSelectProps {
  placeholder: string;
  values: Option[];
  onChange?: (value: string) => void;
  selectedValue?: string;
  loading?: boolean;
  label?: string;
  disabled?: boolean;
  onError?: (title: string, message: string) => void;
  parentSelected?: boolean;
}

export const RenderSelect = forwardRef<HTMLButtonElement, RenderSelectProps>(
  (
    {
      placeholder,
      values,
      onChange,
      selectedValue,
      loading,
      label,
      disabled,
      onError,
      parentSelected,
    },
    ref,
  ) => {
    // Verificar si hay datos disponibles cuando no está cargando
    useEffect(() => {
      // Solo mostrar error si:
      // 1. No está cargando
      // 2. No hay valores
      // 3. Hay un callback de error
      // 4. No es el estado inicial (loading es false y values está vacío)
      if (
        !loading &&
        values.length === 0 &&
        onError &&
        (selectedValue || label === 'Empresas')
      ) {
        if (label === 'Empresas') {
          onError(
            'No hay empresas disponibles',
            'No se encontraron empresas en el sistema. Por favor, contacta al administrador para que configure las empresas.',
          );
        } else if (label === 'Sucursales' && parentSelected) {
          onError(
            'No hay sucursales disponibles',
            'No se encontraron sucursales para la empresa seleccionada. Por favor, contacta al administrador para que configure las sucursales.',
          );
        } else if (label === 'Áreas' && parentSelected) {
          onError(
            'No hay áreas disponibles',
            'No se encontraron áreas para la sucursal seleccionada. Por favor, contacta al administrador para que configure las áreas.',
          );
        } else if (label === 'Manager' && parentSelected) {
          onError(
            'No hay managers disponibles',
            'No se encontraron managers en el área seleccionada. Por favor, contacta al administrador para que configure los managers.',
          );
        }
      }
    }, [loading, values.length, label, onError, selectedValue, parentSelected]);

    return (
      <Select
        value={selectedValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger ref={ref} className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}
            {loading ? (
              <SelectItem value='loading' disabled>
                Cargando...
              </SelectItem>
            ) : (
              values.map(val => (
                <SelectItem key={val.value} value={val.value}>
                  {val.label}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
);

RenderSelect.displayName = 'RenderSelect';
