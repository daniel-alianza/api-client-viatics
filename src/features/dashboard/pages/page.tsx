import { useMenu } from '@/features/dashboard/hooks/useMenu';
import MainContent from '@/features/dashboard/components/MainContent';
import { DetailPanel } from '@/features/dashboard/components/ui/DetailPanel';
import { Search, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const {
    selectedOption,
    searchFocused,
    setSearchFocused,
    handleSubOptionClick,
    closePanel,
  } = useMenu();

  return (
    <div className='min-h-screen bg-white overflow-hidden'>
      {/* Decorative background elements */}
      <div className='fixed top-0 right-0 w-[600px] h-[600px] bg-[#F34602]/5 rounded-full -mr-[300px] -mt-[300px] blur-3xl' />
      <div className='fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#02082C]/5 rounded-full -ml-[200px] -mb-[200px] blur-3xl' />

      {/* Header */}
      <header className='relative z-10 px-8 py-6 flex justify-between items-center bg-white shadow-sm'>
        <div className='flex items-center'>
          <div className='relative w-12 h-12'>
            <div className='absolute inset-0  rounded-lg rotate-45 transform origin-center shadow-lg' />
            <div className='absolute inset-0 flex items-center justify-center text-white font-bold text-xl'>
              <img
                src='./GrupoFG_Logo.png'
                alt='logo'
                width={120}
                height={120}
              />
            </div>
          </div>
          <h1 className='ml-3 text-2xl font-bold text-[#02082C]'>
            Portal Grupo FG{' '}
          </h1>
        </div>

        <div className='flex items-center space-x-6'>
          <motion.div
            className={`relative flex items-center ${
              searchFocused ? 'w-64' : 'w-40'
            }`}
            animate={{ width: searchFocused ? 250 : 160 }}
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            <input
              type='text'
              placeholder='Search...'
              className='w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#F34602]/20 focus:border-[#F34602] outline-none transition-all duration-300'
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
          </motion.div>

          <motion.div
            className='relative'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className='relative w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow duration-300'>
              <Bell className='w-5 h-5 text-[#02082C]' />
              <span className='absolute top-0 right-0 w-3 h-3 bg-[#F34602] rounded-full border-2 border-white pulse'></span>
            </button>
          </motion.div>

          <motion.div
            className='w-10 h-10 rounded-full bg-[#02082C] flex items-center justify-center shadow-md hover:shadow-lg cursor-pointer'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className='text-white font-medium text-sm'>JD</span>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <MainContent />

      <DetailPanel
        selectedOption={selectedOption}
        closePanel={closePanel}
        handleSubOptionClick={handleSubOptionClick}
      />
    </div>
  );
}
