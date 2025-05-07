import { memo } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { useMenu } from '@/features/dashboard/hooks/useMenu';

interface SubMenuProps {
  selectedOption: string;
  handleSubOptionClick: (id: string) => void;
  closePanel: () => void;
}

export const SubMenu = memo(
  ({ selectedOption, handleSubOptionClick, closePanel }: SubMenuProps) => {
    const { menuOptions, subMenuOptions } = useMenu();
    const selectedMenu = menuOptions.find(opt => opt.id === selectedOption);
    const options = subMenuOptions[selectedOption] || [];

    return (
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closePanel}
      >
        <motion.div
          className='relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl'
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div
            className='h-2 w-full'
            style={{ backgroundColor: selectedMenu?.color || '#F34602' }}
          />

          <div className='p-8'>
            <div className='flex justify-between items-center mb-8'>
              <div className='flex items-center'>
                <div
                  className='w-14 h-14 rounded-xl flex items-center justify-center mr-4 shadow-md'
                  style={{ backgroundColor: `${selectedMenu?.color}15` }}
                >
                  {selectedMenu?.icon && (
                    <selectedMenu.icon
                      className='w-7 h-7'
                      style={{ color: selectedMenu.color }}
                    />
                  )}
                </div>
                <h2 className='text-2xl font-bold text-[#02082C]'>
                  {selectedMenu?.label}
                </h2>
              </div>

              <motion.button
                className='w-10 h-10 rounded-full flex items-center justify-center text-[#02082C] hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-100'
                onClick={closePanel}
                whileHover={{ rotate: 90 }}
              >
                <X className='w-5 h-5' />
              </motion.button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              {options.map((subOption, index) => (
                <motion.button
                  key={subOption.id}
                  className='group relative overflow-hidden rounded-xl bg-white border border-gray-100 p-5 hover:border-transparent transition-all duration-300'
                  style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                  onClick={() => handleSubOptionClick(subOption.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-medium text-[#02082C] group-hover:text-[#F34602] transition-colors duration-200'>
                      {subOption.label}
                    </span>
                    <motion.div
                      className='w-8 h-8 rounded-full flex items-center justify-center'
                      style={{ backgroundColor: `${selectedMenu?.color}10` }}
                      whileHover={{ x: 3, scale: 1.1 }}
                    >
                      <ChevronRight
                        className='w-5 h-5'
                        style={{ color: selectedMenu?.color }}
                      />
                    </motion.div>
                  </div>

                  <div
                    className='absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300'
                    style={{ backgroundColor: selectedMenu?.color }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  },
);
