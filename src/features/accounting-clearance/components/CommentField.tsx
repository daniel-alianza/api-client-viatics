import React from 'react';
import { CommentFieldProps } from '../interfaces/comprobacionestable.Interface';

export const CommentField: React.FC<CommentFieldProps> = ({
  comment,
  setComment,
}) => {
  return (
    <div className='mt-6'>
      <label
        htmlFor='comment'
        className='block text-sm font-medium text-gray-700 mb-2'
      >
        Comentario
      </label>
      <div className='mt-1'>
        <textarea
          rows={3}
          name='comment'
          id='comment'
          value={comment}
          onChange={e => setComment(e.target.value)}
          className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2'
          placeholder='Agrega un comentario si es necesario'
        />
      </div>
    </div>
  );
};
