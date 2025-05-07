/* eslint-disable no-constant-binary-expression */
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, UserRound, X } from 'lucide-react';
import { menuOptions, subMenuOptions } from '@/lib/menuOptions';

interface DetailPanelProps {
  selectedOption: string | null;
  closePanel: () => void;
  handleSubOptionClick: (id: string) => void;
}

export const DetailPanel = ({
  selectedOption,
  closePanel,
  handleSubOptionClick,
}: DetailPanelProps) => {
  const selected = menuOptions.find(
    (opt: { id: string }) => opt.id === selectedOption,
  );

  return (
    <AnimatePresence>
      {selectedOption && (
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
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
              transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.4,
              },
            }}
            exit={{
              scale: 0.9,
              y: 20,
              opacity: 0,
              transition: { duration: 0.25 },
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className='h-2 w-full'
              style={{
                backgroundColor: selected?.color || '#F34602',
              }}
            />

            <div className='p-8'>
              <div className='flex justify-between items-center mb-8'>
                <div className='flex items-center'>
                  <div
                    className='w-14 h-14 rounded-xl flex items-center justify-center mr-4 shadow-md'
                    style={{
                      backgroundColor: `${selected?.color}15` || '#F3460215',
                    }}
                  >
                    {selected?.icon && (
                      <selected.icon
                        className='w-7 h-7'
                        style={{ color: selected?.color || '#F34602' }}
                      />
                    )}
                  </div>
                  <h2 className='text-2xl font-bold text-[#02082C]'>
                    {selected?.label}
                  </h2>
                </div>

                <motion.button
                  className='w-10 h-10 rounded-full flex items-center justify-center text-[#02082C] hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200'
                  onClick={closePanel}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className='w-5 h-5' />
                </motion.button>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                {subMenuOptions[
                  selectedOption as keyof typeof subMenuOptions
                ].map(
                  (subOption: { id: string; label: string }, index: number) => (
                    <motion.button
                      key={subOption.id}
                      className='group relative overflow-hidden rounded-xl bg-white border border-gray-100 p-5 hover:border-transparent transition-all duration-300'
                      style={{
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      }}
                      onClick={() => handleSubOptionClick(subOption.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.07, duration: 0.3 },
                      }}
                      whileHover={{
                        y: -5,
                        boxShadow: `0 15px 30px ${selected?.color}20`,
                      }}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='font-medium text-[#02082C] group-hover:text-[#F34602] transition-colors duration-200'>
                          {subOption.label}
                        </span>
                        <motion.div
                          className='w-8 h-8 rounded-full flex items-center justify-center'
                          style={{
                            backgroundColor: `${selected?.color}10`,
                          }}
                          initial={{ x: 0 }}
                          whileHover={{ x: 3, scale: 1.1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <ChevronRight
                            className='w-5 h-5 transition-colors duration-200'
                            style={{ color: selected?.color || '#F34602' }}
                          />
                        </motion.div>
                      </div>

                      <div
                        className='absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300'
                        style={{
                          backgroundColor: selected?.color || '#F34602',
                        }}
                      />
                    </motion.button>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
