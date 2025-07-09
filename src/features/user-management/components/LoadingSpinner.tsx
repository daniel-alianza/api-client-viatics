import type React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className='flex items-center justify-center p-8'>
      <div className='relative'>
        <div className='w-12 h-12 border-4 border-gray-200 rounded-full animate-spin'></div>
        <div className='absolute top-0 left-0 w-12 h-12 border-4 border-[#F34602] border-t-transparent rounded-full animate-spin'></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
