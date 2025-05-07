import { motion } from 'framer-motion';
import HexagonButton from '@/features/dashboard/components/HexagonButton';
import { useMenu } from '@/features/dashboard/hooks/useMenu';
import { SubMenu } from '@/features/dashboard/components/SubMenu';
import { useDailyQuote } from '@/features/dashboard/hooks/useDailyQuote';

export default function MainContent() {
  const {
    activeMenu,
    selectedOption,
    menuOptions,
    subMenuOptions,
    handleMenuHover,
    handleMenuLeave,
    handleOptionClick,
    handleSubOptionClick,
    closePanel,
  } = useMenu();

  const { randomQuote } = useDailyQuote();

  // Obtener el nombre del usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'Usuario';

  return (
    <main className='relative z-10 px-8 py-10'>
      <div className='max-w-7xl mx-auto'>
        <motion.h2
          className='text-3xl font-bold text-[#02082C] mb-12 text-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Bienvenido de nuevo, {userName}
        </motion.h2>

        <div className='flex flex-col items-center justify-center py-2'>
          <hr className='w-full border-t border-gray-300' />
          {randomQuote && (
            <div className='text-center py-2'>
              <div className='overflow-hidden whitespace-nowrap'>
                <motion.p
                  className='italic'
                  animate={{
                    x: [300, -300],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  "{randomQuote.content} - {randomQuote.author}"
                </motion.p>
              </div>
            </div>
          )}
          <hr className='w-full border-t border-gray-300' />
        </div>

        {/* Hexagonal Menu */}
        <div className='relative mb-20'>
          <div className='flex flex-wrap justify-center max-w-5xl mx-auto'>
            <div className='flex justify-center w-full mb-8'>
              {menuOptions.slice(0, 3).map((option, index) => (
                <HexagonButton
                  key={option.id}
                  option={option}
                  index={index}
                  activeMenu={activeMenu}
                  handleMenuHover={handleMenuHover}
                  handleMenuLeave={handleMenuLeave}
                  handleOptionClick={handleOptionClick}
                />
              ))}
            </div>
            <div className='flex justify-center w-full'>
              {menuOptions.slice(3).map((option, index) => (
                <HexagonButton
                  key={option.id}
                  option={option}
                  index={index + 3}
                  activeMenu={activeMenu}
                  handleMenuHover={handleMenuHover}
                  handleMenuLeave={handleMenuLeave}
                  handleOptionClick={handleOptionClick}
                />
              ))}
            </div>
          </div>
        </div>
        {selectedOption && subMenuOptions[selectedOption] && (
          <SubMenu
            selectedOption={selectedOption}
            subMenuOptions={subMenuOptions[selectedOption]}
            handleSubOptionClick={handleSubOptionClick}
            closePanel={closePanel} // Pasar la función closePanel
          />
        )}
      </div>
    </main>
  );
}
