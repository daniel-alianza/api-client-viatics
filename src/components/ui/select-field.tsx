import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
  className = '',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className={`mb-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label
        htmlFor={id}
        className='block text-sm font-medium mb-1 text-gray-700'
      >
        {label} {required && <span className='text-[#F34602]'>*</span>}
      </label>
      <div className='relative'>
        <motion.div
          whileTap={{ scale: disabled ? 1 : 0.99 }}
          className={`relative rounded-md overflow-hidden transition-all duration-200 ${
            isFocused ? 'ring-2 ring-[#F34602]' : 'ring-1 ring-gray-300'
          } ${disabled ? 'bg-gray-100' : ''}`}
        >
          <select
            id={id}
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setIsOpen(false);
            }}
            onClick={() => setIsOpen(!isOpen)}
            className={`block w-full px-4 py-3 text-gray-900 border-0 appearance-none focus:outline-none focus:ring-0 pr-10 ${
              disabled ? 'cursor-not-allowed text-gray-500' : ''
            }`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown
                className={`w-5 h-5 ${
                  disabled ? 'text-gray-400' : 'text-gray-400'
                }`}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
