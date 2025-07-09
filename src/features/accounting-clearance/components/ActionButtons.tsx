import React from 'react';
import { ActionButtonsProps } from '../interfaces/comprobacionestable.Interface';

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDecline,
  onSend,
}) => {
  return (
    <div className='mt-6 flex justify-end space-x-4 pb-4'>
      <button
        type='button'
        onClick={onDecline}
        className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      >
        Declinar
      </button>
      <button
        type='button'
        onClick={onSend}
        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      >
        Enviar
      </button>
    </div>
  );
};
