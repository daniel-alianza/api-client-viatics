import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SubMenuProps {
  selectedOption: string;
  onClose: () => void;
  onSubOptionClick?: (subOptionId: string) => void;
}

interface SubOption {
  id: string;
  label: string;
}

const subMenuOptions: Record<string, SubOption[]> = {
  verification: [
    { id: 'expense-verification', label: 'Verificación de Gastos' },
    { id: 'travel-verification', label: 'Verificación de Viajes' },
  ],
};

export const SubMenu: React.FC<SubMenuProps> = ({
  selectedOption,
  onClose,
  onSubOptionClick,
}) => {
  const options = subMenuOptions[selectedOption] || [];

  const handleSubOptionClick = (subOptionId: string) => {
    if (onSubOptionClick) {
      onSubOptionClick(subOptionId);
    }
    onClose();
  };

  return (
    <motion.div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className='bg-white rounded-lg p-6 w-full max-w-md'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>{selectedOption}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-6 h-6' />
          </button>
        </div>
        <div className='space-y-2'>
          {options.map((subOption: SubOption) => (
            <button
              key={subOption.id}
              className='w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md'
              onClick={() => handleSubOptionClick(subOption.id)}
            >
              {subOption.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
