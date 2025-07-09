import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  className = '',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

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
      <motion.div
        whileTap={{ scale: disabled ? 1 : 0.99 }}
        className={`relative rounded-md overflow-hidden transition-all duration-200 ${
          isFocused ? 'ring-2 ring-[#F34602]' : 'ring-1 ring-gray-300'
        } ${disabled ? 'bg-gray-100' : ''}`}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full px-4 py-3 text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-0 ${
            disabled ? 'cursor-not-allowed text-gray-500' : ''
          }`}
        />
      </motion.div>
    </motion.div>
  );
};
