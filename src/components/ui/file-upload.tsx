import type React from 'react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, FileIcon } from 'lucide-react';
import type { FileType } from '@/features/TravelExpense-Checks/interfaces/types';

interface FileUploadProps {
  id: string;
  label: string;
  acceptedFileTypes: FileType[];
  files: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  acceptedFileTypes,
  files,
  onChange,
  required = false,
  className = '',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    if (disabled) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles = newFiles.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        return acceptedFileTypes.includes(extension as FileType);
      });

      onChange([...files, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (extension === 'pdf') {
      return <FileText className='w-5 h-5 text-red-500' />;
    } else if (extension === 'xml') {
      return <FileIcon className='w-5 h-5 text-blue-500' />;
    }

    return <FileIcon className='w-5 h-5 text-gray-500' />;
  };

  return (
    <motion.div
      className={`mb-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      as='div'
    >
      <label
        htmlFor={id}
        className='block text-sm font-medium mb-1 text-gray-700'
      >
        {label} {required && <span className='text-[#F34602]'>*</span>}
      </label>

      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-[#F34602] bg-orange-50'
            : 'border-gray-300 hover:border-[#F34602] hover:bg-gray-50'
        } ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed opacity-70'
            : 'cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        as='div'
      >
        <div className='flex flex-col items-center justify-center space-y-2 text-center'>
          <Upload
            className={`w-10 h-10 ${
              disabled ? 'text-gray-400' : 'text-[#F34602]'
            }`}
          />
          <p className='text-sm font-medium text-gray-700'>
            {disabled
              ? 'File upload is disabled'
              : 'Drag and drop files here, or click to select files'}
          </p>
          <p className='text-xs text-gray-500'>
            Accepted file types:{' '}
            {acceptedFileTypes.map(type => `.${type}`).join(', ')}
          </p>
        </div>
        <input
          ref={fileInputRef}
          id={id}
          type='file'
          accept={acceptedFileTypes.map(type => `.${type}`).join(',')}
          onChange={handleFileChange}
          className='hidden'
          multiple
          disabled={disabled}
        />
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='mt-4 space-y-2'
          >
            <p className='text-sm font-medium text-gray-700'>Uploaded Files:</p>
            <ul className='space-y-2'>
              {files.map((file, index) => (
                <motion.li
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className='flex items-center justify-between p-3 bg-white rounded-md shadow-sm border border-gray-200'
                >
                  <div className='flex items-center space-x-2'>
                    {getFileIcon(file.name)}
                    <span className='text-sm truncate max-w-[200px]'>
                      {file.name}
                    </span>
                  </div>
                  {!disabled && (
                    <button
                      type='button'
                      onClick={e => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className='text-gray-400 hover:text-[#F34602] transition-colors'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
