/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';

export default function HexagonButton({
  option,
  index,
  activeMenu,
  handleMenuHover,
  handleMenuLeave,
  handleOptionClick,
}: {
  option: any;
  index: number;
  activeMenu: string | null;
  handleMenuHover: (id: string) => void;
  handleMenuLeave: () => void;
  handleOptionClick: (id: string) => void;
}) {
  return (
    <motion.div
      className='relative mx-4'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <motion.button
        className='relative w-[200px] h-[230px] flex flex-col items-center justify-center bg-white rounded-2xl overflow-hidden transition-all duration-300'
        style={{
          clipPath:
            'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          boxShadow:
            activeMenu === option.id
              ? `0 20px 40px ${option.color}30`
              : '0 10px 30px rgba(0,0,0,0.08)',
        }}
        onMouseEnter={() => handleMenuHover(option.id)}
        onMouseLeave={handleMenuLeave}
        onClick={() => handleOptionClick(option.id)}
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.div
          className='absolute inset-0 opacity-0 transition-opacity duration-300'
          style={{
            background: `linear-gradient(135deg, ${option.color}10, ${option.color}30)`,
            opacity: activeMenu === option.id ? 1 : 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: activeMenu === option.id ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className='w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg transition-all duration-300'
          style={{
            backgroundColor:
              activeMenu === option.id ? `${option.color}20` : 'white',
            boxShadow:
              activeMenu === option.id
                ? `0 10px 25px ${option.color}30`
                : '0 5px 15px rgba(0,0,0,0.05)',
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <option.icon className='w-10 h-10' style={{ color: option.color }} />
        </motion.div>
        <motion.span
          className='text-center font-medium text-lg px-4'
          style={{ color: activeMenu === option.id ? option.color : '#02082C' }}
          animate={{
            color: activeMenu === option.id ? option.color : '#02082C',
            scale: activeMenu === option.id ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {option.label}
        </motion.span>
        <motion.div
          className='absolute bottom-[15%] left-1/2 transform -translate-x-1/2 h-1 bg-[#F34602] rounded-full'
          initial={{ width: 0 }}
          animate={{ width: activeMenu === option.id ? 40 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.div>
  );
}
