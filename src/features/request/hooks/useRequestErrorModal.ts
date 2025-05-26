import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'success';
}

export const useRequestErrorModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
  });

  const showErrorModal = (title: string, message: string) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: 'error',
    });
  };

  const showWarningModal = (title: string, message: string) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: 'warning',
    });
  };

  const showSuccessModal = (title: string, message: string) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type: 'success',
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    modalState,
    showErrorModal,
    showWarningModal,
    showSuccessModal,
    closeModal,
  };
};
